const Koa = require("koa");
const Router = require("koa-router");
const cors = require("@koa/cors");
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();

router.get("/", (ctx) => {
  ctx.body = "Hello, World!";
});

router.use("/account", require("./routes/account").routes());
router.use("/check", require("./routes/check").routes());
router.use("/music", require("./routes/music").routes());
router.use("/chat", require("./routes/chat").routes());

const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

mongoose
  .connect("mongodb://localhost/project", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Successfully connected to mongodb");
  })
  .catch((e) => {
    console.error(e);
  });

const corsOptions = {
  origin: "*",
  credentials: true,
};

app.proxy = true;
app.use(cors(corsOptions));
app.use(bodyParser());
app.use(router.allowedMethods());
app.use(router.routes());

const server = require("http").createServer(app.callback());
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
    credentials: true
  }
})

io.on("connection", socket => {
  socket.on("message", data => {
    console.log(data)
    io.emit(String(data.resId), data);
  });
});

server.listen(3000, () => {
  console.log("server is listening to http://localhost:3000");
});