import { SSTConfig } from "sst";

const config: SSTConfig = {
  config(input) {
    return {
      name: "leetrboo",
      region: "us-east-1",
      removal: input.stage === "production" ? "retain" : "remove",
    };
  },
  stacks(app) {
    // Define your stacks here
    // For example:
    // app.stack(MyStack);
  },
  // If you're using NextJS or other bundled constructs, you might need:
  // workspaces: ["packages/*"],
};

export default config;
