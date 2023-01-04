module.exports = {
  extends: ['../../.eslintrc.cjs'],
  env: {
    'vue/setup-compiler-macros': true,
    node: true,
  },
  overrides: [
    {
      files: ['cypress/integration/**.spec.{js,ts,jsx,tsx}'],
      extends: ['plugin:cypress/recommended'],
    },
  ],
}
