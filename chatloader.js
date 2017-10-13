'use strict';

var fs = require('fs');

module.exports = {
  loadRecentChats: function () {
    fs.readFile('logs/latest.log', 'utf8', function(err,data) {
      if (err) {
        return console.log(err);
      }
      var messages = data.replace('<', '[');
      messages = messages.replace('>', ']');
      console.log("CHATLOADER");
      console.log(messages);
      console.log("END CHATLOADER");
      return messages;
    });
  }
};
