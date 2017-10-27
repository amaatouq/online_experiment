import { Random } from 'meteor/random'
import { Lobbies } from "../lobbies/lobbies.js";
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
    user.incrementScore= 0;
    user.cumulativeScore= 0;
    user.bonus= 0;
    user.lobbyTimeout= LOBBY_TIMEOUT;
    user.lobbyId= null;
    user.gameId=null;
    user.currentRound=null;
    user.condInfo = {name: cond,
        groupSize: (cond+'.GROUPS_SIZE').split('.').reduce((o, i) => o[i], CONDITIONS_SETTINGS),
        bonusConversion: (cond+'.BONUS_CONVERSION').split('.').reduce((o, i) => o[i], CONDITIONS_SETTINGS),
        N_ROUNDS: (cond+'.N_ROUNDS').split('.').reduce((o, i) => o[i], CONDITIONS_SETTINGS),
        N_CONNECTIONS: (cond+'.N_CONNECTIONS').split('.').reduce((o, i) => o[i], CONDITIONS_SETTINGS),
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
        //if the user went offline while in the lobby, remove that user from the lobby
        const activeLobby = Lobbies.findOne({_id:user.lobbyId,
            players:user._id,
            lobbyStatus:'waiting'});
        if (user.page==='lobby' || activeLobby){
            console.log('will remove from the lobby');
            Lobbies.update({_id:user.lobbyId},{$pull: {players:user._id}});
        }
        else if (user.page==='game'){
            console.log('user left the game')
            //todo what happens to users when they leave the game
        }
    }
});
