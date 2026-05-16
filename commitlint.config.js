export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "refactor",
        "style",
        "docs",
        "perf",
        "chore",
        "build",
        "ci",
        "test",
        "revert",
      ],
    ],
    "type-case": [0],
    "subject-case": [0],
    "subject-full-stop": [2, "never", "."],
    "header-max-length": [2, "always", 400],
    "body-leading-blank": [2, "always"],
    "footer-leading-blank": [2, "always"],
  },
};
