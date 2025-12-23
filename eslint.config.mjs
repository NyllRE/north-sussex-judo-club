// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  // Your custom configs here
  config: {
    rules: {
      "no-console": "warn",
      "no-unused-vars": "error",
    },
  },
});
