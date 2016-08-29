var envVars = require('system').env;

casper.test.begin('started tumbler test', 7, function(test){

  casper.on('remote.message', function(msg){
    this.echo('remote.msg: ' + msg, 'INFO');
  });

  casper.on('page.error', function(pageErr){
    this.echo('page.err: ' + JSON.stringify(pageErr), 'ERROR');
  });

  casper.start('https://tumblr.com', function(){
    test.assertExists('button[id="signup_login_button"]', 'login button found!');

    this.evaluate(function(){
      document.querySelector('button[id="signup_login_button"]').click();
    });
  });

  casper.then(function(){
    this.wait(3000, function(){
      console.log('take a screen shot to show login was clicked');
      this.capture('loginClicked.png');
    });
  });

  casper.then(function(){
    test.assertExists('input[id="signup_determine_email"]', 'email input found!');
  });

  casper.then(function(){
    this.evaluate(function(email){
      document.querySelector('input[id="signup_determine_email"]').value=email;
    }, envVars.email);
  });

  casper.then(function(){
    console.log('take a screen shot to show email entered');
    this.capture('emailEntered.png');
    this.evaluate(function(){
      document.querySelector('button[id="signup_forms_submit"]').click();
    });
  });

  casper.then(function(){
    this.wait(3000, function(){
      console.log('screen shot to show email submitted');
      this.capture('emailSubmitted.png');
    });
  });

  casper.then(function(){
    test.assertExists('input[id="signup_password"]', 'login password input found!');
    this.evaluate(function(password){
      document.querySelector('input[id="signup_password"]').value=password;
    }, envVars.password);
  });

  casper.then(function(){
    console.log('screen shot to show password field filled out');
    this.capture('passwordEntered.png');
    this.evaluate(function(){
      document.querySelector('button[id="signup_forms_submit"]').click();
    });
  });

  casper.then(function(){
    this.wait(3000, function(){
      this.capture('afterloggedin.png');
    });
  });

  casper.then(function(){
    test.assertExists('button[title="Make a post"]', 'create post button exists');
    this.evaluate(function(){
      document.querySelector('button[title="Make a post"]').click();
    });
    test.assertExists('div[class="post-type-icon icon-text"]', 'found text icon');
    this.capture('clickedCreatePost.png');
    this.evaluate(function(){
      document.querySelector('div[class="post-type-icon icon-text"]').click();
    });
    this.wait(2000, function(){
      test.assertExists('div[aria-label="Post title"] span', ' found post title');
      this.sendKeys('div[aria-label="Post title"] span', 'Test');
      this.sendKeys('div[aria-label="Post body"] p', 'Testing');
    });
  });

  casper.then(function(){
    test.assertExists('button[class="button-area create_post_button"]', 'button');
    this.evaluate(function(){
      document.querySelector('button[class="button-area create_post_button"]').click();
    });
    this.wait(3000, function(){
      this.capture('createdPost.png');
    });
  });

  casper.run(function(){
    test.done();
  });
});