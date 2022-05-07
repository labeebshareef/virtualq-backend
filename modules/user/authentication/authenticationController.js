'use strict';

const otpGenerator = require('otp-generator');

const mailUtil = require('../../../utilities/mail');
const messageUtil = require('../../../utilities/message');
const passwordUtil = require('../../../utilities/password');
const responseUtil = require('../../../utilities/response');
const tokenUtil = require('../../../utilities/token');

const authenticationService = require('./authenticationService');
const profileService = require('../profile/profileService');

// developer: labeeb
exports.generateOtp = async (req, res, next) => {
  try {
    const userExist = await authenticationService
      .getUserByEmail(req.body.email);
    if (userExist) {
      if (userExist.emailVerified) {
        return responseUtil
          .badRequestErrorResponse(res, messageUtil.userExists);
      } else {
        await authenticationService.deleteUnverifiedUsers(userExist);
      }
    }

    const emailOtp = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    // create User object
    const user = await profileService.createUser({
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
    console.error(req.body.email, subject, null, html);
    if (!mail) {
      return responseUtil
        .badRequestErrorResponse(res, messageUtil.emailSentError);
    }

    responseUtil.successResponse(res, messageUtil.otpSendSuccess, user);
  } catch (ex) {
    responseUtil.serverErrorResponse(res, ex);
  }
};

exports.signup = async (req, res, next) => {
  try {
    const fullName = req.body.fullName;
    const userId = req.body.userId;
    const password = req.body.password;
    const emailOtp = req.body.emailOtp;
    const user = await authenticationService
      .getUserById(userId);
    console.log(user);
    if (user) {
      if (user.emailVerified) {
        return responseUtil
          .badRequestErrorResponse(res, messageUtil.userExists, user);
      }
    }
    const otpSession = await authenticationService
      .getOtpSessionByEmail(user.email);
    if (!otpSession || otpSession.otp !== emailOtp) {
      return responseUtil
        .badRequestErrorResponse(res, messageUtil.incorrectEmailOtp);
    }

    const passwordHash = await passwordUtil.generateHash(password);

    await authenticationService.updateUserById(userId, {
      fullName: fullName,
      password: passwordHash,
      emailVerified: true,
    });
    const userDetails = await authenticationService
      .getUserById(userId);

    const token = await tokenUtil.generate({
      _id: user._id,
    });

    await authenticationService.createLoginSession({
      userId: user._id,
      token: token,
    });
    responseUtil.successResponse(res, messageUtil.signupSuccess,
      { userDetails: userDetails, token: token });
  } catch (ex) {
    console.error(ex);
    responseUtil.serverErrorResponse(res, ex);
  }
};


exports.login = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await authenticationService.getUserByEmail(email);
    if (!user) {
      return responseUtil
        .badRequestErrorResponse(res, messageUtil.invalidLoginCredentials);
    }

    const comparePassword = await passwordUtil
      .comparePasswords(password, user.password);
    if (!comparePassword) {
      return responseUtil
        .badRequestErrorResponse(res, messageUtil.invalidLoginCredentials);
    }

    const token = await tokenUtil.generate({
      _id: user._id,
    });

    await authenticationService.createLoginSession({
      userId: user._id,
      token: token,
    });

    responseUtil.successResponse(res, messageUtil.loginSuccess, {
      token: token,
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
    });
  } catch (ex) {
    responseUtil.serverErrorResponse(res, ex);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const email = req.body.email;

    const user = await authenticationService.getUserByEmail(email);
    if (!user) {
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
      .sendMail(user.email, subject, null, html);
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

    const user = await authenticationService.getUserByEmail(email);
    if (!user) {
      return responseUtil
        .badRequestErrorResponse(res, messageUtil.invalidEmail);
    }

    const passwordHash = await passwordUtil.generateHash(password);
    await authenticationService.updateUserByEmail(email, {
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
    const userId = req.user._id;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    const user = await authenticationService.getUserById(userId);
    if (!user) {
      return responseUtil
        .badRequestErrorResponse(res, messageUtil.userNotFound);
    }

    const comparePassword = await passwordUtil
      .comparePasswords(oldPassword, user.password);
    if (!comparePassword) {
      return responseUtil
        .badRequestErrorResponse(res, messageUtil.incorrectPassword);
    }

    const passwordHash = await passwordUtil.generateHash(newPassword);
    await authenticationService.updateUserById(userId, {
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

