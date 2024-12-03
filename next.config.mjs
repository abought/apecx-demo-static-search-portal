import STATIC from "./static.json" with { type: "json" };

import mdx from "@next/mdx";

const withMDX = mdx({
  extension: /\.(md|mdx)$/,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactStrictMode: true,
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  /**
   * If the `static.json` file contains a `host` object, use the `base_path` value
   * as the `basePath` for the Next.js application.
   */
  basePath: STATIC._static?.host?.base_path || undefined,
  images: {
    unoptimized: true,
  },
  publicRuntimeConfig: {
    basePath: `${STATIC._static?.host?.base_path || ""}`,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // This is a workaround until search fix:
    //  https://github.com/globus/static-search-portal/pull/250
    ignoreBuildErrors: true,
  },
};

export default withMDX(nextConfig);
