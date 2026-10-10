import tseslint from "typescript-eslint";

export default tseslint.config(
  ...tseslint.configs.recommended,
  {
    ignores: [".next/**", ".next-dev/**", "node_modules/**", "next-env.d.ts", "scratch/**"],
  },
);
