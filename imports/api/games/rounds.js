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
    const currentGameId = round.gameId;
    if (fieldNames[0] ==='ready'){
        //find the current game
        const game = Games.findOne({_id:currentGameId});
        const currentRound = game.currentRound;
        //see how many people are ready
        const n_ready = Rounds.find({gameId: currentGameId, round:currentRound,ready:true}).count();
        //if everyone is ready, then advance the stage (or the round)
        if (n_ready === game.groupSize){
            console.log('everyone is ready');
            if (game.stage === 'initial'){
                console.log('Game at initial and will be moved to interactive');
                Games.update({_id:currentGameId},{$set:{stage:'interactive'}},()=>{
                    //update all players to not ready in this new stage
                    console.log('now set player to NOT ready');
                    Rounds.update({gameId:currentGameId,round:currentRound},
                        {$set: {ready:false}},
                        {multi:true})
                });

            } else if (game.stage === 'interactive') {
                console.log('Game at interactive and will be moved to roundOutcome');
                Games.update({_id:currentGameId},{$set:{stage:'roundOutcome'}},()=>{
                    //update all players to not ready in this new stage
                    console.log('now set player to NOT ready');
                    Rounds.update({gameId:currentGameId,round:currentRound},
                        {$set: {ready:false}},
                        {multi:true})
                });
            } else {
                //if it is already round outcome, either end the game or advance the round
                if (game.currentRound === game.totalRounds){
                    console.log('the game ended; go to the exit survey and get paid')
                } else {
                    console.log('the round has ended, move to the next round');
                    Games.update({_id:currentGameId},
                        {$set: {stage:'initial', currentRound:game.currentRound+1}}, ()=>{
                            //after you updated the game data, insert a new round data
                            console.log('now enter the new rounds for the players');
                            addRound(game,game.currentRound+1,game.players)
                        })
                }

            }
        }
    }

});

export function addRound(game,newRoundNumber,players) {
    players.forEach(function (player,i) {
        //get random neighbors but excluding the current player
        //This can be changed into a function that returns a specific network
        const neighbors = getNeighbors(player,players,game.maxInDegree);
        //add the round data
        Rounds.insert({
            gameId: game._id,
            userId: player,
            round: newRoundNumber,
            cumulativeScore: 0,
            incrementScore: 0,
            neighbors:neighbors,
            initialAnswer: null,
            updatedAnswer:null,
            ready:false,
        });

    })
}


//this function can be changed to anything
export function getNeighbors(player,players,maxInDegree) {
    const neighbors = new Set(_.sample(removeElement(players,player),maxInDegree));
    return Array.from(neighbors);
}
