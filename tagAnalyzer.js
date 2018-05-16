module.exports = TagAnalyzer

function TagAnalyzer(client, admin){

  var client = client;
  var admin = admin;
  var allConversations = [];
  var totalPages = 0
  var currentPage = 0;

  requestConversations = function(){
    console.log('fetching all conversations');
    client.conversations.list({type: 'admin', admin_id: admin, open: false, per_page: 50}, function(err, data){
      if(err){
        console.log(err.body.errors);
      } else {
        parseConversationPage(data.body.conversations);
        client.nextPage(data.body.pages, requestConversationPage);
      }
    });
  }

  requestConversationPage = function(data){
    parseConversationPage(data.body.conversations);

    if(data.body.pages && data.body.pages.next){
      console.log("getting page " + data.body.pages.page + " of " + data.body.pages.total_pages)
      console.log(data.body.conversations.length);
      currentPage = data.body.pages.page;
      totalPages = data.body.pages.total_pages
      setTimeout(function(){
        client.nextPage(data.body.pages, requestConversationPage);
      }, (100))
    } else {
      console.log("done");
    }
  }

  parseConversationPage = function(newConversations){
    for(i in newConversations){
      var conversation = newConversations[i];
      console.log(conversation.id + " " + 25 * i);

      (function getConversationTags (i, newConversations) {
        setTimeout(function() {
          var conversation = newConversations[i];
          client.conversations.find({id:conversation.id}, function(err, data){
            if(err){
              conversation.tags = err;
            } else {
              console.log(data.body.tags.tags);
              conversation.tags = data.body.tags.tags
            }
          });
          if (--i) {          // If i > 0, keep going
            getConversationTags(i);       // Call the loop again, and pass it the current value of i
          } else {
            console.log("pushing array");
            Array.prototype.push.apply(allConversations, newConversations)
          }
        }, 3000);
      })(newConversations.length - 1, newConversations);

    }    
  }

  this.allConversations = function(){
    return allConversations;
  }

  requestConversations();
}



