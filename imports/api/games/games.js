import { Mongo } from 'meteor/mongo'

export const Games = new Mongo.Collection('games');

export const Rounds = new Mongo.Collection('rounds');


//we will probably not need this
//export const Networks = new Mongo.Collection('networks');