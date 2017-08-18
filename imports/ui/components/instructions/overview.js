import './overview.html'


import { Session } from 'meteor/session'
import { Template } from 'meteor/templating'

Template.overview.onCreated(function () {
    Session.setPersistent('instructionStage','overview');
});

Template.overview.helpers({
    gameSize(){
        return 12;
    }
});


Template.overview.events({
    'submit .nextInstruction'(event){
        event.preventDefault();
        Session.setPersistent('instructionStage','rounds')
    },
    'submit .previousInstruction'(event){
        event.preventDefault();
        Session.setPersistent('instructionStage','accept')
    }

});