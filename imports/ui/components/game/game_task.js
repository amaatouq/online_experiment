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
        console.log('the autorun for the guess');
        if (userRound){
            //if we are in the initial stage, check if there is an initial answer
            if (game.stage === 'initial') {
                console.log('the initial guess is',userRound.initialAnswer);
                if (userRound.initialAnswer){
                    Session.setPersistent('sliderValue', userRound.initialAnswer);
                } else {
                    Session.setPersistent('sliderValue', null);
                }
                // if we are in the intractive stage
            } else {
                //if in the interactive stage with no answer, then set the independent guess as the answer
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

    const game = Games.findOne({players: Meteor.userId()});
    console.log('game ', game);
    Meteor.autorun(() => {
        const userRound = Rounds.findOne({userId: Meteor.userId(), round: game.currentRound});
        if (game && userRound) {
            const isReady = (game.stage + '.ready').split('.').reduce((o, i) => o[i], userRound);
            console.log(isReady);
            if (isReady) {
                this.$('#contributionSubmit').text("Waiting for other players... ").removeClass('btn-primary').addClass('btn-warning').prop('disabled', true);
            }
        }
    });


    /////// the slider stuff //////
    this.$("#slider").slider({
        min: -0.0000,
        max: 1,
        step: 0.01,
        value: Session.get('sliderValue'),
        create: (event,ui)=>{
            //hide the default value if there is no answer yet
            if (Session.get('sliderValue') === null || Session.get('sliderValue') === undefined){
                $('#slider > .ui-slider-handle').hide();
            }
        },
        slide: (event, ui)  => {
            //on slide (continues) just show on the screen and show the default value
            $('#slider > .ui-slider-handle').show();
            Session.setPersistent('sliderValue',ui.value)
        },
        change: (event, ui)  => {
            //save value to collection for both conditions (to work after refresh)
            if (game.stage === 'initial'){
                Meteor.call('games.updateRoundInfo',{initialAnswer:ui.value});
            } else {
                Meteor.call('games.updateRoundInfo',{interactiveAnswer:ui.value});
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

});


Template.game_task.events({
    'click button' (event){
        event.preventDefault();
        $('#contributionSubmit').text("Waiting for other players... ").removeClass('btn-primary').addClass('btn-warning').prop('disabled',true);
        const game = Games.findOne( { players: Meteor.userId() });
        const currentStageReady = game.stage+'.ready';
        let data = {};
        data[currentStageReady]=true;
        if (game.stage === 'initial'){
            data['initialAnswer']= Session.get('sliderValue');
        } else {
            data['interactiveAnswer']=  Session.get('sliderValue');

        }
        Meteor.call('games.updateRoundInfo',data,'set');
    },

});