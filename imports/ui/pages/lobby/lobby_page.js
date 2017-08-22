import './lobby_page.html';
import { Players } from "../../../api/players/players";
import { Games } from '../../../api/games/games';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

Template.lobby_page.onCreated(function() {
    //if there is no timer, start a new one
    if (!Session.get('sTime')) {
        Session.setPersistent('sTime',new Date());
    }

    //get the player condition
    const condition = Players.find({_id:Meteor.userId()}).condition;
    //get the player assigned game
    const userGame = Players.find({_id:Meteor.userId()}).gameId;

    const availableGamesHandler = Meteor.subscribe('games.availableGames',condition);
    //if the user doesn't belong to game already, there are two options
    //there is a game that the user could join
    //otherwise, create a new game and add the user to it
    Tracker.autorun(()=>{
        //wait until the available games become ready
        if (!userGame && availableGamesHandler.ready()) {
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


        } else {
            //availableGamesHandler.stop();
        }
    });









});


Template.lobby_page.helpers({

    desiredNumPlayers(){
        const playerData = Players.findOne(Meteor.userId());
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
            Meteor.call('players.updatePlayerInfo',Meteor.userId(),{exitStatus:'lobbyTimeout'},'set');
            Session.setPersistent('userStatus','exit');
            Meteor.call('players.updatePlayerInfo',Meteor.userId(),{status:'exit'},'set');
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
