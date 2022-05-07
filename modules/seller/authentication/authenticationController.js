'use strict';

const otpGenerator = require('otp-generator');

const mailUtil = require('../../../utilities/mail');
const messageUtil = require('../../../utilities/message');
const passwordUtil = require('../../../utilities/password');
const responseUtil = require('../../../utilities/response');
const tokenUtil = require('../../../utilities/token');

const authenticationService = require('./authenticationService');
const sellerProfileService = require('../sellerProfile/sellerProfileService');

// developer: labeeb
exports.generateOtp = async (req, res, next) => {
  try {
    const sellerExist = await authenticationService
      .getSellerByEmail(req.body.email);
    if (sellerExist) {
      if (sellerExist.emailVerified) {
        return responseUtil
          .badRequestErrorResponse(res, messageUtil.sellerExist);
      } else {
        await authenticationService.deleteUnverifiedSellers(sellerExist);
      }
    }

    const emailOtp = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    // create seller object
    const seller = await sellerProfileService.createSeller({
      email: req.body.email,
      emailVerified: false,
    });

    // create otp sessions
    await authenticationService.createOtpSession({
      email: req.body.email,
      otp: emailOtp,
    });

    // send otp email
    const subject = 'Account Activation';
    const html = `<div>Your OTP for activationg 
    VirtualQ account is ${emailOtp}.`;
    const mail = await mailUtil
      .sendMail(req.body.email, subject, null, html);
    console.error(mail);
    if (!mail) {
      return responseUtil
        .badRequestErrorResponse(res, messageUtil.emailSentError);
    }

    responseUtil.successResponse(res, messageUtil.otpSendSuccess, seller);
  } catch (ex) {
    responseUtil.serverErrorResponse(res, ex);
  }
};

exports.signup = async (req, res, next) => {
  try {
    const fullName = req.body.fullName;
    const sellerId = req.body.sellerId;
    const password = req.body.password;
    const emailOtp = req.body.emailOtp;
    const seller = await authenticationService
      .getSellerById(sellerId);
    console.log(seller);
    if (seller) {
      if (seller.emailVerified) {
        return responseUtil
          .badRequestErrorResponse(res, messageUtil.sellerExists, seller);
      }
    }
    const otpSession = await authenticationService
      .getOtpSessionByEmail(seller.email);
    if (!otpSession || otpSession.otp !== emailOtp) {
      return responseUtil
        .badRequestErrorResponse(res, messageUtil.incorrectEmailOtp);
    }

    const passwordHash = await passwordUtil.generateHash(password);

    await authenticationService.updateSellerById(sellerId, {
      fullName: fullName,
      password: passwordHash,
      emailVerified: true,
    });
    const sellerDetails = await authenticationService
      .getSellerById(sellerId);

    const token = await tokenUtil.generate({
      _id: seller._id,
    });

    await authenticationService.createLoginSession({
      sellerId: seller._id,
      token: token,
    });
    responseUtil.successResponse(res, messageUtil.signupSuccess,
      { sellerDetails: sellerDetails, token: token });
  } catch (ex) {
    console.error(ex);
    responseUtil.serverErrorResponse(res, ex);
  }
};
exports.login = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const seller = await authenticationService.getSellerByEmail(email);
    if (!seller) {
      return responseUtil
        .badRequestErrorResponse(res, messageUtil.invalidLoginCredentials);
    }

    const comparePassword = await passwordUtil
      .comparePasswords(password, seller.password);
    if (!comparePassword) {
      return responseUtil
        .badRequestErrorResponse(res, messageUtil.invalidLoginCredentials);
    }

    const token = await tokenUtil.generate({
      _id: seller._id,
    });

    await authenticationService.createLoginSession({
      sellerId: seller._id,
      token: token,
    });

    responseUtil.successResponse(res, messageUtil.loginSuccess, {
      token: token,
      _id: seller._id,
      fullName: seller.fullName,
      email: seller.email,
    });
  } catch (ex) {
    responseUtil.serverErrorResponse(res, ex);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const email = req.body.email;

    const seller = await authenticationService.getSellerByEmail(email);
    if (!seller) {
      return responseUtil.successResponse(res, messageUtil.sentForgotOtp, null);
    }

    const otp = (Math.floor(1e3 + Math.random() * 9e3)).toString();
    await authenticationService.createOtpSession({
      email: email,
      otp: otp,
    });

    const subject = 'Password Reset';
    const html = `<div>Your Password Reset Verification Code is ${otp}.`;
    const mail = await mailUtil
      .sendMail(seller.email, subject, null, html);
    if (!mail) {
      return responseUtil
        .badRequestErrorResponse(res, messageUtil.emailSentError);
    }

    responseUtil.successResponse(res, messageUtil.sentForgotOtp, null);
  } catch (ex) {
    responseUtil.serverErrorResponse(res, ex);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const otp = req.body.otp;

    const otpSession = await authenticationService
      .getOtpSessionByEmail(email);
    if (!otpSession || otpSession.otp !== otp) {
      return responseUtil
        .badRequestErrorResponse(res, messageUtil.incorrectOtp);
    }

    const seller = await authenticationService.getSellerByEmail(email);
    if (!seller) {
      return responseUtil
        .badRequestErrorResponse(res, messageUtil.invalidEmail);
    }

    const passwordHash = await passwordUtil.generateHash(password);
    await authenticationService.updateSellerByEmail(email, {
      password: passwordHash,
    });

    await authenticationService.deleteOtpSessionById(otpSession._id);

    responseUtil.successResponse(res, messageUtil.resetPasswordSuccess, null);
  } catch (ex) {
    responseUtil.serverErrorResponse(res, ex);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const sellerId = req.seller._id;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    const seller = await authenticationService.getSellerById(sellerId);
    if (!seller) {
      return responseUtil
        .badRequestErrorResponse(res, messageUtil.sellerNotFound);
    }

    const comparePassword = await passwordUtil
      .comparePasswords(oldPassword, seller.password);
    if (!comparePassword) {
      return responseUtil
        .badRequestErrorResponse(res, messageUtil.incorrectPassword);
    }

    const passwordHash = await passwordUtil.generateHash(newPassword);
    await authenticationService.updateSellerById(sellerId, {
      password: passwordHash,
    });

    responseUtil.successResponse(res, messageUtil.changePasswordSuccess, null);
  } catch (ex) {
    responseUtil.serverErrorResponse(res, ex);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    await authenticationService.deleteLoginSessionByToken(token);

    responseUtil.successResponse(res, messageUtil.logoutSuccess, null);
  } catch (ex) {
    responseUtil.serverErrorResponse(res, ex);
  }
};
