const Music = require("../models/music");

exports.list = async (ctx) => {
  let music;

  const date = new Date()

  try {
    music = await Music.find().exec();
  } catch (e) {
    return ctx.throw(500, e);
  }

  if (!music) {
    ctx.status = 403;
    return;
  }

  ctx.body = music;
};

exports.submit = async (ctx) => {
  const { id, title, url, artist, } = ctx.request.body;

  const music = new Music({
    id,
    title,
    url,
    artist,
  });

  try {
    await music.save();
  } catch (e) {
    return ctx.throw(500, e);
  }

  ctx.body = music;
};

exports.edit = async (ctx) => {
  const { id, title, url, artist, _id } = ctx.request.body;

  const music = new Music({
    id,
    title,
    url,
    artist,
  });

  try {
    await Music.deleteOne({ _id: _id }).exec();
    await music.save();
  } catch (e) {
    return ctx.throw(500, e);
  }

  ctx.body = music;
};

exports.delete = async (ctx) => {
  const { _id } = ctx.request.body;

  let music

  try {
    music = await Music.deleteOne({ _id: _id }).exec();
  } catch (e) {
    return ctx.throw(500, e);
  }

  if (!music) {
    ctx.status = 403;
    return;
  }

  ctx.body = music;
};
