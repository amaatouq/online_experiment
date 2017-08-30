import '../loader/loader';
import './game_page.html'

import '../../components/game/game_progress.js';
import '../../components/game/game_userInformation';


import { Rounds, Games } from '../../../api/games/games';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var'

let countdown = new ReactiveVar(null);
let currentRoundId = new ReactiveVar(null);

Template.game_page.onCreated(function() {
    Session.setPersistent('rerunTimer',true);

    //setting up the round timer
    Tracker.autorun(()=>{
        if (Session.get('rerunTimer')) {
            if (Session.get('timeRemained')) {
                //on refresh give them the same time
                countdown.set(new ReactiveCountdown(Session.get('timeRemained') - 1));
            } else {
                //if the first time it is run, then give the full time
                countdown.set(new ReactiveCountdown(ROUND_TIMEOUT));
            }
            //start the timer count down
            countdown.get().start(function () {
                stageTimedOut()
            });
            Session.setPersistent('rerunTimer',false);
        }
    });

    //setup the regular pge stuff
    Session.setPersistent('page','game');
    const gameStage = Session.get('gameStage');
    if (!gameStage){
        Session.setPersistent('gameStage','initial');
    }

    //resubscribe everytime the currentRoundId changes
    this.autorun(()=>{
        this.subscribe('games.userGame',()=>{
            currentRoundId.set(Games.findOne({players: Meteor.userId()}).currentRound);
        });
    });

    this.autorun(()=>{
        this.subscribe('games.userRound',currentRoundId.get());
    })


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
        const currentRoundData = Rounds.findOne({ userId: Meteor.userId(), round:currentRoundId.get()});
        console.log('currentuser',currentRoundData);
        if (currentRoundData){
            return currentRoundData.neighbors
        }

    },
    avatar() {
        return Meteor.user().avatar;
    },
    countDown() {
        const timeRemained = countdown.get().get();
        Session.setPersistent('timeRemained',timeRemained);
        return timeRemained

    },


});


//This is the stage timeout function
function stageTimedOut () {
    // do something when it timesout
    currentRoundId.set(Games.findOne({players: Meteor.userId()}).currentRound);
    Meteor.call('games.updateRoundInfo',currentRoundId.get(),{ready:true},'set',()=>{
        console.log('now I should turn rerun to True');
        Session.setPersistent('rerunTimer',true);
        Session.setPersistent('timeRemained',null);
        countdown.set(null);
    });
}
