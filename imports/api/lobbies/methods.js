import { Meteor } from 'meteor/meteor';
import { Lobbies } from './lobbies.js';


Meteor.methods({
    'lobbies.createLobby'(condition){
        const lobbyId = String(incrementCounter('countCollection', 'lobbyId'));
        Lobbies.insert({
            _id: lobbyId ,
            createTime: new Date(),
            players: [],
            condition: condition,
            lobbyTimeout: LOBBY_TIMEOUT,
            lobbyStatus: 'waiting'
        });
        return lobbyId;
    },

    'lobbies.joinLobby'(lobbyId) {
        Lobbies.upsert({_id:lobbyId}, {$push: {players:this.userId}});
        Meteor.users.update({_id:this.userId}, {$set: {lobbyId:lobbyId}});
    },
    'lobbies.leaveLobby'() {
        const lobbyId = Meteor.users.findOne({_id:this.userId}).lobbyId;
        Lobbies.update({_id:lobbyId}, {$pull: {players:this.userId}})
    }

});
