const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
const { rateLimit } = require("express-rate-limit");
const { connectToDb } = require("./utils/database");
require("dotenv").config();
const authRoute = require("./routes/authRoutes");
const usersRoute = require("./routes/usersRoutes");
const productsRoute = require("./routes/productRoutes");
const basketsRoute = require("./routes/basketRoutes");
const port = 3000;
const cluster = require("cluster");
const os = require("os");

//----------------------------------------------------------------------------
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
  })
);
connectToDb();

const limiter = rateLimit({
  limit: 100,
  headers: true,
});

//Routes-------------
app.use("/auth", authRoute);
app.use("/users", usersRoute);
app.use("/products", productsRoute);
app.use("/baskets", basketsRoute);
// -------------------------

app.use(limiter);

if (cluster.isMaster) {
  const CPUs = os.cpus().length;
  for (let i = 0; i < CPUs; i++) {
    cluster.fork();
  }
} else {
  app.listen(port, () => {
    console.log(`worker process ${process.pid} is listening on port 3000`);
  });
}
