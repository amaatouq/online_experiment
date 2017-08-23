import {Meteor} from 'meteor/meteor'

Meteor.publish("userStatus", function() {
    return Meteor.users.find({ "status.online": true });
});

Meteor.users.find({ "status.online": true }).observe({
    added: function(id) {
        // id just came online
    },
    removed: function(id) {
        // id just went offline
        console.log(id+' went offline')
    }
});
