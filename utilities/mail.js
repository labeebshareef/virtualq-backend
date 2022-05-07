'use strict';

const nodemailer = require('nodemailer');

const loggerUtil = require('./logger');

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

exports.sendMail = async (email, subject, text, html, attachments) => {
  try {
    const mailOptions = {
      from: process.env.MAIL_SENDER,
      to: email,
      subject: subject,
    };

    if (text) {
      mailOptions.text = text;
    }

    if (html) {
      mailOptions.html = html;
    }

    if (attachments) {
      mailOptions.attachments = attachments;
    }
    console.log(mailOptions);
    return await new Promise((resolve, reject) => {
      transport.sendMail(mailOptions, (error, info) => {
        if (error) {
          return reject(error);
        }
        return resolve(true);
      });
    });
  } catch (ex) {
    loggerUtil.error({
      message: ex.toString(),
      level: 'error',
    });
    return false;
  }
};
