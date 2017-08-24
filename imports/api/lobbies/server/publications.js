import { Meteor } from 'meteor/meteor'
import { Lobbies } from "../lobbies.js";


Meteor.publish('lobbies.availableLobbies', function (condition) {
    let lobbyToJoin = Lobbies.find( { condition: condition, lobbyStatus:'waiting' });
    if ( lobbyToJoin ) {
        return lobbyToJoin;
    }
    return this.ready();
});

Meteor.publish('lobbies.userLobby', function () {
    let userLobby = Lobbies.find( { players: this.userId });
    if ( userLobby ) {
        return userLobby;
    }
    return this.ready();
});