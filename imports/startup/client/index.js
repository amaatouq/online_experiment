// Import client startup through a single index entry point
import './routes.js';
import { Meteor } from 'meteor/meteor';


Tracker.autorun(function(){
    Meteor.subscribe('users.user');
});

//Reactively subscribe to the databases about available games once we assign a condition to the user
Tracker.autorun(function(){
    if (Meteor.user()){
        let gameId = Meteor.user().gameId;
        //once assigned a condition, then start listening for potential available games for that condition
        if (gameId){
            Meteor.subscribe('games.userGame');
        }
    }
});



//New Spacebars function that should work on all templates
Template.registerHelper('Cond', function (v1, operator, v2) {
    switch (operator) {
        case '==':
            return (v1 === v2);
        case '!=':
            return (v1 !== v2);
        case '<':
            return (v1 < v2);
        case '<=':
            return (v1 <= v2);
        case '>':
            return (v1 > v2);
        case '>=':
            return (v1 >= v2);
        case '&&':
            return (v1 && v2);
        case '||':
            return (v1 || v2);
    }
});