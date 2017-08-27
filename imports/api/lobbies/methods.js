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
            lobbyStatus: 'waiting',
            groupSize: (condition+'.GROUPS_SIZE').split('.').reduce((o, i) => o[i],CONDITIONS_SETTINGS)
        });
        return lobbyId;
    },

    'lobbies.joinLobby'(lobbyId) {
        const lobby = Lobbies.findOne({_id:lobbyId});
        if (!lobby){
            console.log('the lobby doesnt exist to join');
        }
        //make sure the lobby is not full and $addToSet ensures the user is not there already
        if (lobby.lobbyStatus === 'waiting') {
            Lobbies.upsert({_id:lobbyId}, {$addToSet: {players:this.userId}});
            Meteor.users.update({_id:this.userId}, {$set: {lobbyId:lobbyId}});
        } else {
            //if his lobby doesn't exist anymore,
            console.log('You are trying to join a lobby that is full or the game has already started.' +
                'we need to add you to a new lobby');
            Meteor.users.update({_id:this.userId}, {$set: {lobbyId:null}})
        }

    },
    'lobbies.leaveLobby'() {
        //make sure the game hasn't started
        const lobbyId = Meteor.users.findOne({_id:this.userId}).lobbyId;
        const lobby = Lobbies.findOne({_id:lobbyId});
        if (lobby.lobbyStatus === 'waiting') {
            Lobbies.update({_id:lobbyId}, {$pull: {players:this.userId}})
        }

    },


});
