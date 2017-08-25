import './header_layout.html'
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor'
import { Session } from 'meteor/session'

//subscribe the user (even if he is not created yet) as we will need user data all the time
Template.header_layout.onCreated(function () {

});



//Add the logout button and clear the session
Template.header_layout.events({
    'submit .logout'(event) {
        event.preventDefault();
        Meteor.call('users.updateUserInfo',{page:'exit'},'set');
        Meteor.call('users.updateUserInfo',{exitStatus:'leftGame'},'set');
        Session.setPersistent('exitStatus','leftGame');
        Session.setPersistent('page','exit');
        FlowRouter.go('/exit')
    }
});