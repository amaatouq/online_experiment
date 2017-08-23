//import the relevant page
import './instructions_page.html';

//import the components
import'../../components/instructions/progress.js' //progress bar
import'../../components/instructions/accept.js'
import'../../components/instructions/overview.js'
import'../../components/instructions/rounds.js'
import'../../components/instructions/example.js'
import'../../components/instructions/quiz.js'


import { Template } from 'meteor/templating';
import { Session } from 'meteor/session'
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.instructions_page.onCreated(function () {
    //now in the user database, ensure to set the current page to instructions
    Meteor.call('users.updateUserInfo',{page:'instructions'},'set');

    //set the page to be at the instructions for routing purposes
    Session.setPersistent('page','instructions');
    //set the instructionStage to be at the first page if they just arrived
    const instructionStage =  Session.get('instructionStage');
    if (!instructionStage) {
        Session.setPersistent('instructionStage','accept')
    }


});

Template.instructions_page.helpers({
    //for the next/previous routing procedure and the progress bar
    acceptStage() {
        return Session.get('instructionStage') === 'accept';
    },
    overviewStage() {
        return Session.get('instructionStage') === 'overview';
    },
    roundsStage() {
        return Session.get('instructionStage') === 'rounds';
    },
    exampleStage() {
        return Session.get('instructionStage') === 'example';
    },
    quizStage() {
        return Session.get('instructionStage') === 'quiz';
    },
    userCondition (){
        return Meteor.user().condition;
    },
    groupSize (){
        return Meteor.user().condInfo.groupSize;
    },
    nRounds(){
        return Meteor.user().condInfo.nRounds;
    },

    nStages() {
        //return 2 if it is in control condition or 3 if in other conditions
        return Meteor.user().condition === 'control'? 2 : 3;
    },
    //animation of the sliding templates using /#transition but it is still NOT working
});
