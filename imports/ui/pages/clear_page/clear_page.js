import {Meteor} from 'meteor/meteor';
import { Session }from 'meteor/session'
import {Template} from 'meteor/templating'
import './clear_page.html'

Template.clear_page.onCreated(function () {
    for (const sKey in Session.keys) {
        console.log(sKey);
        Session.setPersistent(sKey, null);
    }
    FlowRouter.go('/');
});