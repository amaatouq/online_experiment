import './accept.html'

import { Session } from 'meteor/session'
import { Template } from 'meteor/templating'

Template.accept.onCreated(()=>{
//    Session.setPersistent('instructionTransition',null);

});

Template.accept.events({
    'submit .nextInstruction'(event){
        event.preventDefault();
        Session.setPersistent('instructionTransition','next');
        Session.setPersistent('instructionStage','overview');
    }

});