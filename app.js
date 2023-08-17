const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { expressMiddleware } = require("@apollo/server/express4");
const {
  ApolloServerPluginDrainHttpServer,
} = require("@apollo/server/plugin/drainHttpServer");
const http = require("http");
const cors = require("cors");
const { GraphQLError } = require("graphql");
const session = require("express-session");
const mongoDbStore = require("connect-mongodb-session")(session);
const { typeDefs } = require("./models/typeDefs");
const { resolvers } = require("./resolver");
const {
  isAuthenticated,
  isAuthorized,
  getUser,
} = require("./middlewares/auth");

const app = express();
const httpServer = http.createServer(app);
app.use(express.json());
app.use(function (req, res, next) {
  const allowedOrigins = ['http://localhost:3000', 'https://company-manager-64bf8.web.app'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
       res.setHeader('Access-Control-Allow-Origin', origin);
  }
  // res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

const store = new mongoDbStore({
  uri: "mongodb+srv://alpesh:alpesh@cluster0.ly1e4zw.mongodb.net/engg_works",
  collection: "sessions",
});

app.use(
  session({
    secret: "MySecret",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: { sameSite: 'none', secure: true }
  })
);

// Authentication middleware- checks if a valid JWT and valid user- no error or blocking of request
app.use(isAuthenticated);

// Make user role available in Mongoose Models
app.use(async function (req, res, next) {
  module.exports.currentUser = req.user;
  next();
});

// If not loged in then use login routes
// app.use(async function (req, res, next) {
//   if (!req.authenticated) {
//     const authRouter = require("./routes/AuthRouter");
//     app.use("/auth", authRouter);
//   }
// });
const authRouter = require("./routes/AuthRouter");
app.use("/auth", authRouter);

// if not authenticated, block the request and handle error
app.use(function (req, res, next) {
  if (req.authErr) {
    // any argument passed to next triggers error in express
    next(new Error(req.authErr));
  }
  next();
});

// Authorization middleware- blocks UserType1 but allows UserType2 and UserType3
app.use(isAuthorized);

const appoloServer = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  context: async ({ req }) => {
    const token = req.headers.authorization || "";
    const user = await getUser(token);
    if (!user) {
      throw new GraphQLError("User is not authenticated", {
        extensions: {
          code: "UNAUTHENTICATED",
          http: { status: 401 },
        },
      });
    }
    return { user };
  },
});

const notificationRouter = require("./routes/NotificationRouter");
app.use("/notification", notificationRouter);

async function startServer() {
  await appoloServer.start();
  app.use(
    "/graphql",
    cors({ origin: ['http://localhost:3000', 'https://company-manager-64bf8.web.app'] }),
    express.json(),
    expressMiddleware(appoloServer)
  );
}

startServer();

// startStandaloneServer(appoloServer, {
//   context: async ({ req }) => {
//     const token = req.headers.authorization || "";
//     const user = await getUser(token);
//     if (!user) {
//       throw new GraphQLError("User is not authenticated", {
//         extensions: {
//           code: "UNAUTHENTICATED",
//           http: { status: 401 },
//         },
//       });
//     }
//     return { user };
//   },
//   listen: { port: 5000 },
// }).then(() => {
//   console.log(`🚀  Server ready`);
// });

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  err.status = err.status || "error";

  res.send({
    status: err.status,
    message: "Global Error: " + err.message,
  });
});

module.exports = { app };
