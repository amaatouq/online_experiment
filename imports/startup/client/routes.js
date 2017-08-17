import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { Meteor } from 'meteor/meteor'

// Import layout .. probably the experiment has 1 layout
import '../../ui/layouts/experimentLayout.js'
//import layout components
import '../../ui/components/layout/header_layout.js'
import '../../ui/components/layout/footer_layout.js'
//import pages
import '../../ui/pages/consent/consent_page.js'


// Set up all routes in the app

//here I should check the status of the user to decide where to route them
FlowRouter.route('/', {
  name: 'landing',
  action() {
      //if the user didn't consent or doesn't exit or new connections (check Players collection)
      console.log(this.userId)
      if (!this.userId) {
          FlowRouter.go('/consent')
      }
    //
      //FlowRouter.go('./instructions') //if the user didn't go through the instructions
      //FlowRouter.go('./game') //if the user is in the game
    //BlazeLayout.render('exitSurvey'); //if the user is done with the game or failed the instructions
  },
});


//routing to consent
FlowRouter.route( '/consent', {
    action() {
        BlazeLayout.render( 'experimentLayout', {
            header: 'header_layout',
            page: 'consent_page',
            footer: 'footer_layout',
        });
    },
    name: 'consentRoute'
});

//routing to instructions
FlowRouter.route( '/instructions', {
    action() {
        BlazeLayout.render( 'experimentLayout', {
            header: 'header_layout',
            page: 'instructions_page',
            footer: 'footer_layout',
        });
    },
    name: 'instructionsRoute'
});






//design a 'Weird thing is happening! stop weirding'
 FlowRouter.notFound = {
    action() {
      BlazeLayout.render('/');
    },
 };
