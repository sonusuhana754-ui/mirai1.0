import { defineConfig } from "eslint/config";
import nextPlugin from "@next/eslint-plugin-next";

export default defineConfig({
  plugins: { "@next/eslint-plugin-next": nextPlugin },
  extends: ["plugin:@next/eslint-plugin-next/core-web-vitals", "plugin:@next/eslint-plugin-next/recommended"],
  ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
});
