module.exports = TagAnalyzer
const Bottleneck = require('bottleneck');

const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 200
});

function TagAnalyzer(client, admin){

  var client = client;
  var admin = admin;
  var allClosedConversations = [];
  var totalPages = 0
  var currentPage = 0;

  requestConversationPage = function(err, currentPage){
    if(err){
      console.log(err);
      return;
    }
    if(currentPage && currentPage.body.pages){ //on a page, more pages exist
      console.log("on page: " + currentPage.body.pages.page + " total: " + allClosedConversations.length);
      parseConversationPage(currentPage.body.conversations)
      limiter.schedule(() => client.nextPage(currentPage.body.pages, requestConversationPage, undefined));
    } else {
      console.log("done");
    }
  }
  

  parseConversationPage = function(newConversations){
    for (c in newConversations){
      allClosedConversations[newConversations[c].id] = newConversations[c];
      limiter.schedule(requestConversationTags, newConversations[c]);
    }
  }

  requestConversationTags = function(conversation){
    console.log(conversation.id);
    client.conversations.find({ id: conversation.id }, parseConversationTags);
  }

  parseConversationTags = function(err, conversationInformation){
    console.log(conversationInformation.body.tags)
    var id = conversationInformation.body.id
    var tags = conversationInformation.body.tags
    allClosedConversations[id].tags = tags;
  }

  this.allConversations = function(){
    console.log("all closed " + Object.keys(allClosedConversations).length)
    return allClosedConversations;
  }

  client.conversations.list({type: 'admin', admin_id: admin, open: false}, requestConversationPage);
}



