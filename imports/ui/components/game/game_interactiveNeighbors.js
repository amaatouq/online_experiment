import './game_interactiveNeighbors.html'
import {Template} from 'meteor/templating'
import {Meteor} from 'meteor/meteor'
import {Games} from "../../../api/games/games";
import {Rounds} from "../../../api/games/rounds";


Template.game_interactiveNeighbors.helpers({

    //return the initial answer at the start and then the interactiveAnswer
    neighborAnswer(neighbor){
        if (neighbor){
            if (neighbor.interactiveAnswer === null){
                if (neighbor.initialAnswer !==null){
                    return neighbor.initialAnswer
                } else {
                    return 'N/A'
                }

            } else{
                return neighbor.interactiveAnswer
            }
        }
    }

});




Template.game_interactiveNeighbors.onRendered(()=> {

    /////// neighbors the slider stuff //////
    const game = Games.findOne({players:Meteor.userId()});
    const userRounds = Rounds.findOne( { userId: Meteor.userId(), round:game.currentRound});
    Meteor.autorun(()=>{
        const neighborsData = Rounds.find({round:userRounds.round, userId: {$in : userRounds.neighbors}}).fetch();
        if (neighborsData){
            neighborsData.forEach(function (neighbor,i) {
                const answer = neighbor.interactiveAnswer? neighbor.interactiveAnswer: neighbor.initialAnswer
                this.$("td#"+neighbor._id+"> .followingSlider").slider({
                    min: 0,
                    max: 1,
                    step: 0.01,
                    disabled: true,
                    value: answer,
                    create: (event,ui)=>{
                        //hide the default value if there is no answer yet
                        if (answer === null || answer === undefined){
                            $("td#"+neighbor._id+" > .followingSlider .ui-slider-handle").hide();
                        }
                    },
                    slide: (event, ui)  => {
                        $("td#"+neighbor._id+" > .followingSlider .ui-slider-handle").show();
                    },
                });
            });

        }

    })


});
