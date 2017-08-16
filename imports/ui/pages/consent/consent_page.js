import './consent_page.html';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor'
import '../../../api/players/methods.js'


Template.consent_page.events({
    'submit .consent-form'(event) {
        event.preventDefault();
        Meteor.call('players.addPlayer');
        FlowRouter.go('/instructions')
    }
});