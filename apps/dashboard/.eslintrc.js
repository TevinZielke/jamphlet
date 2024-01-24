/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@jamphlet/eslint-config/next.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "no-undef": "off",
      },
    },
  ],
};
