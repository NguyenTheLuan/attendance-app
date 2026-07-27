# 🤖 Setting up the AI Code Reviewer (CodeRabbit)

The **Attendance App** project uses **CodeRabbit AI** to automatically review code, catch bugs, and optimize pull requests. It is a highly capable tool that is completely free for personal open-source projects.

---

## 🌟 What is CodeRabbit AI?

CodeRabbit is a GitHub App that seamlessly integrates into your GitHub repository. Whenever a new Pull Request is opened, CodeRabbit will:
1. **Analyze Code:** Understand the code changes deeply.
2. **Detect Bugs:** Identify potential bugs, security flaws, or unoptimized logic.
3. **Provide Inline Feedback:** Comment directly on specific lines of code with actionable suggestions and ready-to-commit code snippets.
4. **Summarize PRs:** Automatically generate human-readable summaries and walkthroughs for the Pull Request.

---

## 🛠️ Installation Steps (Takes 1 Minute)

> **Note:** You do not need to write any GitHub Actions workflow files (`.github/workflows/*.yml`) or provide API Keys. CodeRabbit hosts the AI infrastructure for you automatically.

### Step 1: Visit the GitHub Marketplace
Go to the official CodeRabbit AI installation page on the GitHub Marketplace:
👉 **[CodeRabbit AI GitHub App](https://github.com/apps/coderabbitai)**

### Step 2: Authorize Installation
1. Click the green **Install** button in the top right corner.
2. GitHub will ask you to select the account or organization where you want to install the app. Select your personal account.

### Step 3: Select Repository
On the next screen, you will have two options:
- **All repositories** (Installs on all your repos - Not recommended).
- **Only select repositories** (Installs only on specific repos - Recommended).

Choose **Only select repositories** and check the `attendance-app` repository (e.g., `NguyenTheLuan/attendance-app`).

### Step 4: Complete Setup
1. Click the **Install & Authorize** button.
2. You will be redirected to the CodeRabbit Dashboard. Once you see the message **"All done! 🥕 100%"**, the installation is successfully completed!

---

## 🚀 How to Use It

From now on, the entire code review process is automated:

1. Create a new branch on your local machine.
2. Write your code, commit, and push the branch to GitHub.
3. Open a **Pull Request (PR)** on GitHub to merge your code into the `main` branch.
4. Almost instantly, the **CodeRabbit bot** will jump into your PR, analyze the code, and leave a detailed review comment.
5. You can reply directly to CodeRabbit in the PR comments to ask for further explanations or request specific changes to its suggestions.

Happy Coding! 🎉
