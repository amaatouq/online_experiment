import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor'

export const Lobbies = new Mongo.Collection('lobbies');

Lobbies.after.update((userId, lobby, fieldNames, modifier, options)=>{
    //if we get the required number of players, we make the lobby full and start a new game
    if (fieldNames[0] ==='players'){
        if (lobby.players.length === lobby.groupSize){
            console.log('the lobby is full now');
            Lobbies.update({_id:lobby._id}, {$set:{lobbyStatus:'full'}});
            //create a new game
            Meteor.call('games.createGame',lobby)
        }

    }


});