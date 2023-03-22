const csv = require("csv-parser");
const fs = require("fs");
const nodemailer = require("nodemailer");

const cleanEmails = [];

fs.createReadStream("emails.csv")
  .pipe(csv())
  .on("data", (data) => {
    const email = data.email.trim();
    const domain = email.split("@")[1];
    dns.resolveMx(domain, (err, addresses) => {
      if (err || addresses.length === 0) {
        console.log(`${email} is not a valid email`);
      } else {
        console.log(`${email} is a valid email`);
        cleanEmails.push(email);
      }
    });
  })
  .on("end", () => {
    console.log("All emails have been processed");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "your_email@gmail.com",
        pass: "your_password",
      },
    });
    const mailOptions = {
      from: "your_email@gmail.com",
      subject: "Subject of Email",
      html: "<h1>Email Template</h1><p>Here is the content of the email</p>",
    };
    cleanEmails.forEach((email) => {
      mailOptions.to = email;
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(`Failed to send email to ${email}. Error: ${error}`);
        } else {
          console.log(
            `Email sent successfully to ${email}. Response: ${info.response}`
          );
        }
      });
    });
  });
