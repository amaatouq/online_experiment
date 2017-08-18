import './instructions_page.html';

//import the components
import'../../components/instructions/accept.js'
import'../../components/instructions/overview.js'


import { Template } from 'meteor/templating';
import { Session } from 'meteor/session'
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


    userData(){
        return Players.findOne();
    }

});