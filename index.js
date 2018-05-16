require('dotenv').config() //INTERCOM_TOKEN
const express = require('express')
const Intercom = require("intercom-client");
const tagAnalyzer = require('./tagAnalyzer.js');

const client = new Intercom.Client({token: process.env.INTERCOM_TOKEN});
const app = express();
app.set('view engine', 'pug');

var admins = {};
client.admins.list(parseAdmins);

function parseAdmins(err, data){
  if(err){
    console.log(err);
  } else {
    for(d in data.body.admins){
      admins[data.body.admins[d].id] = data.body.admins[d];
    }
  }
}

app.get('/', function(req, res) {
  res.render('admins', {admins: admins});
});

app.get('/conversations/:adminid', function(req, res) {
  console.log('requested conversations: ' + req.params.adminid);
  
  if(admins[req.params.adminid] !== undefined){
    if(!admins[req.params.adminid].conversations){
      console.log("requesting tags for " + req.params.adminid)
      admins[req.params.adminid].conversations = new tagAnalyzer(client, req.params.adminid)
    }

    res.render('conversations', {title: admins[req.params.adminid], conversations: admins[req.params.adminid].conversations.allConversations()})
  } else {
    res.send('uh oh <a href="/">back</a>');
  }
});

app.listen(3000, () => console.log('listening on port 3000'))
console.log("uh");
