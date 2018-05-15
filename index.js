require('dotenv').config() //INTERCOM_TOKEN
const express = require('express')
const Intercom = require("intercom-client");

const client = new Intercom.Client({token: process.env.INTERCOM_TOKEN});
const app = express();


var admins = []
client.admins.list(parseAdmins);

function parseAdmins(err, data){
  if(err){
    console.log(err);
  } else {
    admins = data.body.admins;
  }
}

app.get('/', function(req, res) {
  res.send('hello world');
});

app.listen(3000, () => console.log('listening on port 3000'))
