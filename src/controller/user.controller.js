require('dotenv').config();
const models = require('../models/index.js');
const helper = require('../helpers/helper-functions.js');
const responseData = require('../helpers/response.js');
const {code, responseMessage} = require('../utils/responseCodeAndMessage.js');
const {ReasonPhrases, StatusCodes} = require('http-status-codes');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const salt = bcrypt.genSaltSync(10);

const userController = {
  registerUser: async (req, res) => {
    try {
      const info = {
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, salt),
      };
      const userData = await models.User.findOne({email: info.email});

      if (userData) {
        helper.logger.error(responseMessage.EMAIL_ALREADY_EXISTS);
        responseData.sendMessage(res, code.ALREADY_EXISTS, responseMessage.EMAIL_ALREADY_EXISTS);
      } else {
        const addUser = new models.User(info);
        addUser.save();
        responseData.sendResponse(res, StatusCodes.OK, responseMessage.REGISTRATION_SUCCESS, addUser);
      }
    } catch (error) {
      helper.logger.error(error);
      responseData.errorResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
  },

  login: async (req, res) => {
    try {
      const userData = await models.User.findOne({email: req.body.email});

      if (userData) {
        const checkingPassword = bcrypt.compareSync(req.body.password, userData.password);
        if (checkingPassword) {
          const token = jwt.sign({_id: userData._id}, process.env.USER_SECRET_KEY);
          const updateUserData = await models.User.findOneAndUpdate({email: req.body.email}, {token: token}, {new: true});
          responseData.sendResponse(res, StatusCodes.OK, responseMessage.LOGIN_SUCCESS, updateUserData);
        } else {
          responseData.sendMessage(res, StatusCodes.NOT_FOUND, responseMessage.PASSWORD_ERROR);
        }
      } else {
        responseData.sendMessage(res, StatusCodes.NOT_FOUND, `Email ${ReasonPhrases.NOT_FOUND}`);
      }
    } catch (error) {
      helper.logger.error(error);
      responseData.errorResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
  },

  getUserInfo: async (req, res) => {
    try {
      const checkToken = req.user;
      const userData = await models.User.findOne({_id: checkToken._id});

      if (userData) {
        responseData.sendResponse(res, StatusCodes.OK, responseMessage.GET_DATA, userData);
      } else {
        responseData.sendMessage(res, StatusCodes.NOT_FOUND, `Data ${ReasonPhrases.NOT_FOUND}`);
      }
    } catch (error) {
      helper.logger.error(error);
      responseData.errorResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
  },

  updateUserInfo: async (req, res) => {
    try {
      const checkToken = req.user;
      const userData = await models.User.findOne({_id: checkToken._id});

      if (userData) {
        const {name, email, role} = req.body;
        const query = {};

        if (name) query.name = name;
        if (role) query.role = role;

        if (email) {
          const checkEmail = await models.User.find({email: email});

          if (checkEmail.length === 0) {
            query.email = email.toLowerCase();
          } else {
            helper.logger.error(responseMessage.EMAIL_ALREADY_EXISTS);
            return responseData.sendMessage(res, code.ALREADY_EXISTS, `${responseMessage.EMAIL_ALREADY_EXISTS}, Please enter a unique email.`);
          }
        }
        const updateData = await models.User.findOneAndUpdate(
            {_id: checkToken._id},
            {
              $set: {
                ...query,
              },
            },
            {new: true},
        );
        if (updateData) {
          responseData.sendResponse(res, StatusCodes.OK, 'Password updated successfully', updateData);
        }
      } else {
        helper.logger.error('Invalid Authentication!');
        responseData.sendMessage(res, StatusCodes.UNAUTHORIZED, responseMessage.UNAUTHORIZED);
      }
    } catch (error) {
      helper.logger.error(error);
      responseData.errorResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
  },

  updatePassword: async (req, res) => {
    try {
      const checkToken = req.user;
      const {old_password, new_password} = req.body;
      const userData = await models.User.findOne({_id: checkToken._id});
      bcrypt.compare(old_password, userData.password, async (err, result) => {
        if (err) {
          responseData.sendMessage(res, StatusCodes.NOT_FOUND, err);
        } else if (result) {
          await models.User.findOneAndUpdate({_id: checkToken._id}, {password: bcrypt.hashSync(new_password, salt)});
          responseData.sendResponse(res, StatusCodes.OK, 'Password updated successfully');
        } else {
          responseData.sendMessage(res, StatusCodes.NOT_ACCEPTABLE, `Wrong password ${ReasonPhrases.NOT_ACCEPTABLE}`);
        }
      });
    } catch (error) {
      helper.logger.error(error);
      responseData.errorResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
  },
};

module.exports = userController;
