
import express from "express";
import cors from "cors";
import http from "http";
import path from "path";

import {expressMiddleware} from "@apollo/server/express4";
import { ApolloServer } from "@apollo/server";
import {ApolloServerPluginDrainHttpServer} from "@apollo/server/plugin/drainHttpServer";
import mergedResolvers from "./resolvers/index.js";
import mergedTypeDefs from "./typeDefs/index.js";
import sequelize, { connectDB } from "./database/db.js";

import session from "express-session";
import passport from "passport";
import SequeLizeStore from "connect-session-sequelize";
import { buildContext } from "graphql-passport";
import { configurePassport } from "./passport/passport.config.js";

const app = express();
configurePassport();
app.use(cors({
    credentials:true,
    // origin:['http://localhost:3000']
  }));

app.use(express.json({limit:'50mb'}));
const httpServer = http.createServer(app);

const sesssionStore = SequeLizeStore(session.Store);
const store = new sesssionStore({
    db:sequelize
});

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized: false,
    store:store,
    cookie:{
    //   secure: 'auto',
      httpOnly:true,
      maxAge:1000 * 60 * 60 * 24,
    }
  }));

  app.use(passport.initialize());
  app.use(passport.session());


const server = new ApolloServer({
    typeDefs:mergedTypeDefs,
    resolvers:mergedResolvers,
    plugins:[ApolloServerPluginDrainHttpServer({httpServer})]
});


await server.start();

app.use('/graphql',
expressMiddleware(server,{
  context: async ({ req, res }) => buildContext({ req, res }),
}));

const root = path.resolve();
app.use(express.static(path.join(root, 'dist')));

app.get("*", (req, res) => {
  res.sendFile(path.join(root, 'dist/index.html'));
});

await new Promise((resolve) => httpServer.listen({port:4000},resolve));

console.log('listening on port http://localhost:4000');
await connectDB();