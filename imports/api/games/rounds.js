import {Games} from './games.js'
export const Rounds = new Mongo.Collection('rounds');


//we will probably not need this
//export const Networks = new Mongo.Collection('networks');


//progress the game if everyone is ready
//options are:
// 1) there are people who are not ready => do nothing
// 2) everyone is ready:
//  a) if NOT round outcome then advance a stage and set them up to ready=false for this new stage
//  b) if round outcome then:
//      i) if this is the last round => end the game
//      ii) if this is NOT the last round => advance 1 round
Rounds.after.update((userId, round, fieldNames, modifier, options)=>{
    console.log('fieldNames',fieldNames,'modf ',modifier,' options ',options);
    const stages = ['initial','interactive','roundOutcome'];
    //make sure we modified the stage ready
    if (stages.includes(fieldNames[0]) && fieldNames.length === 1){
        const currentStage = fieldNames[0];
        const nextStage = nextStageName(currentStage);
        const game = Games.findOne({_id:round.gameId});
        //find people in the same game at the same round and they are ready
        let selector = {gameId:game._id,round:game.currentRound};
        selector[currentStage+'.ready'] = true;
        const nReadyPlayers = Rounds.find(selector).count();
        //if everyone is ready
        if (nReadyPlayers === game.groupSize) {
            if (currentStage !== 'roundOutcome'){
                //advance a stage
                console.log('everyone is ready in stage ', currentStage, ' will move to ', nextStage);
                //update the game stage
                Games.update({_id:game._id},{$set:{stage:nextStage}});
                //update the round data to move to the next stage
                let roundNewValues = {};
                roundNewValues[nextStage+'.startTime'] = new Date();
                roundNewValues['stage'] = nextStage;
                Rounds.update({gameId:game._id,round:game.currentRound}, {$set: roundNewValues})
            } else {
                //add a new rounds
            }
        }
    }
});



//this function can be changed to anything
export function getNeighbors(player,players,maxInDegree) {
    const neighbors = new Set(_.sample(removeElement(players,player),maxInDegree));
    return Array.from(neighbors);
}

export function insertUserRound(gameId,player,currentRound,neighbors) {
    Meteor.users.update({_id:this.userId},{$set:{currentRound:currentRound}});
    Rounds.insert({
        gameId: gameId,
        userId: player,
        round: currentRound,
        stage:'initial',
        initial: {ready:false,isCurrentStage:true,startTime:new Date()},
        interactive:{ready:false,isCurrentStage:false, startTime:null},
        roundOutcome:{ready:false,isCurrentStage:false, startTime:null},
        cumulativeScore: 0,
        incrementScore: 0,
        neighbors:neighbors,
        initialAnswer: null,
        updatedAnswer:null,
        ready:false,
        createTime: new Date()
    });

}

function nextStageName (currentStage) {
    if (currentStage==='initial'){
        return 'interactive'
    } else if (currentStage==='interactive'){
        return 'roundOutcome'
    }

}