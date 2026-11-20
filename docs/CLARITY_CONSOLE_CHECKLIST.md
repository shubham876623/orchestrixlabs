# Microsoft Clarity console checklist (manual)

Project ID: `zg04s48gdr`  
Site: `https://orchestrixlabs.com`

These settings are **not** fully controllable from application code. Configure them in the Clarity portal before production traffic relies on session replay.

## Required URL exclusions

Exclude private / administrative routes so Clarity does not record them even if a client-side race occurs:

| Pattern | Notes |
|---|---|
| `/dashboard` | Legacy ops dashboard |
| `/dashboard/*` | Nested dashboard paths (if wildcard supported) |
| `/staff` | Editorial / staff dashboard |
| `/staff/*` | Nested staff paths |
| `/admin` | Reserved admin prefix (defense in depth) |
| `/admin/*` | Nested admin paths if added later |

If the Clarity UI only accepts exact paths or path prefixes, add every known admin path under `/dashboard` and `/staff`.

## Privacy-preserving settings (confirm)

- **Masking:** Strict (already selected — keep)
- **Bot detection:** On
- **Cookies:** On (with site consent gating; Clarity only loads after opt-in)
- **Google Analytics / Microsoft Ads / Google Ads integrations:** Not connected — keep disconnected
- **Do not** install GTM/GA4 for this site as part of Clarity hardening

## Query parameter masking (console)

Align console masking with application-sensitive keys:

`token`, `access_token`, `code`, `email`, `session`, `auth`, `key`

Application portfolio filters (`category`, `q`, `depth`) are not credentials; do not add them unless product/legal review requires it.

## Consent Mode

Clarity consent is handled in site JavaScript via `clarity('consentv2', { ad_Storage, analytics_Storage })`.  
Do **not** claim a separate Clarity console “Consent Mode” toggle is enabled unless the portal shows and documents that control for this project.

## Known residual limitation (do not over-claim)

Live Playwright tests observed `POST https://{g|i|r}.clarity.ms/collect` **ping/beacon** requests (hundreds–thousands of bytes) during:

- public → `/dashboard` transition (before the private document settles)
- consent withdrawal teardown (before reload settles)

After the private document loads, and after withdraw reload settles, **no further Clarity activity** was observed. In-flight browser beacons cannot be reliably aborted from JavaScript. Treat absolute “zero bytes after click” as **not guaranteed**; rely on full-document admin isolation + console URL exclusions + post-settle cleanliness.

## Retention cleanup (first-party, not Clarity)

First-party `PageView` retention is configured as `ANALYTICS_PAGEVIEW_RETENTION_DAYS=90`.

Schedule (ops, after approval):

```bash
python manage.py purge_expired_pageviews --dry-run
python manage.py purge_expired_pageviews
```

Do not run destructive purge against production without separate approval.
