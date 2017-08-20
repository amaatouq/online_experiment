import './progress.html'
import { Template } from 'meteor/templating'

Template.progress.helpers({
    isActive(stage){
        if (stage) { return 'active'}
    }
});