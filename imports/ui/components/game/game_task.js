import './game_task.html'

import {Template} from 'meteor/templating'
import {Games} from "../../../api/games/games";
import {Rounds} from "../../../api/games/rounds";
import {Meteor} from 'meteor/meteor'
import {Session} from 'meteor/session';


Template.game_task.onCreated(()=>{
    const game = Games.findOne({players: Meteor.userId()});

    Meteor.autorun(()=>{
        const userRound = Rounds.findOne({userId: Meteor.userId(), round: game.currentRound});
        if (userRound){
            //if we are in the initial stage, check if there is an initial answer
            if (game.stage === 'initial') {
                console.log('I am in initial of ',userRound.initialAnswer, ' with user ', Meteor.userId());
                Session.setPersistent('sliderValue', userRound.initialAnswer);
                // else we are in the interactive stage
            } else {
                //if in the interactive stage with no answer, then set the independent guess as the answer
                // otherwise, the revised guess as the answer
                if (userRound.interactiveAnswer===null){
                    Session.setPersistent('sliderValue', userRound.initialAnswer)
                } else {
                    Session.setPersistent('sliderValue', userRound.interactiveAnswer)
                }
            }
        }

    });



});

Template.game_task.onRendered(()=> {

    //ensure the 'waiting for other players is activated if the user is ready
    Meteor.autorun(() => {
        const game = Games.findOne({players: Meteor.userId()});
        const userRound = Rounds.findOne({userId: Meteor.userId(), round: game.currentRound});
        if (game && userRound) {
            const isReady = (game.stage + '.ready').split('.').reduce((o, i) => o[i], userRound);
            console.log(isReady);
            if (isReady) {
                console.log('I am ready in ',game.stage);
                this.$('#contributionSubmit').text("Waiting for other players... ").removeClass('btn-primary').addClass('btn-warning').prop('disabled', true);
            }
        }
    });


    /////// the slider stuff //////
    //todo: can we make this more 'meteor' than it is now?
    const game = Games.findOne({players: Meteor.userId()});
    this.$("#slider").slider({
        min: 0,
        max: 1,
        step: 0.01,
        value: Session.get('sliderValue'),
        //once created it, if there is no answer, then hide the default answer
        create: (event,ui)=>{
            //hide the default value if there is no answer yet
            if (Session.get('sliderValue') === null || Session.get('sliderValue') === undefined){
                $('#slider > .ui-slider-handle').hide();
            }
        },
        //on slide (continues) just show on the screen and show the default value
        slide: (event, ui)  => {
            $('#slider > .ui-slider-handle').show();
            Session.setPersistent('sliderValue',ui.value)
        },
        //save value to collection for both conditions (to work after refresh)
        change: (event, ui)  => {
            if (game.stage === 'initial'){
                Meteor.call('games.updateRoundInfo',{initialAnswer:ui.value},'set');
            } else {
                Meteor.call('games.updateRoundInfo',{interactiveAnswer:ui.value},'set');
            }

        }
    });


});




Template.game_task.helpers({
    getSliderValue(){
        const sliderValue = Session.get('sliderValue');
        if (sliderValue !== null){
            console.log('slider value to be returned',sliderValue);
            return String(sliderValue);
        }
    },
    getTask(){
        const game = Games.findOne({players: Meteor.userId()});
        const userRound = Rounds.findOne({userId: Meteor.userId(), round: game.currentRound});
        console.log(userRound.task);
        return userRound.task

    }

});


Template.game_task.events({
    'click button' (event){
        event.preventDefault();
        $('#contributionSubmit').text("Waiting for other players... ").removeClass('btn-primary').addClass('btn-warning').prop('disabled',true);
        //todo: disable the slider for this player, so they can't change their answers
        const game = Games.findOne( { players: Meteor.userId() });
        const currentStageReady = game.stage+'.ready';
        let data = {};
        data[currentStageReady]=true;
        // if it is the initial stage, make the first revised submission the same as the initial
        if (game.stage === 'initial'){
            data['initialAnswer']= Session.get('sliderValue');
        } else {
            //if it is the interactive stage, just update the interactive
            data['interactiveAnswer']=  Session.get('sliderValue');

        }
        Meteor.call('games.updateRoundInfo',data,'set');
    },

});