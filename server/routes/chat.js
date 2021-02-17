const Router = require('koa-router');

const route = new Router();
const chat = require('../controllers/chat');

route.get('/user', chat.user);
route.post('/list', chat.list);
route.post('/create', chat.create);

module.exports = route;
