import './lobby_page.html';
import { Games } from '../../../api/games/games';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

Template.lobby_page.onCreated(function() {
    //if there is no timer, start a new one
    if (!Session.get('sTime')) {
        Session.setPersistent('sTime',new Date());
    }

    //get the player condition
    const condition = Meteor.user().condition;
    //get the player assigned game
    const userGame = Meteor.user().gameId;


    //if the user has no game, check if there is available game to join, or create one
    if (!userGame) {
        let availableGame = Games.findOne({ condition: condition, lobbyStatus:'waiting'});
        //check if there is an available game, then join it, otherwise, create a game and join it
        if (availableGame){
            console.log('the user has no game but there is a game so he will join it');
            Meteor.call('games.joinGame',availableGame._id, Meteor.userId())
        } else {
            //no game so we will create it first
            Meteor.call('games.createGame',condition, (err,gameId)=>{
                //then on callback we will join it
                Meteor.call('games.joinGame',gameId,Meteor.userId())
            })
        }
    }






});


Template.lobby_page.helpers({

    desiredNumPlayers(){
        const playerData = Meteor.user.findOne(Meteor.userId());
        const GROUPS_SIZE = playerData.condition+'.GROUPS_SIZE';
        return GROUPS_SIZE.split('.').reduce((o, i) => o[i], CONDITIONS_SETTINGS);
    },

    numWaiting(){
        //todo figure out how many in the same lobby
        return 4
    },

    //doing the clock and as well the timeout
    clock(){
        Meteor.setInterval(()=>{
            const sTime = Session.get('sTime');
            const elapsed = (new Date() - sTime)/1000;
            const m = Math.floor(elapsed/60);
            let s = Math.floor(elapsed % 60);
            s = s < 10 ? "0" + s: s;
            Session.setPersistent('min',m);
            Session.setPersistent('sec',s);
        }, 900);
        //if the minutes are the same as the lobby_timeout take them to the exit survey
        if (Session.get('min') >= LOBBY_TIMEOUT) {
            Meteor.call('users.updateUserInfo',Meteor.userId(),{exitStatus:'lobbyTimeout'},'set');
            Session.setPersistent('userStatus','exit');
            Meteor.call('users.updateUserInfo',Meteor.userId(),{page:'exit'},'set');
            FlowRouter.go('/exit');
        }
        return {
            min: Session.get('min'),
            sec: Session.get('sec')
        };
    },
    lobbyTimeout() {
        return LOBBY_TIMEOUT;
    }

});
