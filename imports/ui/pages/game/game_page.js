import '../loader/loader';
import './game_page.html'
import './game_initial_page'

import '../../components/game/game_progress.js';
import '../../components/game/game_userInformation';


import { Games } from '../../../api/games/games';
import { Rounds } from '../../../api/games/rounds';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var'

let countdown = new ReactiveVar(null);
let currentRoundId = new ReactiveVar(null);

Template.game_page.onCreated(function() {

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
    }


});


