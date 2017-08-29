import './game_progress.html'
import { Template } from 'meteor/templating'

Template.game_progress.helpers({
    isActive(stage){
        if (stage) { return 'active'}
    }
});