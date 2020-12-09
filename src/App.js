import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import {
  ApolloProvider,
  ApolloClient,
  HttpLink,
  InMemoryCache,
  split,
} from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/link-ws';
import Home from './components/Home';
import Blog from './components/Blog';
import Blogs from './components/Blogs';
import New from './components/blog/New';
import Edit from './components/blog/Edit';

const GRAPHQL_ENDPOINT = 'hasura-blog.hasura.app/v1/graphql';

const httpLink = new HttpLink({
  uri: `https://${GRAPHQL_ENDPOINT}`,
});

const wsLink = new WebSocketLink({
  uri: `ws://${GRAPHQL_ENDPOINT}`,
  options: {
    reconnect: true,
  },
});

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
  cache: new InMemoryCache(),
  link: splitLink,
});

function App() {
  return (
    <BrowserRouter>
      <ApolloProvider client={client}>
        <Switch>
          <Route exact path="/blog/new" component={New} />
          <Route exact path="/blog/edit/:id" component={Edit} />
          <Route exact path="/blog/:id" component={Blog} />
          <Route exact path="/blog" component={Blogs} />
          <Route exact path="/" component={Home} />
        </Switch>
      </ApolloProvider>
    </BrowserRouter>
  );
}

export default App;
