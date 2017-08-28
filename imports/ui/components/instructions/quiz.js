import './quiz.html'
import { Template } from 'meteor/templating'
import {Session} from 'meteor/session';
import { Meteor } from 'meteor/meteor'


//This is kind of janky since quiz is based on condition, but the look up needs to be in the
// template helper; returning subsets of questions doesn't work with validation, there's probably
// a better solution...
const Questions = new Mongo.Collection(null);

const questions = [
    {
        text: '1) Your goal in the game is to ______ the correlation of two variables. ' +
        '(Fill in the blank with: \'guess\' or \'compute exactly\')',
	    answer: ['guess', 'guess'],
	    correct: false,
	    answered: false,
        conditions: ['control','T1','T2']

    },
    {
        text: '2) What is the maximum correlation possible in this game? (enter number)',
        answer: ['1','one'],
        correct: false,
        answered: false,
        conditions: ['control','T1','T2']
    },
    {
        text: '3) What is the minimum correlation possible in this game? (enter number)',
        answer: ['0','zero'],
        correct: false,
        answered: false,
        conditions: ['control','T1','T2']
    },
    {
        text: '4) Will get a chance to change your answer after you make your initial guess? (enter' +
        ' \'yes\' or \'no\')',
        answer: ['yes','yes!',true,'true'],
        correct: false,
        answered: false,
        conditions: ['T1','T2']
    }
];

for (let q = 0; q < questions.length; q++){
	Questions.insert(questions[q]);
}

Template.quiz.helpers({
	questions(){
	    //return questions related to the condition only
        if (Meteor.userId()){
            return Questions.find({conditions:Meteor.user().condition});
        }
	},
	quizAttempts(){
		return Meteor.user().quizAttempts;
	},
	passedQuiz(){
		return Meteor.user().passedQuiz;
	},
    exhaustedQuizAttempts(){
	    return (Meteor.user().quizAttempts === MAX_QUIZ_ATTEMPTS);
    },
    quizError() {
        let attempts = Meteor.user().quizAttempts;
        return (attempts > 0 && attempts < MAX_QUIZ_ATTEMPTS)
    },
    remainingAttempts(){
        return MAX_QUIZ_ATTEMPTS-Meteor.user().quizAttempts
    },
    noAttempts(){
        return Meteor.user().quizAttempts === 0;
    }
});


Template.quiz.events({
	'submit .quiz' (event) {
		//Only allow clients to attempt quiz twice before preventing them from doing so
        event.stopPropagation();
        event.preventDefault();
        const playerData = Meteor.user();
        let form = event.target;
        let result;

        //check the questions that are related to the condition
        Questions.find({conditions:Meteor.user().condition}).forEach( (q)=> {
            if ($.inArray(playerData.condition, q.conditions) >= 0) {
                let answer = $.trim(form[q._id].value.toLowerCase());
                let correct = $.inArray(answer, q.answer) >= 0;
                Questions.update({_id: q._id}, {$set: {correct: correct, answered: true}});
            }
        });
        result = Questions.find({correct:true,conditions:Meteor.user().condition}).count() === Questions.find({conditions:Meteor.user().condition}).count();

        if(!result) {
            Meteor.call('users.updateUserInfo',{'quizAttempts':1},'inc');
        } else {
            Meteor.call('users.updateUserInfo',{'passedQuiz':true}, 'set');
        }


    },
	'submit .startGame'(event) {
        event.preventDefault();
        Session.setPersistent('page','lobby');
        Meteor.call('users.updateUserInfo',{page:'lobby'},'set');
        FlowRouter.go('/lobby');
    },
    'submit .exitSurvey'(event) {
        event.preventDefault();
        Session.setPersistent('page','exit');
        Meteor.call('users.updateUserInfo',{page:'exit'},'set');
        Meteor.call('users.updateUserInfo',{exitStatus:'failedQuiz'},'set');
        Session.setPersistent('exitStatus','failedQuiz');
        FlowRouter.go('/exit');
    },
    'submit .previousInstruction'(event) {
        event.preventDefault();
        Session.setPersistent('instructionStage', 'accept')
    }

});

Template.question.helpers({
    incorrect(){
        return (this.answered && !this.correct);
    }

});