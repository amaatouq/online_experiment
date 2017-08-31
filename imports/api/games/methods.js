import { Meteor } from 'meteor/meteor';
import { Games} from "./games";
import {getNeighbors, insertUserRound, Rounds } from './rounds'
import { Random } from 'meteor/random'

Meteor.methods({
    'games.createGame'(lobby){
        //create the game
        const condition = lobby.condition;
        const players = lobby.players;
        const icons = _.shuffle(AVATARS);
        const maxInDegree = (condition+'.N_CONNECTIONS').split('.').reduce((o, i) => o[i],CONDITIONS_SETTINGS);
        const totalRounds = (condition+'.N_ROUNDS').split('.').reduce((o, i) => o[i],CONDITIONS_SETTINGS);

        Games.insert({
            _id: lobby._id,
            condition: condition,
            createTime: new Date(),
            groupSize: lobby.groupSize,
            maxInDegree: maxInDegree,
            players: players,
            stage: 'initial',
            currentRound: 1,
            totalRounds: totalRounds
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

            //get random neighbors but excluding the current player
            //This can be changed into a function that returns a specific network
            const neighbors = getNeighbors(player,players,maxInDegree);
            //add the round data
            insertUserRound(lobby._id,player,1,neighbors)

        })
    },

    //General purpose document modification function for the round data
    'games.updateRoundInfo'(data,operation) {
        console.log('I will update ',this.userId, ' with ',data);
        const game = Games.findOne({players:this.userId});
        if (operation === 'set') {
            Rounds.update({userId : this.userId, round:game.currentRound}, {$set: data});
        } else if (operation === 'inc') {
            Rounds.update({userId : this.userId,round:game.currentRound}, {$inc: data});
        } else if (operation === 'dec') {
            Rounds.update({userId : this.userId,round:game.currentRound}, {$dec: data});
        }
    }

});





