import './game_timer.html'
import {Meteor} from 'meteor/meteor'
import {Session} from 'meteor/session'
import {Games} from '../../../api/games/games'

let countdown = null;

Template.game_timer.onCreated(function() {

    //setting up the round timer
    if (Session.get('timeRemained')) {
        //on refresh give them the same time
        countdown = new ReactiveCountdown(Session.get('timeRemained') - 1);
    } else {
        //if the first time it is run, then give the full time
        countdown =new ReactiveCountdown(ROUND_TIMEOUT);
    }
    //start the timer count down
    countdown.start(function () {
        //what to do when the timeout finishes
        stageTimedOut()
    });

});

Template.game_timer.helpers({
    countDown() {
        const timeRemained = countdown.get();
        Session.setPersistent('timeRemained',timeRemained);
        return timeRemained

    },
});




//This is the stage timeout function
function stageTimedOut () {
    // do something when it
    const currentRoundId = (Games.findOne({players: Meteor.userId()}).currentRound);
    Meteor.call('games.updateRoundInfo',currentRoundId,{ready:true},'set',()=>{
        console.log('now I should turn rerun to True');
        Session.setPersistent('timeRemained',null);
    });
}
