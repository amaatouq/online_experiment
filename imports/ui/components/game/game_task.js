import './game_task.html'

import {Template} from 'meteor/templating'
import {Games} from "../../../api/games/games";
import {Rounds} from "../../../api/games/rounds";
import {Meteor} from 'meteor/meteor'

Template.game_task.onRendered(()=>{

    const game = Games.findOne({ players: Meteor.userId()});
    console.log('game ',game);
    Meteor.autorun(()=>{
        const userRound = Rounds.findOne({userId: Meteor.userId(), round:game.currentRound});
        console.log('userRound ',userRound);
        if (game && userRound) {
            const isReady = (game.stage + '.ready').split('.').reduce((o, i) => o[i], userRound);
            console.log(isReady);
            if (isReady) {
                $('#contributionSubmit').text("Waiting for other players... ").removeClass('btn-primary').addClass('btn-warning').prop('disabled', true);
            }
        }
    })

});


Template.game_task.events({
    'click button' (event){
        event.preventDefault();
        $('#contributionSubmit').text("Waiting for other players... ").removeClass('btn-primary').addClass('btn-warning').prop('disabled',true);
        const game = Games.findOne( { players: Meteor.userId() });
        const currentStageReady = game.stage+'.ready';

        let data = {};
        data[currentStageReady]=true;

        Meteor.call('games.updateRoundInfo',data,'set');
    }
});