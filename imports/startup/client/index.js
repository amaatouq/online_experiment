// Import client startup through a single index entry point

import './routes.js';
//we first subscribe the user
Meteor.subscribe('players.playerData');