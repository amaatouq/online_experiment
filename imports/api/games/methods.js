import { Meteor } from 'meteor/meteor';
import { Games } from './games.js';
import { Players } from "../players/players";


Meteor.methods({
    'games.createGame'(condition){
        const gameId = String(incrementCounter('countCollection', 'gameId'));
        Games.insert({
            _id: gameId ,
            createTime: new Date(),
            players: [],
            condition: condition,
            lobbyTimeout: LOBBY_TIMEOUT,
            lobbyStatus: 'waiting'
        });
        return gameId;
    },

    'games.joinGame'(gameId) {
        Games.upsert({_id:gameId}, {$push: {players:this.userId}});
        Meteor.users.update({_id:this.userId}, {$set: {gameId:gameId}});
    },
    'games.leaveGame'() {
        const gameId = Meteor.users.findOne({_id:this.userId}).gameId;
        Games.update({_id:gameId}, {$pull: {players:this.userId}})
    }

});
