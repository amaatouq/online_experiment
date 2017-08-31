import {Meteor} from 'meteor/meteor'

Meteor.publish('users.user', function() {
    let user=  Meteor.users.find({_id:this.userId}, {
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
            gameId: 1,
            condInfo: 1,
            currentRound:1,
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
