import {ApolloClient, InMemoryCache} from  "@apollo/client"


const apolloClient = new ApolloClient({
    uri : `https://lief-care-worker-management.vercel.app/api/graphql`,
    cache : new InMemoryCache()
});

export default apolloClient;