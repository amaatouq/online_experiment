import { Meteor } from 'meteor/meteor'
import { Games } from "../games.js";


Meteor.publish('games.availableGames', function (condition) {
    let gameToJoin = Games.find( { condition: condition, lobbyStatus:'waiting' });
    if ( gameToJoin ) {
        return gameToJoin;
    }
    return this.ready();
});