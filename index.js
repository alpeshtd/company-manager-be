// const express = require("express");
// const { ApolloServer } = require("@apollo/server");
// const { startStandaloneServer } = require("@apollo/server/standalone");
// const { typeDefs } = require("./models/typeDefs");
// const { resolvers } = require("./resolver");
const mongoose = require("mongoose");
const { app } = require("./app");

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  process.exit(1);
});


mongoose.connect(
  "mongodb+srv://alpesh:alpesh@cluster0.ly1e4zw.mongodb.net/engg_works?retryWrites=true&w=majority"
);

mongoose.connection.once("open", () => {
  console.log("connected to database");
});
const PORT = process.env.PORT || 4000;
const httpServer = app.listen(PORT, () => {
  console.log("Listening on port" + process.env.PORT);
});

const io = require("./socket").init(httpServer);

io.on("connection", (socket) => {
  console.log("a user connected");
});

process.on("unhandledRejection", (err) => {
  console.log(err);
  httpServer.close(() => {
    process.exit(1);
  });
});

// const app = express();

// const mongoose = require("mongoose");

// mongoose.connect(
//   "mongodb+srv://alpesh:alpesh@cluster0.ly1e4zw.mongodb.net/engg_works?retryWrites=true&w=majority"
// );

// mongoose.connection.once("open", () => {
//   console.log("connected to database");
//   const httpServer = app.listen(4000, () => {
//     console.log("Listening on port 4000");
//   });

//   const io = require("./socket").init(httpServer);

//   io.on("connection", (socket) => {
//     console.log("a user connected");
//   });
// });

// const appoloServer = new ApolloServer({
//   typeDefs,
//   resolvers,
// });

// const notificationRouter = require("./routes/NotificationRouter");
// app.use("/notification", notificationRouter);

// startStandaloneServer(appoloServer, {
//   listen: { port: 5000 },
// }).then(() => {
//   console.log(`🚀  Server ready`);
// });
