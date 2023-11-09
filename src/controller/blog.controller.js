require('dotenv').config();
const models = require('../models/index.js');
const helper = require('../helpers/helper-functions.js');
const responseData = require('../helpers/response.js');
const {code, responseMessage} = require('../utils/responseCodeAndMessage.js');
const {ReasonPhrases, StatusCodes} = require('http-status-codes');

const blogController = {
  createBlog: async (req, res) => {
    try {
      const userData = req.user;
      const {title, content, slug, tags} = req.body;
      const blogPostData = await models.Blog.findOne({slug: slug});

      if (blogPostData) {
        helper.logger.error(responseMessage.ALREADY_EXISTS);
        responseData.sendMessage(res, code.ALREADY_EXISTS, responseMessage.ALREADY_EXISTS);
      } else {
        const addBlogPost = new models.Blog(
            {title, content, slug, author: userData.name, tags},
        );
        addBlogPost.save();
        responseData.sendResponse(res, StatusCodes.CREATED, `Blog ${ReasonPhrases.CREATED}`, addBlogPost);
      }
    } catch (error) {
      helper.logger.error(error);
      responseData.errorResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
  },

  getBlogPost: async (req, res) => {
    try {
      const blogPostData = await models.Blog.find();
      if (blogPostData.length !== 0) {
        responseData.sendResponse(res, StatusCodes.OK, responseMessage.GET_DATA, blogPostData);
      } else {
        helper.logger.error('Data not available');
        responseData.sendMessage(res, StatusCodes.OK, 'Data not available');
      }
    } catch (error) {
      helper.logger.error(error);
      responseData.errorResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
  },


  getBlogPostByID: async (req, res) => {
    try {
      const blogPostData = await models.Blog.findOne({'_id': req.params.id});
      if (blogPostData) {
        responseData.sendResponse(res, StatusCodes.OK, responseMessage.GET_DATA, blogPostData);
      } else {
        helper.logger.error('Data not available');
        responseData.sendMessage(res, StatusCodes.NOT_FOUND, `Data ${ReasonPhrases.NOT_FOUND}`);
      }
    } catch (error) {
      helper.logger.error(error);
      responseData.errorResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
  },

  updateBlogPost: async (req, res) => {
    try {
      const blogPostData = await models.Blog.findOne({'_id': req.params.id});

      if (blogPostData) {
        const {title, content, slug, tags} = req.body;
        const query = {};

        if (title) query.title = title;
        if (content) query.content = content;
        if (tags) query.tags = tags;

        if (slug) {
          const checkSlug = await models.User.find({slug: slug});

          if (checkSlug.length === 0) {
            query.slug = slug;
          } else {
            helper.logger.error(responseMessage.ALREADY_EXISTS);
            return responseData.sendMessage(res, code.ALREADY_EXISTS, `${responseMessage.ALREADY_EXISTS}.`);
          }
        }
        const updateData = await models.Blog.findOneAndUpdate(
            {'_id': req.params.id},
            {
              $set: {
                ...query,
              },
            },
            {new: true},
        );
        if (updateData) {
          responseData.sendResponse(res, StatusCodes.OK, 'Data updated successfully', updateData);
        }
      } else {
        helper.logger.error(`Data ${ReasonPhrases.NOT_FOUND}`);
        responseData.sendMessage(res, StatusCodes.NOT_FOUND, `Data ${ReasonPhrases.NOT_FOUND}`);
      }
    } catch (error) {
      helper.logger.error(error);
      responseData.errorResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
  },

  deleteBlogPost: async (req, res) => {
    try {
      const blogPostData = await models.Blog.findByIdAndDelete({'_id': req.params.id});
      if (blogPostData) {
        responseData.sendResponse(res, StatusCodes.OK, 'Data deleted successfully', blogPostData);
      } else {
        helper.logger.error('Data not available');
        responseData.sendMessage(res, StatusCodes.NOT_FOUND, `Data ${ReasonPhrases.NOT_FOUND}`);
      }
    } catch (error) {
      helper.logger.error(error);
      responseData.errorResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
  },


  getBlogPostByAuthor: async (req, res) =>{
    try {
      const blogPostData = await models.Blog.find({author: req.query.author});
      if (blogPostData.length !== 0) {
        responseData.sendResponse(res, StatusCodes.OK, responseMessage.GET_DATA, blogPostData);
      } else {
        helper.logger.error('Data not available');
        responseData.sendMessage(res, StatusCodes.OK, 'Data not available');
      }
    } catch (error) {
      helper.logger.error(error);
      responseData.errorResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
  },
};

module.exports = blogController;
