declare module '@prisma/nextjs-monorepo-workaround-plugin' {
  import webpack from 'webpack';

  export class PrismaPlugin implements webpack.WebpackPluginInstance {
    apply(compiler: webpack.Compiler): void;
  }
}
