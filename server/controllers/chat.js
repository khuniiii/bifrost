const Account = require("../models/account");
const Chat = require("../models/chat");

exports.user = async (ctx) => {
  let account;

  try {
    account = await Account.find().exec();
  } catch (e) {
    return ctx.throw(500, e);
  }

  if (!account) {
    ctx.status = 403;
    return;
  }

  ctx.body = account;
}

exports.list = async (ctx) => {
  const { i, u } = ctx.request.body;

  let chat;

  try {
    chat = await Chat.find().or([ { reqId: i, resId: u }, { reqId: u, resId: i } ]);
  } catch (e) {
    return ctx.throw(500, e);
  }

  if (!chat) {
    ctx.status = 403;
    return;
  }

  ctx.body = chat;
}

exports.create = async (ctx) => {
  const { reqId, resId, message } = ctx.request.body;

  const chat = new Chat({
    reqId,
    resId,
    message
  });

  try {
    await chat.save();
  } catch (e) {
    return ctx.throw(500, e);
  }

  ctx.body = chat;
};
