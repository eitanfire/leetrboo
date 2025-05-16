import { StackContext, Api, StaticSite } from "sst/constructs";

export function API({ stack }: StackContext) {
  // Keep any existing API configuration you might have
  const api = new Api(stack, "Api", {
    // Your API configuration here
    // For example:
    // routes: {
    //   "GET /": "functions/lambda.handler",
    // },
  });

  // Add the React static site
  const site = new StaticSite(stack, "ReactSite", {
    path: ".",
    buildCommand: "npm run build",
    buildOutput: "dist",
    // If you use environment variables, uncomment and add them here
    // environment: {
      VITE_SUPABASE_URL: process.env.SUPABASE_URL || "",
      VITE_SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || "",
    //   // If you want to access the API from your React app, you can use:
    //   VITE_API_URL: api.url,
    // },
  });

  // Add outputs
  stack.addOutputs({
    ApiEndpoint: api.url,
    SiteUrl: site.url,
  });

  // Return the resources
  return {
    api,
    site,
  };
}
