# CMS OAuth proxy

Decap CMS (at `/admin` on the live site) needs to authenticate volunteers
against GitHub before it can open PRs on their behalf. GitHub Pages only
serves static files, so this small Cloudflare Worker handles just the OAuth
handshake — it never sees or stores story content, only exchanges a GitHub
login for an access token in the browser.

These steps require your own GitHub and Cloudflare accounts — I can't do
account creation, OAuth app registration, or secret management on your
behalf. This file documents what to do.

## 1. Create a GitHub OAuth App

In GitHub: **Settings → Developer settings → OAuth Apps → New OAuth App**
(this is at the account or org level, whichever owns `tech-itrace`).

- **Homepage URL**: `https://tech-itrace.github.io/humansofchennai/`
- **Authorization callback URL**: `https://<your-worker-subdomain>.workers.dev/callback`
  (you'll get the exact worker URL after step 2's first deploy — you can
  come back and fill this in once you have it)

Save the generated **Client ID** and **Client Secret**.

## 2. Deploy the worker

From `oauth-proxy/`:

```sh
npm install -g wrangler   # if not already installed
wrangler login             # opens a browser to authenticate with Cloudflare
wrangler deploy
```

This prints the deployed URL, e.g. `https://humansofchennai-cms-auth.<your-subdomain>.workers.dev`.
Go back to the GitHub OAuth App from step 1 and set the callback URL to
`<that-url>/callback` if you hadn't already.

## 3. Set the OAuth app credentials as Worker secrets

```sh
wrangler secret put GITHUB_CLIENT_ID
wrangler secret put GITHUB_CLIENT_SECRET
```

(paste the values from step 1 when prompted)

## 4. Point the CMS at the deployed worker

Edit `public/admin/config.yml` in the main repo and replace:

```yaml
base_url: https://REPLACE-WITH-YOUR-OAUTH-PROXY-DOMAIN
```

with your worker's URL (no trailing slash, no `/callback`), e.g.:

```yaml
base_url: https://humansofchennai-cms-auth.<your-subdomain>.workers.dev
```

Commit and push. Once deployed, `/admin` on the live site will let
contributors log in with GitHub and submit stories as PRs.
