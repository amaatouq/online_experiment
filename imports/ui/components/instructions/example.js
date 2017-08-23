import './example.html'

import { Session } from 'meteor/session'
import { Template } from 'meteor/templating'

Template.example.onCreated(()=>{
    //Session.setPersistent('instructionTransition',null);

});

Template.example.events({
    'submit .nextInstruction'(event){
        event.preventDefault();
        Session.setPersistent('instructionStage','quiz')
    },
    'submit .previousInstruction'(event) {
        event.preventDefault();
        Session.setPersistent('instructionStage', 'rounds')
    }
});

