import '../loader/loader';
import './game_page.html'
import './stages/game_initial_page'
import './stages/game_interactive_page.js'
import './stages/game_roundOutcome_page'

import '../../components/game/game_progress.js';
import '../../components/game/game_userInformation';


import { Games } from '../../../api/games/games';
import { Rounds } from '../../../api/games/rounds';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';


Template.game_page.onCreated(function() {

    //setup the regular pge stuff
    Session.setPersistent('page','game');
    if (Meteor.user()){
        if (Meteor.user().page!=='game'){
            Meteor.call('users.updateUserInfo',{page:'game'},'set');
        }
    }

    //subscribe to the game once
    this.subscribe('games.userGame');
    this.autorun(()=>{
        const game = Games.findOne({players:Meteor.userId()});
        if (game){
            console.log('subscribed to round');
            this.subscribe('games.userRound', game.currentRound);
        }
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

    avatar() {
        return Meteor.user().avatar;
    },
    InteractiveNeighbors(){
        //todo here you should get the rounds of the neigbhor which is a new subscription
        //rather than just giving their names
        const game = Games.findOne({players:Meteor.userId()});
        const userRound = Rounds.findOne({userId:Meteor.userId(),round:game.currentRound});
        return userRound.neighbors;
    },
    allPlayers(){
        //todo here you should get the users of the game rather than only their name list
        return  Games.findOne({players:Meteor.userId()}).players
    }


});





