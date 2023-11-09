const {blogController} = require('../controller/index');
const verifyToken = require('../middleware/verifyToken.js');

const blogRoutes = (app) => {
  app
      .post('/posts', verifyToken, blogController.createBlog)
      .get('/posts', blogController.getBlogPost)
      .get('/posts/:id', verifyToken, blogController.getBlogPostByID)
      .put('/posts/:id', verifyToken, blogController.updateBlogPost)
      .delete('/posts/:id', verifyToken, blogController.deleteBlogPost)
      .get('/posts/search', verifyToken, blogController.getBlogPostByAuthor);
};

module.exports = blogRoutes;
