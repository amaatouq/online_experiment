import './header_layout.html'
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor'

//subscribe the user (even if he is not created yet) as we will need user data all the time
Template.header_layout.onCreated(function () {
    this.autorun(() => {
        Meteor.subscribe('players.playerData');
    });
});

//Add the logout button and clear the session
Template.header_layout.events({
    'submit .logout'(event) {
        event.preventDefault();
        Meteor.logout();
        Session.clear();
        //TODO this should be changed to /exitSurvey once it is developed
        FlowRouter.go('/consent')
    }
});