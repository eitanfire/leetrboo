import { StackContext, StaticSite } from "sst/constructs";

export function Web({ stack }: StackContext) {
  const site = new StaticSite(stack, "Web", {
    path: "packages/web",
    buildCommand: "npm run build",
    buildOutput: "dist",
    customDomain: "leetr.boo",
  });

  stack.addOutputs({
    SiteUrl: site.url,
  });
}
