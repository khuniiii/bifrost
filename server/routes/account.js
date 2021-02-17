const Router = require('koa-router');

const route = new Router();
const account = require('../controllers/account');

route.post('/user', account.user);
route.post('/login', account.login);
route.post('/register', account.register);

module.exports = route;
