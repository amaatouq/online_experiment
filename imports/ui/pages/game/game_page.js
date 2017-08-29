import '../loader/loader';
import './game_page.html'

import '../../components/game/game_progress.js';
import '../../components/game/game_userInformation';


import { Rounds, Games } from '../../../api/games/games';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';


let countdown = null;

Template.game_page.onCreated(function() {
    startTimeOut();

    Session.setPersistent('page','game');
    const gameStage = Session.get('gameStage');
    if (!gameStage){
        Session.setPersistent('gameStage','initial');
    }
    this.subscribe('games.userGame',(err,res)=>{
        if (err){
            console.log('error while trying to subscribe to the game')
        } else{
            this.subscribe('games.userRound',Games.findOne({players: Meteor.userId()}).currentRound);
        }
    });
});


Template.game_page.helpers({
    stage(){
        const currentStage = Games.findOne({players: Meteor.userId()}).stage;
        let initial = false;
        let interactive = false;
        let roundOutcome = false;
        switch(currentStage){
            case ('initial'):
                initial = true;
                break;
            case('interactive'):
                interactive = true;
                break;
            case('roundOutcome'):
                roundOutcome = true;
                break;
        }
        return {initial:initial,interactive:interactive,roundOutcome:roundOutcome}
    },
    game() {
        return Games.findOne({players: Meteor.userId()});
    },
    currentNeighbors(){
        const currentRound = Games.findOne({players: Meteor.userId()}).currentRound;
        console.log(Rounds.findOne({ userId: Meteor.userId(), round:currentRound}));
        return  Rounds.findOne({ userId: Meteor.userId(), round:currentRound}).neighbors;
    },
    avatar() {
        return Meteor.user().avatar;
    },
    countDown() {
        const timeRemained = countdown.get();
        Session.setPersistent('timeRemained',timeRemained);
        return timeRemained

    },


});


//This is the round timeout function
function roundTimedOut () {
    // do something when this is completed
    console.log('Timeout for the round');
    Session.setPersistent('roundTimeOutIsSet',false)
}

function startTimeOut () {
    if (!Session.get('roundTimeOutIsSet')){
        countdown = new ReactiveCountdown(ROUND_TIMEOUT);
        Session.setPersistent('roundTimeOutIsSet',true);
    } else {
        countdown = new ReactiveCountdown(Session.get('timeRemained')-1)
    }
    countdown.start(function () {
        roundTimedOut()
    })
}