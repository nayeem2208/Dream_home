import nodemailer from 'nodemailer'

const sendresetmail = (name, email, token) => {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.ETHERIALHOST,
        port: process.env.ETHERIALPORT,
        secure:false,
      requireTLS:true,
        auth: {
            user: process.env.ETHERILAUSERID,
            pass: process.env.ETHERIALPASSWORD
        }
    });
  
      const mailoption = {
        from: process.env.FROMMAIL,
        to: email,
        // to: 'rttaehcct@bugfoo.com',
  
        subject: "Reset your password",
        text: "hello",
        html: "<p>hi " + name + ",this is your<b>" + token + "</b></p>  ",
      };
      transporter.sendMail(mailoption, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("email has been verified", info.response);
        }
      });
    } catch (error) {
      console.log(error.message);
      res.render('user/error')
    }
  };

  export default sendresetmail