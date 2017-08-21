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

        //try to login first, then send a callback on success to add the player to the collection
        //then on that callback send the player to the instructions
        Meteor.loginWithPassword(random_username,random_password, (err,res)=>{
            if (err){
                console.log(err+' at login')
            } else {
            Meteor.call('players.addPlayer', (err, res) => {
                if(err) {
                    console.log(err+' at players.addPlayer');
                } else {
                    //take the users to the instructions page
                    FlowRouter.go('/instructions');
                }
            });
            }

        });


        //force login the user so we get this.userId

        //add that user to the Players collection with call back so the redirection doesn't happen
        //until the user is created

    }
});


