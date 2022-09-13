import {ApolloClient, createHttpLink,InMemoryCache, split, ApolloProvider as Provider} from '@apollo/client'
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';


const host = window.location.host

let httpLink = createHttpLink({
  uri: `http://${host}/graphql`,
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});


httpLink = authLink.concat(httpLink)

const wsLink = new GraphQLWsLink(createClient({
  url: `wss://${host}/subscriptions`,
  connectionParams:{
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
}));

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
  });

  export default function ApolloProvider(props){
    return <Provider  client={client} {...props}/>
  }