import './header_layout.html'
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor'


Template.header_layout.events({
    'submit .logout'(event) {
        event.preventDefault();
        Meteor.logout();
        FlowRouter.go('/consent')
    }
});