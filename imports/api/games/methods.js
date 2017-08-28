import { Meteor } from 'meteor/meteor';
import { Games, Networks, Rounds } from "./games";
import { Random } from 'meteor/random'

Meteor.methods({
    'games.createGame'(lobby){
        //create the game
        const condition = lobby.condition;
        const players = lobby.players;
        const icons = _.shuffle(AVATARS);
        const maxInDegree = (condition+'.N_CONNECTIONS').split('.').reduce((o, i) => o[i],CONDITIONS_SETTINGS);

        Games.insert({
            _id: lobby._id,
            condition: condition,
            createTime: new Date(),
            groupSize: lobby.groupSize,
            maxInDegree: maxInDegree,
            players: players,
            stage: 'initial',
            currentRound: 1,
        });

        //batch update will be a more efficient way of doing this
        players.forEach(function (player,i) {
            //update player information to be:
            // 1) assigned a random avatar; 2) to this gameId; 3) and the page to be 'game'
            Meteor.users.update({_id:player},{$set:{gameId:lobby._id, page:'game', avatar:icons[i]}});

            //get random neighbors but excluding the current player
            //This can be changed into a function that returns a specific network
            const neighbors = getNeighbors(player,players);
            //add the round data
            Rounds.insert({
                gameId: lobby._id,
                userId: player,
                round: 1,
                cumulativeScore: 0,
                incrementScore: 0,
                neighbors:neighbors,
                initialAnswer: null,
                updatedAnswer:null,
            });

        })
    },

});

//this function can be changed to anything
function getNeighbors(player,players) {
    let neighbors = new Set([]);
    for (let j = 0; j===neighbors.size; j++){
        neighbors.add(Random.choice(removeElement(players,player)));
    }
    return Array.from(neighbors);
}


