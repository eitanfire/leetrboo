export default {
  app(input) {
    return {
      name: "leetrboo",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    // Define your web application
    const web = new sst.aws.StaticSite("Web", {
      path: "packages/web",
      build: {
        command: "npm run build",
        output: "dist",
      },
      dev: {
        command: "npm run dev",
      },
    });

    // Return any outputs you want to access
    return {
      web: web.url,
    };
  },
};
