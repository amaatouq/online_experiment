import { Meteor } from 'meteor/meteor'
import { Games } from "../games.js";

Meteor.publish('games.userGame', function (currentUser) {
    let currentGame = Games.find( { players: currentUser });
    if ( currentGame ) {
        return currentGame;
    }
    return this.ready();
});

Meteor.publish('games.availableGames', function (condition) {
    let gameToJoin = Games.find( { condition: condition, lobbyStatus:'waiting' });
    if ( gameToJoin ) {
        return gameToJoin;
    }
    return this.ready();
});