import './game_task.html'

import {Template} from 'meteor/templating'
import {Games} from "../../../api/games/games";
import {Rounds} from "../../../api/games/rounds";
import {Meteor} from 'meteor/meteor'
import {Session} from 'meteor/session';

Template.game_task.onCreated(()=>{
    if (!Session.get("sliderValue")){
        Session.setPersistent('sliderValue', -1)
    }

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
        slide: function(event, ui) {
            $('#slider > .ui-slider-handle').show();
            Session.setPersistent('sliderValue',ui.value)
        },
        change: function(event, ui) {
            //save value to collection
        }
    });

    if (Session.get("sliderValue") === -1){
        $('#slider > .ui-slider-handle').hide();
    }

});




Template.game_task.helpers({
    getSliderValue(){
        const sliderValue = Session.get('sliderValue');
        if (sliderValue !== null){
            if (sliderValue> -1) {
                console.log('slider value to be returned',sliderValue);
                return String(sliderValue);
            }
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
        Meteor.call('games.updateRoundInfo',data,'set',()=>{
            Session.setPersistent('sliderValue', null)
        });
    },

});