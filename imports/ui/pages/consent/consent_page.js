import './consent_page.html';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Random } from 'meteor/random'

import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor'

Template.consent_page.events({
    //if the users submits the consent form, we create a user for them
    'submit .consent-form'(event) {
        event.preventDefault();
        const random_username = Random.id();
        const random_password = Random.id();
        //create a user in the user database to be tracked, then login, then redirect to instructions
        Meteor.call('users.createUser',random_username,random_password,()=>{
            Meteor.loginWithPassword(random_username,random_password, ()=>{
                FlowRouter.go('/instructions');
            });
        });
    }
});


