import './instructions_page.html';

import { Template } from 'meteor/templating';
import { Session } from 'meteor/session'
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Players } from '../../../api/players/players.js';

Template.instructions_page.onCreated(function () {
    Session.setPersistent('userStatus','instructions');
});

Template.instructions_page.helpers({
    userData(){
        return Players.findOne();
    }

});