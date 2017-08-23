import {Meteor} from 'meteor/meteor'

Meteor.publish('users.user', function(currentUser) {
    let user=  Meteor.users.find({_id:currentUser}, {
        fields: {
            _id: 1,
            enterTime: 1,
            page: 1,
            passedQuiz: 1,
            exitStatus: 1,
            quizAttempts:1,
            condition:1,
            avatar: 1,
            score:1,
            bonus: 1,
            lobbyTimeout: 1,
            gameId: 1
        }
    });
    if ( user ) {
        return user;
    }
    return this.ready();
});


Meteor.publish("users.userStatus", function(gameId) {
    let onlineUsers = Meteor.users.find({ "status.online": true, "gameId": gameId });
    if ( onlineUsers ) {
        return onlineUsers;
    }
    return this.ready();

});

//what happens to user when they disconnect or connect
Meteor.users.find({ "status.online": true }).observe({
    added: function(id) {
        // id just came online
    },
    removed: function(id) {
        // id just went offline
        console.log(id+' went offline')
    }
});
