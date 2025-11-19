import React from "react";
import Routes from "./routes";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { HttpLink } from "@apollo/client";

const client = new ApolloClient({
    link: new HttpLink({
        // uri: "http://10.250.67.201:4000/graphql", // <-- gsu-sce 220
        // uri: "http://10.250.69.63:4000/graphql", // <-- gsu-sce 315
        uri: "http://172.16.7.181:4000/graphql", // <-- reflections
        credentials: "include",
    }),
    cache: new InMemoryCache(),
});

export default function Index() {
    return (
        <ApolloProvider client={client}>
            <Routes />
        </ApolloProvider>
    );
}
