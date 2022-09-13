const { createServer } = require('http');
const express = require('express');
const {ApolloServerPluginDrainHttpServer,ApolloServerPluginLandingPageLocalDefault, AuthenticationError,} = require("apollo-server-core");
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');
const { ApolloServer } = require('apollo-server-express');
const {sequelize} = require('./models')
const jwt = require('jsonwebtoken')
require('dotenv').config
const resolvers = require('./graphql/Resolvers')
const typeDefs = require('./graphql/typeDefs');

(async function() {
  const app = express();
  const httpServer = createServer(app);
const contextMiddleware = require('./util/contextMiddleware')

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  });

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});
const findUser = async (authToken) => {
  
    const token = authToken.split('Bearer ')[1]
     const verify = await jwt.verify(token, process.env.TOKEN_SECRET, (err, decodedToken) => {
          if(err){
              console.log('err')
          }
          return decodedToken
      })
      return verify
     
};


const getDynamicContext = async (ctx, msg, args) => {
 if (ctx.connectionParams.Authorization) {
    const currentUser = await findUser(ctx.connectionParams.Authorization);
    return { currentUser };
  }
  // Let the resolvers know we don't have a current user so they can
  // throw the appropriate error
  return { currentUser: null };
};

const serverCleanup = useServer(
  {
    // Our GraphQL schema.
    schema,
     context: (ctx, msg, args) => {
      return getDynamicContext(ctx, msg, args);
    },
  },
  wsServer,
);

const server = new ApolloServer({
    schema,
    context: contextMiddleware,
    csrfPrevention: true,
    cache: "bounded",
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
        {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });

  await server.start();
  server.applyMiddleware({ app })

  const PORT = process.env.PORT || 4000;

httpServer.listen(PORT,()=>{
  console.log(`🚀 Server ready at ${PORT}`);
  sequelize.authenticate()
  .then(()=>{
    console.log('database connected')
  }).catch((err)=>{
    console.log(err)
  })
})
})(typeDefs, resolvers)


