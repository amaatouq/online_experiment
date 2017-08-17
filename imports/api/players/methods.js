import { Meteor } from 'meteor/meteor';
import { Players } from './players.js';
import { Accounts } from 'meteor/accounts-base';
import { Random } from 'meteor/random'

Meteor.methods({
    'players.createUser'(random_username,random_password) {
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
            condition: assignUserCondition(),
            avatar: null,
            score: 0,
            bonus: 0,
        });
    },


});

function assignUserCondition() {
    return Random.choice(CONDITIONS)
}
