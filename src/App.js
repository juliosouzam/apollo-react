import React from "react";
import "./App.css";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloConsumer } from "react-apollo";
import { InMemoryCache } from "apollo-cache-inmemory";

import Main from "./pages/Main";

const client = new ApolloClient({
  uri: "",
  headers: {
    "x-hasura-admin-secret": ""
  },
  cache: new InMemoryCache()
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <ApolloConsumer>{client => <Main client={client} />}</ApolloConsumer>
    </ApolloProvider>
  );
}
