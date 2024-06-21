import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import graphqlHTTP from 'express-graphql';
import {makeExecutableSchema} from 'graphql-tools';
import { UsersService } from './users/users.service';
import { createHandler } from 'graphql-http/lib/use/express';
import { buildSchema } from 'graphql'

const app: express.Application = express();

const port = 4000;

mongoose
  .connect("mongodb://127.0.0.1:27017/reactdb")
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch((err) => {
    console.error('Error connecting to mongo', err.reason)
  }) 

let typeDefs: any = `
  type Query {
    hello: String
  }
     
  type Mutation {
    hello(message: String) : String
  }
`;

let helloMessage: String = 'World!';

let resolvers = {
    Query: {
        hello: () => helloMessage,
    },
    Mutation: {
        hello: (_: any, helloData: any) => {
            helloMessage = helloData.message;
            return helloMessage;
        }
    }
};

let usersService = new UsersService();
typeDefs += usersService.configTypeDefs();
usersService.configResolvers(resolvers);

app.use(bodyParser.json());
app.use(cors());

app.use(
    '/graphql',
  /*  graphqlHTTP({
        schema: makeExecutableSchema({typeDefs, resolvers}),
        graphiql: true  */
        createHandler({
          schema: makeExecutableSchema({typeDefs, resolvers})
      }) 
);

app.listen(port, () => console.log(`Node Graphql API listening on port ${port}!`));