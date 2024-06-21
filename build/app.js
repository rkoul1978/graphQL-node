"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const graphql_tools_1 = require("graphql-tools");
const users_service_1 = require("./users/users.service");
const express_2 = require("graphql-http/lib/use/express");
const app = (0, express_1.default)();
const port = 4000;
mongoose_1.default
    .connect("mongodb://127.0.0.1:27017/reactdb")
    .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
})
    .catch((err) => {
    console.error('Error connecting to mongo', err.reason);
});
let typeDefs = `
  type Query {
    hello: String
  }
     
  type Mutation {
    hello(message: String) : String
  }
`;
let helloMessage = 'World!';
let resolvers = {
    Query: {
        hello: () => helloMessage,
    },
    Mutation: {
        hello: (_, helloData) => {
            helloMessage = helloData.message;
            return helloMessage;
        }
    }
};
let usersService = new users_service_1.UsersService();
typeDefs += usersService.configTypeDefs();
usersService.configResolvers(resolvers);
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.use('/graphql', 
/*  graphqlHTTP({
      schema: makeExecutableSchema({typeDefs, resolvers}),
      graphiql: true  */
(0, express_2.createHandler)({
    schema: (0, graphql_tools_1.makeExecutableSchema)({ typeDefs, resolvers })
}));
app.listen(port, () => console.log(`Node Graphql API listening on port ${port}!`));
