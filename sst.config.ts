/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "leetrboo",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {new sst.aws.StaticSite("Web", {
    path: 'packages/web',
    build: {
      command: "yarn run build",
      output: "dist",
    },
  });},
});
 