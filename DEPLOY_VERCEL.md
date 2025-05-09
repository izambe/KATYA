# Deploying to Vercel

This document outlines the steps to deploy your static website or frontend application to Vercel.

## Prerequisites

1.  **Vercel Account:** You'll need a Vercel account. You can sign up for free at [vercel.com](https://vercel.com) using your GitHub, GitLab, Bitbucket account, or email.
2.  **Project on a Git Provider:** Your project should ideally be hosted on GitHub, GitLab, or Bitbucket for the easiest integration. Since your project is already on GitHub (`https://github.com/izambe/KATYA`), this is perfect.

## Deployment Steps

1.  **Sign up/Log in to Vercel:**
    Go to [vercel.com](https://vercel.com) and sign up or log in.

2.  **Import Your Project:**
    *   Once logged in, you'll be on your Vercel dashboard.
    *   Click on the "**Add New...**" button and select "**Project**".
    *   Vercel will ask to connect to your Git provider (GitHub in this case). Authorize Vercel to access your repositories if you haven't already.
    *   You should see a list of your GitHub repositories. Find and select your project repository (e.g., `izambe/KATYA`). Click "**Import**".

3.  **Configure Your Project:**
    *   **Project Name:** Vercel will usually suggest a project name based on your repository. You can keep it or change it.
    *   **Framework Preset:** Vercel is very good at auto-detecting frameworks. For a simple static HTML, CSS, and JavaScript site, it should correctly identify it or you might select "Other".
    *   **Root Directory:** Ensure this is set to the directory containing your `index.html` and other site files. If your `index.html` is in the root of your repository, this setting should usually be left as is (`./`).
    *   **Build and Output Settings:**
        *   For a basic static site, you often don't need to change the build command or output directory. Vercel typically handles this automatically.
        *   If you had a build step (e.g., for a React or Vue app), you would configure it here.
    *   **Environment Variables:** If your project needed any environment variables, you could add them here.

4.  **Deploy:**
    *   Click the "**Deploy**" button.
    *   Vercel will start building and deploying your project. You can see the build logs in real-time.

5.  **Access Your Site:**
    *   Once the deployment is complete, Vercel will provide you with one or more URLs (usually ending in `.vercel.app`) where your site is live.
    *   You'll also get a dashboard for this project within Vercel where you can manage deployments, custom domains, and other settings.

## Automatic Deployments (CI/CD)

By default, Vercel sets up automatic deployments. Any time you push new commits to your connected Git branch (usually `main`), Vercel will automatically rebuild and redeploy your site.

## Custom Domains

You can easily add a custom domain to your Vercel project through the project's settings dashboard on Vercel.
