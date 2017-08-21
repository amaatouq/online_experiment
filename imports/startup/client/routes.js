import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { Meteor } from 'meteor/meteor'
import { Session } from 'meteor/session'


// Import layout .. probably the experiment has 1 layout
import '../../ui/layouts/experimentLayout.js'
//import layout components
import '../../ui/components/layout/header_layout.js'
import '../../ui/components/layout/footer_layout.js'

//import pages
import '../../ui/pages/consent/consent_page.js'
import '../../ui/pages/instructions/instructions_page.js'


//if user is not logged in, take them to consent page
FlowRouter.triggers.enter([function(context, redirect){
    if(!Meteor.userId()){
        FlowRouter.go('/consent')
    }
}]);


//here I should check the status of the user to decide where to route them
FlowRouter.route('/', {
  name: 'landing',
  action() {
      let userStatus = Session.get('userStatus');
      if (userStatus) {
          FlowRouter.go('/'+userStatus)
      }

  },
});


// routing to consent
FlowRouter.route( '/consent', {
    action() {
        //if user is already logged in, no need to take them to the consent page
        if (Meteor.userId()){
            FlowRouter.go('/')
        }
        BlazeLayout.render( 'experimentLayout', {
            header: 'header_layout',
            page: 'consent_page',
            footer: 'footer_layout',
        });
    },
    name: 'consentRoute'
});

// routing to instructions
FlowRouter.route( '/instructions', {
    action() {
        //if user is already logged in, no need to take them to the consent page
        if (Meteor.userId()){
            FlowRouter.go('/')
        }
        BlazeLayout.render( 'experimentLayout', {
            header: 'header_layout',
            page: 'instructions_page',
            footer: 'footer_layout',
        });
    },
    name: 'instructionsRoute'
});

//routing to lobby
FlowRouter.route( '/lobby', {
    action() {
        BlazeLayout.render( 'experimentLayout', {
            header: 'header_layout',
            page: 'lobby_page',
            footer: 'footer_layout',
        });
    },
    name: 'lobbyRoute'
});


//routing to exitSurvey
FlowRouter.route( '/exitSurvey', {
    action() {
        BlazeLayout.render( 'experimentLayout', {
            header: 'header_layout',
            page: 'exit_page',
            footer: 'footer_layout',
        });
    },
    name: 'exitRoute'
});

//routing to game
FlowRouter.route( '/game', {
    action() {
        BlazeLayout.render( 'experimentLayout', {
            header: 'header_layout',
            page: 'game_page',
            footer: 'footer_layout',
        });
    },
    name: 'gameRoute'
});





//design a 'Weird thing is happening! stop weirding'
 FlowRouter.notFound = {
    action() {
        FlowRouter.go('/');
    },
 };
