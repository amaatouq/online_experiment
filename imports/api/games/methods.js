import { Meteor } from 'meteor/meteor';
import { Games} from "./games";
import {getNeighbors, insertUserRound, Rounds } from './rounds'
import { Random } from 'meteor/random'
import {Tasks} from "./tasks";

Meteor.methods({
    'games.createGame'(lobby){
        //create the game
        const condition = lobby.condition;
        const players = lobby.players;
        const icons = _.shuffle(AVATARS);
        const maxInDegree = (condition+'.N_CONNECTIONS').split('.').reduce((o, i) => o[i],CONDITIONS_SETTINGS);
        const totalRounds = (condition+'.N_ROUNDS').split('.').reduce((o, i) => o[i],CONDITIONS_SETTINGS);

        //The Task that will be loaded from the database:
        //the number tasks will be the same as the number of rounds and should be randomized at the game level
        const tasks = _.shuffle(Tasks.find({}, {limit: N_ROUNDS+1}).fetch());

        Games.insert({
            _id: lobby._id,
            condition: condition,
            createTime: new Date(),
            groupSize: lobby.groupSize,
            maxInDegree: maxInDegree,
            players: players,
            stage: 'initial',
            currentRound: 1,
            totalRounds: totalRounds,
            status: 'onGoing'
        });

        //batch update will be a more efficient way of doing this
        players.forEach(function (player,i) {
            //update player information to be:
            // 1) assigned a random avatar; 2) to this gameId; 3) and the page to be 'game'
            Meteor.users.update({_id:player},{$set:
                {
                    gameId:lobby._id, page:'game', avatar:icons[i],
                }
            });

            //we will add all the rounds for this game at the beginning. This will help to randomize
            //the stimuli using ._shuffle the sequence for each game
            console.log('will add the rounds information');
            for (let roundId = 1; roundId <= totalRounds; roundId++){
                //get random neighbors but excluding the current player
                //This can be changed into a function that returns a specific network
                //only do this for the first initial network, rest will be dynamic (will change every round)
                let neighbors = null;
                if (roundId===1){
                    neighbors = getNeighbors(player,players,maxInDegree);
                } else {
                    //this should be fixed for the dynamics case
                    //neighbors = [];

                    //this is for random neighbors everytime
                    neighbors = getNeighbors(player,players,maxInDegree);
                }
                //add round data
                insertUserRound(lobby._id,player,roundId,neighbors,tasks[roundId])
            }


        });
        //let everyone have the same startTime
        Rounds.update({gameId:lobby._id,round:1},
            {$set: {'initial.startTime':new Date()}},
            {multi:true});
    },

    //General purpose document modification function for the round data
    'games.updateRoundInfo'(data,operation) {
        const game = Games.findOne({players:this.userId});
        if (operation === 'set') {
            console.log('I will update ',this.userId, 'and round ',game.currentRound, ' with ',data);
            Rounds.update({userId : this.userId, round:game.currentRound}, {$set: data});
        } else if (operation === 'inc') {
            Rounds.update({userId : this.userId,round:game.currentRound}, {$inc: data});
        } else if (operation === 'dec') {
            Rounds.update({userId : this.userId,round:game.currentRound}, {$dec: data});
        }
    },


});





