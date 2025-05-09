# Deploying to GitHub Pages

This document outlines the steps to deploy your static website to GitHub Pages.

## Prerequisites

1.  **Git Installed:** Ensure Git is installed on your system.
2.  **GitHub Account:** You need a GitHub account.
3.  **GitHub Repository:** Your project should be a GitHub repository. If it's not already, you'll need to create one and push your code to it.

## Deployment Steps

1.  **Initialize Git (if not already done):**
    If your project is not yet a Git repository, open your terminal in the project's root directory (`c:/Users/iza/repos/KATYA`) and run:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```

2.  **Create a GitHub Repository:**
    Go to [GitHub](https://github.com) and create a new repository. Do **not** initialize it with a README, .gitignore, or license if you've already initialized Git locally.

3.  **Link Local Repository to GitHub:**
    Copy the commands provided by GitHub after creating the repository. They will look something like this (replace `YOUR_USERNAME` and `YOUR_REPOSITORY_NAME`):
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
    git branch -M main  # Or master, depending on your default branch name
    git push -u origin main # Or master
    ```

4.  **Configure GitHub Pages:**
    *   Go to your repository on GitHub.
    *   Click on the "Settings" tab.
    *   In the left sidebar, click on "Pages" under the "Code and automation" section.
    *   Under "Build and deployment", for the "Source", select "Deploy from a branch".
    *   Under "Branch", select `main` (or `master`, or whichever branch contains your site's code) and the `/ (root)` folder.
    *   Click "Save".

5.  **Access Your Site:**
    After a few minutes, your site should be live at `https://YOUR_USERNAME.github.io/YOUR_REPOSITORY_NAME/`. GitHub Pages will provide the exact URL in the "Pages" settings.

## Troubleshooting

*   **404 Error:**
    *   Ensure your main HTML file is named `index.html` and is in the root of the deployment branch/folder.
    *   Wait a few minutes for GitHub Pages to build and deploy your site.
    *   Check the repository's "Actions" tab for any build errors if you are using a more complex setup (not applicable for simple static sites).
*   **CSS/JS Not Loading:**
    *   Ensure all asset paths (CSS, JavaScript, images) in your HTML are relative and correct. For example, use `css/style.css` instead of `/css/style.css` if `index.html` and the `css` folder are in the root. If your site is deployed to `https://YOUR_USERNAME.github.io/YOUR_REPOSITORY_NAME/`, paths starting with `/` will resolve to `https://YOUR_USERNAME.github.io/` which is incorrect.
    *   If your `index.html` is in the root, paths like `js/app.js` and `css/style.css` should work correctly.
