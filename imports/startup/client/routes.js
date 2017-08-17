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
      console.log(userStatus);
      if (userStatus) {
          FlowRouter.go('/'+userStatus)
      }

  },
});


// routing to consent
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
        FlowRouter.go('/');
    },
 };
