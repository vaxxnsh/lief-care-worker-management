import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { schema } from "@/graphql";
import { ApolloServer } from "@apollo/server";
import { NextRequest } from "next/server";
import { createContext } from "@/graphql/context";

const apolloServer = new ApolloServer({ schema });

const handler = startServerAndCreateNextHandler<NextRequest>(
  apolloServer,
  {
    context: createContext,
  }
);

export async function GET(req: NextRequest) {
  return handler(req);
}

export async function POST(req: NextRequest) {
  return handler(req);
}
