import { Meteor } from 'meteor/meteor';
import { Surveys } from "./survyes";

Meteor.methods({
    'surveys.insertAnswers'(data){
        Surveys.insert(data);
    },

});
