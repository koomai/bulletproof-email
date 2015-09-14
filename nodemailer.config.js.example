/*
* Nodemailer configuration
* For supported services, see https://github.com/andris9/nodemailer-wellknown#supported-services
*/

module.exports = function() {

  var config = {
    transportOptions: {
      service: 'mailgun', 
      auth: {
        user: '',
        pass: ''
      }
    },
    mailOptions: {
      to: 'default@test.email.com', // Default address(es) to send test emails to (can be comma separated)
      from: 'Gulp Test <gulp@bulletproof.mailgun.org>', // Sender details 
      subject: 'Test email - sent by Bulletproof Email' // Default subject line
    },
    imageHost: '' // Full url path to your image host, with a trailing slash.
  };
  return config;
}