const Check = require("../models/check");

exports.validation = async (ctx) => {
  const { id } = ctx.request.body;

  let check;
  const date = new Date()

  try {
    check = await Check.findOne({ id: id, createdAt: { $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()), $lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1) } }).exec();
  } catch (e) {
    return ctx.throw(500, e);
  }

  if (!check) {
    ctx.status = 403;
    return;
  }

  ctx.body = check;
};

exports.submit = async (ctx) => {
  const { id, first, second, third } = ctx.request.body;

  const check = new Check({
    id,
    first,
    second,
    third,
  });

  try {
    await check.save();
  } catch (e) {
    return ctx.throw(500, e);
  }

  ctx.body = check;
};
