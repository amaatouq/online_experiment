import '../../../../lib/globals.js'

//import the relevant page
import './instructions_page.html';

//import the components
import'../../components/instructions/accept.js'
import'../../components/instructions/overview.js'
import'../../components/instructions/rounds.js'



import { Template } from 'meteor/templating';
import { Session } from 'meteor/session'
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Players } from '../../../api/players/players.js';

Template.instructions_page.onCreated(function () {
    //set the userStatus to be at the instructions for routing purposes
    Session.setPersistent('userStatus','instructions');

    //set the instructionStage to be at the first page if they just arrived
    const instructionStage =  Session.get('instructionStage');
    if (!instructionStage) {
        Session.setPersistent('instructionStage','accept')
    }

});

Template.instructions_page.helpers({
    //for the next/previous routing procedure
    acceptStage() {
        return Session.get('instructionStage') === 'accept';
    },
    overviewStage() {
        return Session.get('instructionStage') === 'overview';
    },
    roundsStage() {
        return Session.get('instructionStage') === 'rounds';
    },
    notControl(){
        return userData().condition !== 'control';
    },
    isT1(){
        return userData().condition === 'T1';
    },
    isT2(){
        return userData().condition === 'T2';
    },
    isControl(){
        return userData().condition === 'control';
    },
    nStages() {
        //return 2 if it is in control condition or 3 if in other conditions
        return userData().condition === 'control'? 2 : 3;
    },
    conditionData(){
        const playerData = userData();
        const GROUPS_SIZE = playerData.condition+'.GROUPS_SIZE';
        const N_ROUNDS = playerData.condition+'.N_ROUNDS';
        const LOBBY_TIMEOUT = playerData.condition+'.LOBBY_TIMEOUT';
        const BONUS_CONVERSION = playerData.condition+'.BONUS_CONVERSION';
        console.log({
            GROUPS_SIZE: GROUPS_SIZE.split('.').reduce((o, i) => o[i], CONDITIONS_SETTINGS),
            N_ROUNDS: N_ROUNDS.split('.').reduce((o, i) => o[i], CONDITIONS_SETTINGS),
            LOBBY_TIMEOUT: LOBBY_TIMEOUT.split('.').reduce((o, i) => o[i], CONDITIONS_SETTINGS),
            BONUS_CONVERSION: BONUS_CONVERSION.split('.').reduce((o, i) => o[i], CONDITIONS_SETTINGS),
        });
        return {
            GROUPS_SIZE: GROUPS_SIZE.split('.').reduce((o, i) => o[i], CONDITIONS_SETTINGS),
            N_ROUNDS: N_ROUNDS.split('.').reduce((o, i) => o[i], CONDITIONS_SETTINGS),
            LOBBY_TIMEOUT: LOBBY_TIMEOUT.split('.').reduce((o, i) => o[i], CONDITIONS_SETTINGS),
            BONUS_CONVERSION: BONUS_CONVERSION.split('.').reduce((o, i) => o[i], CONDITIONS_SETTINGS),
        }
    }
});

function userData(){
    return Players.findOne(Meteor.userId());
}

