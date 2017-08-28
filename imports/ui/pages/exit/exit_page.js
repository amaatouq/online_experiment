import '../../../../lib/globals.js'
import './exit_page.html'


import { Template } from 'meteor/templating';
import { Session } from 'meteor/session'
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';


Template.exit_page.onCreated(function () {
    //set the userStatus to be exit in the session (this is not needed after the instructions?)
    Session.setPersistent('page','exit');
    Meteor.call('users.updateUserInfo',{page:'exit'},'set');
    Meteor.logout();
});

Template.exit_page.helpers({
    exitStatus() {
        let status =  Session.get('exitStatus');
        let failedQuiz = false;
        let failedMatch = false;
        let connectionError = false;
        let completed = false;
        let leftGame = false;
        let notEligible = false;
        switch (status){
            case 'failedQuiz':
                failedQuiz = true;
                notEligible = true;
                break;
            case 'lobbyTimeout':
                failedMatch = true;
                break;
            case 'connectionLost':
                connectionError = true;
                break;
            case 'leftGame':
                leftGame = true;
                notEligible = true;
                break;
            case 'finished':
                completed = true;
                break;
        }
        return{
            failedQuiz: failedQuiz,
            failedMatch: failedMatch,
            connectionError: connectionError,
            completed: completed,
            leftGame: leftGame,
            notEligible: notEligible,
            eligible: !notEligible
        };
    },
    baseReward(){
        return BASE_REWARD;
    },
    currentUser(){
        if (!Meteor.userId()){
            return Session.get('username')
        }
    },
    alreadyAnswered(){
        return Session.get('answeredExitSurvey')
    }

});

Template.exit_page.events({
    "submit #exit-survey": function(event) {
        event.preventDefault();
        const data = { userId: Session.get('username'),
            age: event.target.age.value,
            gender: event.target.gender.value,
            education: event.target.education.value,
            strategy: event.target.strategy.value,
            pay: event.target.pay.value,
            feedback: event.target.pay.value
        };
        Meteor.call('surveys.insertAnswers',data,()=>{
            Session.setPersistent('answeredExitSurvey',true);
        })
    }

});