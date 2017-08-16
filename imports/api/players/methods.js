import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Players } from './players.js';
import { Random } from 'meteor/random'

Meteor.methods({
    'players.addPlayer'() {
        console.log('I am in the method');
        const username = Random.id();

        const user = Accounts.createUser({
            username: username
        });

        //TODO: force login

        console.log(username);
        console.log(Meteor.userId());

        Players.insert({
            _id: username,
            enterTime: new Date(),
            status: 'instructions',
            passedQuiz: false,
            quizAttempts: 0,
            needRematch: false,
            condition: 'control'
        });

        if (user){
            return user
        } else {
            console.log('no user')
        }
    }
});


