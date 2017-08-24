import { Random } from 'meteor/random'
import { Games } from "../games/games";
import '../../../lib/globals';
// Generate user with our fields
Accounts.onCreateUser((options, user) => {
    const cond = assignUserCondition();
    user.enterTime= new Date();
    user.page = null;
    user.passedQuiz= false;
    user.exitStatus=null;
    user.quizAttempts= 0;
    user.condition= cond;
    user.avatar= null;
    user.score= 0;
    user.bonus= 0;
    user.lobbyTimeout= LOBBY_TIMEOUT;
    user.gameId= null;
    user.condInfo = {name: cond,
        groupSize: (cond+'.GROUPS_SIZE').split('.').reduce((o, i) => o[i], CONDITIONS_SETTINGS),
        bonusConversion: (cond+'.BONUS_CONVERSION').split('.').reduce((o, i) => o[i], CONDITIONS_SETTINGS),
        N_ROUNDS: (cond+'.N_ROUNDS').split('.').reduce((o, i) => o[i], CONDITIONS_SETTINGS),
    };
    return user;
});

//todo will become more complex assignment than random?
function assignUserCondition() {
    return Random.choice(CONDITIONS)
}

//what happens to user when they disconnect or connect
Meteor.users.find({ "status.online": true }).observe({
    added: function(user) {
        // user just came online
    },
    removed: function(user) {
        //if the user went offline while in game, remove that user from the game
        console.log('user went offline');
        if (user.gameId){
            Games.update({_id:user.gameId},{$pull: {players:user._id}});
        }
    }
});
