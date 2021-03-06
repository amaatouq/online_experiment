import './game_timer.html'
import {Meteor} from 'meteor/meteor'
import {Session} from 'meteor/session'
import {Rounds} from '../../../api/games/rounds';
import {Games} from "../../../api/games/games";
import {ReactiveVar} from 'meteor/reactive-var'



Template.game_timer.onCreated(function() {
    let game = Games.findOne({players:Meteor.userId()});
    let userRound = Rounds.findOne({ userId: Meteor.userId(), round:game.currentRound});
    this.autorun(()=>{
        console.log('reran the clock');
        if (game){
            if (userRound){
                const startedTime = accessNestedObject(game.stage + '.startTime',userRound);
                Session.setPersistent('RoundTimer', startedTime);
            }
        }
    });



});

Template.game_timer.helpers({
    countDown(){
        if (Session.get('RoundTimer')){
            const sTime = Session.get('RoundTimer');
            const elapsed = (TimeSync.serverTime()-sTime)/1000;
            let s = Math.floor(elapsed % 60);
            s = s < 10 ? "0" + s: s;
            Session.setPersistent('sec',Number(s));
            return ROUND_TIMEOUT - s;
        }
    },

});




