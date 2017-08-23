import { Random } from 'meteor/random'
// Generate user with our fields
Accounts.onCreateUser((options, user) => {
    user.enterTime= new Date();
    user.page = null;
    user.passedQuiz= false;
    user.exitStatus=null;
    user.quizAttempts= 0;
    user.condition= assignUserCondition();
    user.avatar= null;
    user.score= 0;
    user.bonus= 0;
    user.lobbyTimeout= LOBBY_TIMEOUT;
    user.gameId= null;
    return user;
});

//todo will become more complex assignment than random?
function assignUserCondition() {
    return Random.choice(CONDITIONS)
}