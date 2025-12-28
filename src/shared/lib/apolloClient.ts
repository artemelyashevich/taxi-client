import {
    ApolloClient,
    InMemoryCache,
    HttpLink,
    from,
    ApolloLink,
    split
} from "@apollo/client";
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import Cookies from "js-cookie";

const httpLink = new HttpLink({
    uri: "http://localhost:8080/graphql",
});

const wsLink = new GraphQLWsLink(
    createClient({
        url: "ws://localhost:8080/graphql",
        connectionParams: () => {
            const token = Cookies.get("session_token");
            return {
                headers: {
                    authorization: token ? `Bearer ${token}` : "",
                }
            };
        },
        retryAttempts: 5,
        shouldRetry: () => true,
        on: {
            connected: () => console.log('WebSocket connected'),
            error: (error) => console.error('WebSocket error:', error),
        }
    })
);

const authLink = new ApolloLink((operation, forward) => {
    const token = Cookies.get("session_token");
    operation.setContext(({ headers = {} }) => ({
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }));
    return forward(operation);
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
    from([authLink, httpLink])
);

export const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
});