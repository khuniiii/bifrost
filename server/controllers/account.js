const Account = require("../models/account");

exports.user = async (ctx) => {
  const { id } = ctx.request.body;

  let account;

  try {
    account = await Account.findOne({ id: id }).exec();
  } catch (e) {
    return ctx.throw(500, e);
  }

  if (!account) {
    ctx.status = 403;
    return;
  }

  ctx.body = account;
}

exports.login = async (ctx) => {
  const { id, pw } = ctx.request.body;

  let account;

  try {
    account = await Account.findOne({ id: id, pw: pw }).exec();
  } catch (e) {
    return ctx.throw(500, e);
  }

  if (!account) {
    ctx.status = 403;
    return;
  }

  ctx.body = account;
};

exports.register = async (ctx) => {
  const { id, pw, email, grade, classroom, number, name } = ctx.request.body;

  const account = new Account({
    id,
    pw,
    email,
    grade,
    classroom,
    number,
    name,
  });

  try {
    await account.save();
  } catch (e) {
    return ctx.throw(500, e);
  }

  ctx.body = account;
};
