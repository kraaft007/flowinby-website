# Session Flush — FlowinBy-Website (ghost-ssl-cloudflare-fix)

**Date:** 2026-04-14
**Session focus:** Fix Ghost blog login via SSL/Cloudflare configuration and deploy daughter's portfolio website
**Outcome:** Production-Ready — Both flowinby.com and boomer64.com fully operational with HTTPS

---

## Session Summary

This session continued from a previous context where a portfolio website (flowinby.com) was created from PNG design files and deployed to a VPS. The continuation focused on fixing Ghost blog access at boomer64.com. The user couldn't log in due to multiple cascading issues: password forgotten, Ghost 5.x email-based 2FA blocking login without configured mail, session cookies failing due to URL mismatch (localhost vs domain), and finally a redirect loop caused by Cloudflare SSL "Flexible" mode conflicting with the server's HTTPS redirect. Each layer was peeled back systematically until the root cause (Cloudflare SSL mode) was identified and fixed by the user in Cloudflare dashboard.

---

## Domain 1: Itemized Memories

### Realization 1.1: Ghost 5.x staffDeviceVerification blocks login without mail
**Situation:** User entered correct credentials but got "Failed to send email" error.
**Insight:** Ghost 5.x introduced `staffDeviceVerification` which requires email-based 2FA for admin login. Without SMTP configured, login is impossible.
**Evidence:**
```json
"security": {
  "staffDeviceVerification": true
}
```
Error log: `EmailError: Failed to send email. Please check your site configuration and try again.`
**Resolution:** Set `staffDeviceVerification: false` in `/var/lib/ghost/config.production.json` and restart container.
**Principle:** Ghost 5.x requires `staffDeviceVerification: false` in config when mail transport is not configured, or admin login will fail with email send errors.

### Realization 1.2: Ghost URL config must match access domain for session cookies
**Situation:** User successfully authenticated but was immediately redirected back to login page.
**Insight:** Ghost's session cookies are scoped to the domain in the `url` config. If config says `localhost:2368` but user accesses via `boomer64.com`, cookies won't persist.
**Evidence:** Config showed `"url": "http://localhost:2368"` while user accessed `http://boomer64.com/ghost`.
**Resolution:** Changed config to `"url": "https://boomer64.com"` and restarted Ghost container.
**Principle:** Ghost `url` config must exactly match the domain users access, including protocol (http/https), or session cookies will fail silently.

### Realization 1.3: bcrypt password hash corruption via shell escaping
**Situation:** Password reset via sqlite3 UPDATE failed — hash got corrupted.
**Insight:** bcrypt hashes contain `$` characters that get mangled by shell escaping when passed through ssh and docker exec.
**Evidence:** Hash `$2b$10$LYwm...` became `b0.3ikz...` after shell processing — the `$2b$10$` prefix was interpreted as shell variables.
**Resolution:** Write SQL to a file first, then `docker cp` the file into container and execute via `sqlite3 < file.sql`.
**Principle:** When updating bcrypt hashes in SQLite via Docker, write SQL to a file and copy in — never pass `$`-containing strings through shell command chains.

---

## Domain 2: Meta-Process Observations

### Realization 2.1: User frustration at drawn-out debugging — "This is taking forever"
**Situation:** Multiple iterations of hotspot positioning and Ghost debugging across the session.
**Insight:** User explicitly expressed frustration: "Quick please, this is taking forever!" and "trace your thinking to get it right?"
**Evidence:** User messages: "This is brutal", "Quick please", "trace your thinking to get it right?"
**Resolution:** When user signals impatience, pause to reason through the full request flow before executing more attempts.
**Principle:** When debugging takes multiple iterations, stop and trace the complete flow (browser → CDN → nginx → app) before the next attempt — users lose patience with trial-and-error.

### Realization 2.2: User didn't know Cloudflare was involved
**Situation:** After discovering Cloudflare nameservers, user asked "How is cloudflare involved in this? I didn't set that up?"
**Insight:** Infrastructure configured long ago (possibly by another helper or forgotten self-setup) can surprise users. Don't assume they know their own stack.
**Evidence:** `dig boomer64.com NS +short` returned `adrian.ns.cloudflare.com.` and `sterling.ns.cloudflare.com.`
**Resolution:** Explained likely scenarios (self-setup forgotten, previous developer) and helped user recover Cloudflare access via password reset.
**Principle:** When discovering unexpected infrastructure (CDN, proxy, DNS provider), explain its presence and help user recover access rather than assuming they know.

---

## Domain 3: Tool-Struggle Patterns

### Realization 3.1: Redirect loop diagnosis requires full path trace
**Situation:** Safari showed "too many redirects" for boomer64.com/ghost.
**Insight:** The loop was: Browser → Cloudflare (Flexible SSL, connects HTTP) → nginx (redirects HTTP→HTTPS) → Cloudflare → nginx → loop. Multiple redirect sources created invisible loop.
**Evidence:** `curl -IL https://boomer64.com/ghost` showed 50+ consecutive `HTTP/2 301` responses, all from Cloudflare.
**Resolution:** Identified Cloudflare "Flexible" mode as root cause. User changed to "Full (strict)" in Cloudflare dashboard.
**Principle:** Redirect loops behind CDNs require checking CDN SSL mode — "Flexible" mode + server HTTPS redirect = infinite loop.

### Realization 3.2: X-Forwarded-Proto must be hardcoded when behind SSL-terminating proxy
**Situation:** Ghost kept redirecting HTTP→HTTPS even when accessed via HTTPS.
**Insight:** nginx was sending `X-Forwarded-Proto: $scheme` but the proxy connection is always HTTP internally. Ghost saw HTTP, redirected to HTTPS.
**Evidence:** Local test with `-H "X-Forwarded-Proto: https"` returned 200 OK; without header returned 301 redirect.
**Resolution:** Changed nginx config to `proxy_set_header X-Forwarded-Proto https;` (hardcoded, not `$scheme`).
**Principle:** Behind SSL-terminating proxies (nginx, Cloudflare), hardcode `X-Forwarded-Proto: https` — using `$scheme` reflects the internal HTTP connection, not the client's HTTPS.

---

## Domain 4: Project-Specific Lessons

### Realization 4.1: VPS digital-workshop runs multiple sites with distinct SSL needs
**Situation:** flowinby.com and boomer64.com both on same VPS but different SSL paths.
**Insight:** flowinby.com uses direct nginx+certbot SSL. boomer64.com is behind Cloudflare which terminates SSL. Different configs needed.
**Evidence:**
- flowinby.com: `dig` returns VPS IP directly, certbot-managed certs
- boomer64.com: `dig` returns Cloudflare IP `172.64.80.1`, Cloudflare-managed SSL
**Resolution:** Documented that boomer64.com requires Cloudflare "Full (strict)" mode to work with server's Let's Encrypt cert.
**Principle:** When same VPS hosts multiple domains, check each domain's DNS path — direct vs CDN determines SSL configuration approach.

### Realization 4.2: Ghost runs in Docker container ghost-blog on port 2368
**Situation:** Needed to reset Ghost password and modify config.
**Insight:** Ghost is containerized, requiring `docker exec` and `docker cp` for all operations. Config lives at `/var/lib/ghost/config.production.json` inside container.
**Evidence:** `docker ps` showed `ghost-blog` container on `127.0.0.1:2368->2368/tcp`. Database at `/var/lib/ghost/content/data/ghost.db`.
**Resolution:** Used `docker cp` for file transfers, `docker exec` for commands, `docker restart ghost-blog` after config changes.
**Principle:** Ghost on digital-workshop VPS: container `ghost-blog`, config at `/var/lib/ghost/config.production.json`, DB at `/var/lib/ghost/content/data/ghost.db`, restart required after config changes.

---

## Files Created / Modified

- `/etc/nginx/sites-available/boomer64.conf` on VPS — nginx config with SSL and hardcoded X-Forwarded-Proto
- `/var/lib/ghost/config.production.json` in ghost-blog container — URL changed to https://boomer64.com, staffDeviceVerification disabled
- `/var/lib/ghost/content/data/ghost.db` in ghost-blog container — admin password hash reset
- SSL certificates installed at `/etc/letsencrypt/live/boomer64.com/` on VPS

---

**Session Duration:** ~45 minutes (continuation session)
**Status:** ✅ Complete
