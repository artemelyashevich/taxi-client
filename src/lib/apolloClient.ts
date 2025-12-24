import { ApolloClient, InMemoryCache, HttpLink, from, ApolloLink } from "@apollo/client";
import Cookies from "js-cookie";

const httpLink = new HttpLink({
    uri: "http://localhost:8080/graphql",
});

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

export const client = new ApolloClient({
    link: from([authLink, httpLink]),
    cache: new InMemoryCache(),
});