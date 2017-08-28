import '../loader/loader';
import './game_page.html'
import { Rounds, Games } from '../../../api/games/games';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.game_page.onCreated(function() {
    Session.setPersistent('page','game');
    this.subscribe('games.userGame',(err,res)=>{
        if (err){
            console.log('error while trying to subscribe to the game')
        } else{
            this.subscribe('games.userRound',Games.findOne({players: Meteor.userId()}).currentRound);
        }
    });
});


Template.game_page.helpers({
    game() {
        return Games.findOne({players: Meteor.userId()});
    },
    currentNeighbors(){
        const currentRound = Games.findOne({players: Meteor.userId()}).currentRound;
        console.log(Rounds.findOne({ userId: Meteor.userId(), round:currentRound}));
        return  Rounds.findOne({ userId: Meteor.userId(), round:currentRound}).neighbors;
    },
    avatar() {
        return Meteor.user().avatar;
    }

});

