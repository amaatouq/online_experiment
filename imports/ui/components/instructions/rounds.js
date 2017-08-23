import './rounds.html'

import { Session } from 'meteor/session'
import { Template } from 'meteor/templating'

Template.rounds.onCreated(()=>{
    //Session.setPersistent('instructionTransition',null);

});

Template.rounds.events({
    'submit .nextInstruction'(event){
        event.preventDefault();
        Session.setPersistent('instructionStage','example')
    },
    'submit .previousInstruction'(event) {
        event.preventDefault();
        Session.setPersistent('instructionStage', 'overview')
    }
});

