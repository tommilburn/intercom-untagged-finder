require('dotenv').config() //INTERCOM_TOKEN

const Intercom = require("intercom-client");
var client = new Intercom.Client({token: process.env.INTERCOM_TOKEN});

var admins = []
client.admins.list(parseAdmins);

function parseAdmins(err, data){
  if(err){
    console.log(err);
  } else {
    admins = data.body.admins;
    console.log(admins);
  }
}