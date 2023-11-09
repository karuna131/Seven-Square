const models = require('../models/index');
const jwt = require('jsonwebtoken');
const helper = require('../helpers/helper-functions.js');
const responseData = require('../helpers/response.js');
const {ReasonPhrases, StatusCodes} = require('http-status-codes');

const verifyToken = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.USER_SECRET_KEY);
      req.user = await models.User.findOne({
        _id: decoded._id,
      });
      next();
    } else {
      helper.logger.error(ReasonPhrases.UNAUTHORIZED);
      return responseData.errorResponse(res, StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED);
    }
    if (!token) {
      helper.logger.error(`Token ${ReasonPhrases.NOT_FOUND}`);
      return responseData.errorResponse(res, StatusCodes.NOT_FOUND, `Token ${ReasonPhrases.NOT_FOUND}`);
    }
  } catch (error) {
    helper.logger.error(error);
    responseData.errorResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error);
  }
};

module.exports = verifyToken;
