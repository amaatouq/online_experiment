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

    'games.joinGame'(gameId,currentUser) {
        Games.upsert({_id:gameId}, {$push: {players:currentUser}});
        Players.update({_id:currentUser}, {$set: {gameId:gameId}});
    },
    'games.leaveGame'(currentUser) {
        const gameId = Players.findOne({_id:currentUser}).gameId;
        Games.update({_id:gameId}, {$pull: {players:currentUser}})
    }

});
