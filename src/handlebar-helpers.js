var Handlebars = require('handlebars')

// this helper checks if a given number  has a given remainder when divide by 3
Handlebars.registerHelper('ifmod3', function(number,mod,options) {

    if(number%3==mod) {
      return options.fn(this);
    }
  });
  