import './accept.html'

import { Session } from 'meteor/session'
import { Template } from 'meteor/templating'

Template.accept.onCreated(function () {
    Session.setPersistent('instructionStage','accept');
});

Template.accept.events({
    'submit .nextInstruction'(event){
        event.preventDefault();
        Session.setPersistent('instructionStage','overview')
    }

});