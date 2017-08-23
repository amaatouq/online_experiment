import './header_layout.html'
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor'

//subscribe the user (even if he is not created yet) as we will need user data all the time
Template.header_layout.onCreated(function () {
    //this now moved to startup code
    // this.autorun(() => {
    //     Meteor.subscribe('players.playerData');
    // });
});

//Add the logout button and clear the session
Template.header_layout.events({
    'submit .logout'(event) {
        event.preventDefault();
        Meteor.call('users.updateUserInfo',Meteor.userId(),{page:'exit'},'set');
        Meteor.call('users.updateUserInfo',Meteor.userId(),{exitStatus:'leftGame'},'set');
        Meteor.logout();
        Session.clear();
        FlowRouter.go('/exit')
    }
});