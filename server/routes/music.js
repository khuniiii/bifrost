const Router = require('koa-router');

const route = new Router();
const music = require('../controllers/music');

route.get('/list', music.list);
route.post('/submit', music.submit);
route.post('/edit', music.edit);
route.post('/delete', music.delete);

module.exports = route;
