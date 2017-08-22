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

    //keep track of user condition
    const condition = Players.findOne(Meteor.userId()).condition;
    console.log('condition '+condition);
    let isReady = null;
    let currentUserGame = null;
    let availableGame = null;
    Tracker.autorun(() => {
        const userGameHandler = Meteor.subscribe('games.userGame',Meteor.userId());
        const availableGamesHandler = Meteor.subscribe('games.userGame',condition);
        isReady = userGameHandler.ready() && availableGamesHandler.ready();
        if (isReady) {
            //if the user is NOT belonging to game yet and no available games exit to join
            if (!currentUserGame && !availableGame) {
                console.log('There is no game for this user and not available games');
                //then create a game and make the user join it
                Meteor.call('games.createGame', condition,
                    //callback on game creation
                    (err, gameId) => {
                        console.log('so I will create a new game');
                        if (err) {
                            //the game wasn't created
                            console.log('error: '+err + ' while creating a new game')
                        } else {
                            //this game was created, now add the current user to it
                            console.log('and I will join this game #' +gameId);
                            Meteor.call('games.joinGame', gameId, Meteor.userId(),(err,res)=>{
                                console.log('now userGame is '+currentUserGame)
                            });
                        }
                    });
            } else if (!currentUserGame && availableGame) {
                console.log('There is already a game with #' +availableGame._id + ' so I should join it');
                Meteor.call('games.joinGame',availableGame._id,Meteor.userId());
                console.log('there is an available game with id '+availableGame._id+' to add '+Meteor.userId());
            }
        }
    });










    // //subscribe to the games that the user can join
    // if (availableGamesHandler.ready() && userGameHandler.ready()){
    //     //if the user is NOT belonging to game yet and no available games exit to join
    //     if (!userGame && !availableGame) {
    //         console.log('There is no game for this user and not availabe games');
    //         //then create a game and make the user join it
    //         Meteor.call('games.createGame', condition,
    //             //callback on game creation
    //             (err, gameId) => {
    //                 console.log('so I will create a new game');
    //                 if (err) {
    //                     //the game wasn't created
    //                     console.log(err + ' while creating a new game')
    //                 } else {
    //                     //this game was created, now add the current user to it
    //                     console.log('and I will join this game #' +gameId);
    //                     Meteor.call('games.joinGame', gameId, Meteor.userId(),()=>{
    //                         console.log('now userGame is '+userGame)
    //                     });
    //                 }
    //             });
    //     } else if (availableGame) {
    //         console.log('There is already a game with #' +availableGame._id + ' so I should join it');
    //         Meteor.call('games.joinGame',availableGame._id,Meteor.userId());
    //         console.log('there is an available game with id '+availableGame._id+' to add '+Meteor.userId());
    //     }
    //
    // }




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
