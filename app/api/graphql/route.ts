import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { schema } from "@/graphql";
import { ApolloServer } from "@apollo/server";
import { NextRequest } from "next/server";
import { createContext } from "@/graphql/context";

const apolloServer = new ApolloServer({ schema });

const handler = startServerAndCreateNextHandler<NextRequest>(
    apolloServer,
    {
        context : createContext,
    }
);

export { handler as GET, handler as POST };