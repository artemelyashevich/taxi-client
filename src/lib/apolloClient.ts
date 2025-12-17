import {
    ApolloClient,
    InMemoryCache,
    HttpLink,
    split,
    from,
    ApolloLink
} from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import Cookies from "js-cookie";

const httpLink = new HttpLink({
    uri: "http://localhost:8080/graphql",
});

const authLink = new ApolloLink((operation, forward) => {
    const token = Cookies.get("session_token");

    operation.setContext(({ headers = {} }) => ({
        headers: {
            ...headers,
            ...(token && { authorization: `Bearer ${token}` }),
        }
    }));

    return forward(operation);
});

let wsLink = null;

if (typeof globalThis.window !== "undefined") {
    const wsClient = createClient({
        url: "ws://localhost:8080/subscriptions",
        connectionParams: () => {
            const token = Cookies.get("session_token");
            if (!token) return {};
            return { Authorization: `Bearer ${token}` };
        },
        retryAttempts: 5,
    });

    wsLink = new GraphQLWsLink(wsClient);
}

const splitLink = (typeof globalThis.window !== "undefined" && wsLink)
    ? split(
        ({ query }) => {
            const definition = getMainDefinition(query);
            return (
                definition.kind === "OperationDefinition" &&
                definition.operation === "subscription"
            );
        },
        wsLink,
        from([authLink, httpLink])
    )
    : from([authLink, httpLink]);

export const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
});