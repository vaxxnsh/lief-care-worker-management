import type { NextConfig } from "next";
import {PrismaPlugin} from "@prisma/nextjs-monorepo-workaround-plugin"

const nextConfig: NextConfig = {
 devIndicators: false,
 webpack : (config,{isServer}) => {

    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()]
    }

    config.externals = [...(config.externals || []),"@/prisma/generated/prisma"];
 }
};

export default nextConfig;
