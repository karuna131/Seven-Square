const {userController} = require('../controller/index');
const verifyToken = require('../middleware/verifyToken.js');

const userRoutes = (app) => {
  app
      .post('/users/register', userController.registerUser)
      .post('/users/login', userController.login)
      .get('/users/me', verifyToken, userController.getUserInfo )
      .put('/users/me', verifyToken, userController.updateUserInfo)
      .put('/users/me/password', verifyToken, userController.updatePassword);
};

module.exports = userRoutes;
