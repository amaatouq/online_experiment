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
            exitStatus:null,
            quizAttempts: 0,
            condition: assignUserCondition(),
            avatar: null,
            score: 0,
            bonus: 0,
            lobbyTimeout: LOBBY_TIMEOUT,
            gameId: null
        });
    },

    //General purpose document modification function for the user
    'players.updatePlayerInfo'(currentUser,data,operation) {
        if (operation === 'set') {
            Players.update(currentUser, {$set: data});
        } else if (operation === 'inc') {
            Players.update(currentUser, {$inc: data});
        } else if (operation === 'dec') {
            Players.update(currentUser, {$dec: data});
        }
    }

    });

function assignUserCondition() {
    return Random.choice(CONDITIONS)
}
