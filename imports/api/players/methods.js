import { Meteor } from 'meteor/meteor';
import { Players } from './players.js';
import { Accounts } from 'meteor/accounts-base';

Meteor.methods({
    'players.createUser'(random_username,random_password) {
        console.log('I am in the method');
        user = Accounts.createUser({
            username: random_username,
            password: random_password
        });
        return user;
    },

    'players.addPlayer'(){
        Players.insert({
            _id: this.userId,
            enterTime: new Date(),
            status: 'instructions',
            passedQuiz: false,
            quizAttempts: 0,
            needRematch: false,
            condition: 'control',
            consent: true
        });
    },

    'players.logOut'() {
        if (!this.userId) {
            Accounts._server.method_handlers.logout ();
            Accounts._server.method_handlers.logoutOtherClients ();
        }
    }



});


