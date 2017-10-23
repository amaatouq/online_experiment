// fill the db with example data on startup

import { Meteor } from 'meteor/meteor';

import { Tasks } from '../../api/games/tasks.js';

Meteor.startup(() => {
    // if the tasks collection is empty
    console.log('on startup');
    if (Tasks.find().count() === 0) {
        //read teh tasks file
        console.log('I am in');
        const task_data = JSON.parse(Assets.getText("tasks_data.json"));
        console.log(task_data);
        //const data = JSON.parse(task_data));
        task_data.forEach( (task)=> {
            Tasks.insert(task)
        });
    }
});
