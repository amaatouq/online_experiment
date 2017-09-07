import { Meteor } from 'meteor/meteor'
import { Games} from "../games";
import { Rounds } from '../rounds.js'
import { publishComposite } from 'meteor/reywood:publish-composite';



Meteor.publish('games.userGame', function () {
    const userGame = Games.find( { players: this.userId });
    if ( userGame ) {
        return userGame;
    }
    return this.ready();
});

Meteor.publish('games.userRound', function (currentRound) {
    const userRounds = Rounds.find( { userId: this.userId, round:currentRound});
    if ( userRounds ) {
        return userRounds;
    }
    return this.ready();
});



//check if we can use publishComposite? https://atmospherejs.com/reywood/publish-composite

Meteor.publish('games.userNeighbors', function (currentRound) {
    const userRounds = Rounds.findOne( { userId: this.userId, round:currentRound});
    console.log('userRound insider userNeighbors',userRounds);
    const neighborsData = Rounds.find({round:currentRound, userId: {$in : userRounds.neighbors}});

    if ( neighborsData ) {
        return neighborsData;
    }
    return this.ready();
});