import { Meteor } from 'meteor/meteor';

Meteor.methods({
    'users.createUser'(random_username,random_password) {
        user = Accounts.createUser({
            username: random_username,
            password: random_password
        });
        return user;
    },

    //General purpose document modification function for the user
    'users.updateUserInfo'(data,operation) {
        if (operation === 'set') {
            Meteor.users.update(this.userId, {$set: data});
        } else if (operation === 'inc') {
            Meteor.users.update(this.userId, {$inc: data});
        } else if (operation === 'dec') {
            Meteor.users.update(this.userId, {$dec: data});
        }
    }

});