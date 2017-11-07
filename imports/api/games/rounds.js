import {Games} from './games.js'
export const Rounds = new Mongo.Collection('rounds');


//we will probably not need this
//export const Networks = new Mongo.Collection('networks');

//the stages we have in the game
const stages = ['initial','interactive','roundOutcome'];

Rounds.after.update((userId, round, fieldNames, modifier, options)=>{
    console.log('after update round:',round);
    console.log('fieldNames',fieldNames,'modf ',modifier,' options ',options);
    const currentStage = fieldNames[0];

    //update the user score if they updated their answer
    // and they are ready (whether initial or interactive stages)

    //check whether the user is ready
    const userIsReady = accessNestedObject(currentStage+'.ready',round);
    if (userIsReady){
        //compute user score
        computeScores(currentStage,round,fieldNames);
        //check if we can progress the game to the next stage or next round
        gameProgress(round, fieldNames,currentStage);
    }

    //if we are in the roundoutcome update user information with the new scores for easy display
    if (currentStage === 'roundOutcome'){
        Meteor.users.update({_id:round.userId},
            {
                $inc:
                    {
                        cumulativeScore:round.cumulativeScore,
                        bonus: round.cumulativeScore*BONUS_CONVERSION
                    },
                $set: {incrementScore:round.incrementScore},
            })
    }




});


//This function returns a network of users
// this function can be changed to anything
export function getNeighbors(player,players,maxInDegree) {
    const neighbors = new Set(_.sample(removeElement(players,player),maxInDegree));
    return Array.from(neighbors);
}

//inserting a new round
export function insertUserRound(gameId,player,currentRound,neighbors,task) {
    Meteor.users.update({_id:player},{$set:{currentRound:currentRound}});
    Rounds.insert({
        gameId: gameId,
        userId: player,
        round: currentRound,
        stage:'initial',
        initial: {ready:false,isCurrentStage:true,startTime:null},
        interactive:{ready:false,isCurrentStage:false, startTime:null},
        roundOutcome:{ready:false,isCurrentStage:false, startTime:null},
        cumulativeScore: Meteor.users.findOne({_id:player}).cumulativeScore,
        incrementScore: 0,
        neighbors:neighbors,
        initialAnswer: null,
        interactiveAnswer:null,
        ready:false,
        createTime: new Date(),
        task: task,
        avatar: Meteor.users.findOne({_id:player}).avatar
        //add the difficulty, task path this will be queried from the Tasks collection
    });

}



//progress the game if everyone is ready
//options are:
// 1) there are people who are not ready => do nothing
// 2) everyone is ready:
//  a) if NOT round outcome then advance a stage and set them up to ready=false for this new stage
//  b) if round outcome then:
//      i) if this is the last round => end the game
//      ii) if this is NOT the last round => advance 1 round
function gameProgress(round, fieldNames,currentStage){
    //make sure we modified the stage ready and submitted an answer for that stage or it is roundoutcome
    if ((stages.includes(currentStage) && currentStage+'Answer' === fieldNames[1])
        || fieldNames[0] === 'roundOutcome') {
        const nextStage = nextStageName(currentStage);
        const game = Games.findOne({_id:round.gameId});
        //find people in the same game at the same round and they are ready
        let selector = {gameId:game._id,round:game.currentRound};
        selector[currentStage+'.ready'] = true;
        const nReadyPlayers = Rounds.find(selector).count();
        //if everyone is ready
        if (nReadyPlayers === game.groupSize) {
            //advance a stage unless we are in the round outcome, then advance round
            if (currentStage !== 'roundOutcome'){
                console.log('everyone is ready in stage ', currentStage, ' will move to ', nextStage);
                //update the game stage
                Games.update({_id:game._id},{$set:{stage:nextStage}});
                //update the round data to move to the next stage
                let roundNewValues = {};
                roundNewValues[nextStage+'.startTime'] = new Date();
                roundNewValues['stage'] = nextStage;
                Rounds.update({gameId:game._id,round:game.currentRound}, {$set: roundNewValues},{multi:true});
            } else {
                //move to the next round and update the stage creation time
                //update the networks for the players for the next round?? (we will see about this)
                if (game.currentRound === game.totalRounds){
                    console.log('end the game');
                    Games.update({_id:game._id},{$set:{status:'finished'}})
                } else {
                    console.log('everyone is ready in stage ', currentStage, ' will move to round ', game.currentRound+1);
                    Games.update({_id:game._id},{$set:{currentRound:game.currentRound+1,stage:'initial'}});
                    Rounds.update({gameId:game._id,round:game.currentRound+1},
                        {$set: {'initial.startTime':new Date()}},
                        {multi:true});
                }

            }
        }
    }
}


//getting the name of the next stage (helper for moving forward in stages)
function nextStageName (currentStage) {
    if (currentStage==='initial'){
        return 'interactive'
    } else if (currentStage==='interactive'){
        return 'roundOutcome'
    }
}

function computeScores(currentStage,round,fieldNames){
    //see if the last thing they did is to select an answer for their stage
    if (currentStage+'Answer' === fieldNames[1]) {
        let userAnswer = null;
        const correctAnswer = accessNestedObject('task.correct_answer',round);
        if (currentStage === 'initial'){
            userAnswer = round.initialAnswer;
        } else {
            userAnswer = round.interactiveAnswer;
            //if they do not have an answer in the interactive stage, use their initial answer
            //to compute the score
            if (!userAnswer){
                userAnswer = round.initialAnswer;
            }
        }

        //compute score function
        const score =scoreFunction(userAnswer,correctAnswer);
        console.log(round.userId,' score is ',score);

        //add the score for the round and the cumulative score as well
        Rounds.update({gameId:round.gameId,round:round.round,userId:round.userId},
            {
                $set: {incrementScore:score},
                $inc: {cumulativeScore:score}
            });
    }
}

//score function can be anything given a true answer and the user answer
function scoreFunction(userAnswer,correctAnswer) {
    const score = (1 - Math.abs(parseFloat(correctAnswer-userAnswer))).toFixed(2);
    if (score){
        return parseFloat(score);
    } else {
        return 0
    }
}
