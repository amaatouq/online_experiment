import './lobby_page.html';
import '../loader/loader';
import { Lobbies } from '../../../api/lobbies/lobbies';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

Template.lobby_page.onCreated(function() {
    Session.setPersistent('page','lobby');
    //now in the user database, ensure to set the current page to lobby
    if (Meteor.user()){
        if (Meteor.user().page!=='lobby'){
            Meteor.call('users.updateUserInfo',{page:'lobby'},'set');
        }
    }


    //if there is no timer, start a new one
    if (!Session.get('sTime')) {
        Session.setPersistent('sTime',new Date());
    }

    //get the player condition
    const condition = Meteor.user().condition;
    //get the player assigned lobby
    const userLobby = Meteor.user().lobbyId;

    this.subscribe('lobbies.userLobby');
    const availableLobbiesHandler = this.subscribe('lobbies.availableLobbies',condition);

    //if the user has no lobby, check if there is available lobby to join, or create one
    this.autorun((attachingUserToLobby)=>{
        if (!userLobby) {
            //if user doesn't have a lobby wait until the available lobbies become ready
            if (availableLobbiesHandler.ready()){
                let availableLobby = Lobbies.findOne({ condition: condition, lobbyStatus:'waiting'});
                //check if there is an available lobby, then join it, otherwise, create a lobby and join it
                if (availableLobby){
                    console.log('the user has no lobby but there is a lobby so he will join it');
                    Meteor.call('lobbies.joinLobby',availableLobby._id, Meteor.userId())
                } else {
                    //no lobby so we will create it first
                    Meteor.call('lobbies.createLobby',condition, (err,lobbyId)=>{
                        //then on callback we will join it
                        Meteor.call('lobbies.joinLobby',lobbyId)
                    })
                }
                attachingUserToLobby.stop();
            }
        } else {
            //the user has a lobbyId already, make sure he re-joins the lobby
            //inside the joinLobby, we check that the lobby isn't full already
            let lobby = Lobbies.findOne({players:Meteor.userId()});
            if (!lobby){
                Meteor.call('lobbies.joinLobby',Meteor.user().lobbyId)
            }


        }
    });


});


Template.lobby_page.helpers({

    desiredNumPlayers(){
        if (Meteor.userId()){
            return Meteor.user().condInfo.groupSize;
        }
    },

    numWaiting(){
        if (Meteor.userId()){
            let lobby = Lobbies.findOne({players:Meteor.userId()});
            if (lobby){
                return lobby.players.length
            }
        }
    },

    //doing the clock and as well the timeout
    clock(){
        Meteor.setInterval(()=>{
            const sTime = Session.get('sTime');
            const elapsed = (new Date() - sTime)/1000;
            const m = Math.floor(elapsed/60);
            let s = Math.floor(elapsed % 60);
            s = s < 10 ? "0" + s: s;
            Session.setPersistent('min',m);
            Session.setPersistent('sec',s);
        }, 900);
        //if the minutes are the same as the lobby_timeout take them to the exit survey
        if (Session.get('min') >= LOBBY_TIMEOUT) {
            Meteor.call('users.updateUserInfo',Meteor.userId(),{exitStatus:'lobbyTimeout'},'set');
            Session.setPersistent('page','exit');
            Meteor.call('users.updateUserInfo',Meteor.userId(),{page:'exit'},'set');
            FlowRouter.go('/exit');
        }
        return {
            min: Session.get('min'),
            sec: Session.get('sec')
        };
    },
    lobbyTimeout() {
        return LOBBY_TIMEOUT;
    }

});

