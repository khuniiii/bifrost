const Router = require('koa-router');

const route = new Router();
const check = require('../controllers/check');

route.post('/submit', check.submit);
route.post('/validation', check.validation);

module.exports = route;
