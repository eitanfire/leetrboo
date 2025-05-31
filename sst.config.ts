export default {
  app(input) {
    return {
      name: "leetrboo",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    // Define the web application
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

    // Return the outputs to be accessed
    return {
      web: web.url,
    };
  },
};
