import pkg from "eslint-config-next";

const nextConfig = pkg.nextJsConfig || (Array.isArray(pkg) ? pkg : [pkg]);

export default [
  ...(Array.isArray(nextConfig) ? nextConfig : [nextConfig]),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "no-console": ["warn", { allow: ["error"] }],
    },
  },
];
