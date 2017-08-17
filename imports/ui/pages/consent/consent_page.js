import './consent_page.html';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Random } from 'meteor/random'


import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor'

Template.consent_page.events({
    'submit .consent-form'(event) {
        event.preventDefault();
        const random_username = Random.id();
        const random_password = Random.id();
        //create a user in the user database to be tracked
        Meteor.call('players.createUser',random_username,random_password);
        //force login the user so we get this.userId
        Meteor.loginWithPassword(random_username,random_password);
        //add that user to the Players collection
        Meteor.call('players.addPlayer');
        //take the user to the instructions page

        FlowRouter.go('/instructions')
    }
});