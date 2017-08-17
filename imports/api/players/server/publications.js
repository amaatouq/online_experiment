import { Meteor } from 'meteor/meteor'
import { Players } from "../players";

Meteor.publish('players.playerData', function () {
    let currentPlayer = Players.find( { _id: this.userId },
        {
        fields: {
            status: 1,
            passedQuiz: 1,
            quizAttempts: 1,
            condition: 1,
            avatar: 1,
            score: 1,
        }
        });
    if ( currentPlayer ) {
        return currentPlayer;
    }
    return this.ready();
});



