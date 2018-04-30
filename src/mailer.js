var api_key = 'key-a790c7dcd4a8d6b103d658321ee4b01e';
var domain = 'sandboxf461dbe17cad423c9e36c3ac14755efe.mailgun.org';
var mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain });
var UserModel = require('../models/user');


var FROM = 'Birch <postmaster@sandboxf461dbe17cad423c9e36c3ac14755efe.mailgun.org>';


exports.send_vendor_otp = (to, data, callback) => {

    let opts = {
        from: FROM,
        to: to,
        subject: 'Verify your OTP ',
        text: "This is your resended OTP  code " + data.otp + ". \n Enter it In your OTP section input"
    };

    return send_mail(opts)

}

exports.send_vendor_signup_email = (to,data,callback) =>{

    let opts = {
        from: FROM,
        to: to,
        subject: 'Thanks for signing up with Birch!',
        text: "This is your OTP " + data.otp + ". \n Enter it In your OTP section input"
    };

    return send_mail(opts);

}


let send_mail = (data) => {


    let pr  = (resolve,reject) => {

        mailgun.messages().send(data, function (error, body) {
            if(error)
                reject(error)
            else
                resolve(true)
        });

    }

    return new Promise(pr)
}



