import { ApolloClient, HttpLink } from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "https://main-firefly-29.hasura.app/v1/graphql",
  }),
  // uri: "https://main-firefly-29.hasura.app/v1/graphql",
  // cache: new InMemoryCache(),
});

export default client;
