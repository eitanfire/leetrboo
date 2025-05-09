export default {
  config(_input) {
    return {
      name: "leetrboo",
      region: "us-east-1",
    };
  },
  async stacks(app) {
    const sst = await import("@serverless-stack/resources");

    const site = new sst.StaticSite(app, "Web", {
      path: "packages/web",
      buildCommand: "npm run build",
      buildOutput: "dist",
      customDomain: "leetr.boo",
    });

    app.addOutputs({
      SiteUrl: site.url,
    });
  },
  esbuild: {
    external: ["fsevents", "better-sqlite3", "mysql2", "pg"],
  },
};
