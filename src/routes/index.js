const userRoutes = require('./user.router');
const blogRoutes = require('./blog.router');

const routes = (app, router) => {
  app.use('/api/v1', router);
  app.use((req, res, next) => {
    return res.status(404).send({message: 'Not Found'});
  });
  userRoutes(router);
  blogRoutes(router);
};

module.exports = routes;
