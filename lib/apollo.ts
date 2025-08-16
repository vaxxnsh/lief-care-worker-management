import {ApolloClient, InMemoryCache} from  "@apollo/client"
import { url } from "./config";


const apolloClient = new ApolloClient({
    uri : `${url}api/graphql`,
    cache : new InMemoryCache()
});

export default apolloClient;