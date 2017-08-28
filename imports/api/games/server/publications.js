import { Meteor } from 'meteor/meteor'
import {Rounds, Games} from "../games";




Meteor.publish('games.userGame', function () {
    let userGame = Games.find( { players: this.userId });
    if ( userGame ) {
        return userGame;
    }
    return this.ready();
});

Meteor.publish('games.userRound', function (currentRound) {
    let userRounds = Rounds.find( { userId: this.userId, round:currentRound});
    if ( userRounds ) {
        return userRounds;
    }
    return this.ready();
});