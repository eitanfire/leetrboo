///< reference path="./.sst/platform/config.d.ts" />
import * as sst from "@serverless-stack/resources";

export default $config({
  app(input) {
    return {
      name: "leetrboo",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    // Generate a unique suffix for CloudFront function
    const stage = process.env.SST_STAGE || "dev";
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const uniqueSuffix = `-${stage}-${timestamp}`;

    const site = new sst.StaticSite(this, "Web", {
      path: "packages/web",
      buildCommand: "npm run build",
      buildOutput: "dist",
      customDomain: "leetr.boo",
    });
  },
});
function $config(config: { app(input: any): { name: string; removal: string; home: string; }; run(): Promise<void>; }) {
  const appConfig = config.app({ stage: process.env.SST_STAGE });
  console.log("App Configuration:", appConfig);

  config.run().catch((err) => {
    console.error("Error during run execution:", err);
  });

  return appConfig;
}

