# Comparison pages release probes

Run these checks after the approved pull request is merged and the production release completes.

1. Request `/khan-academy-alternative`, `/ixl-alternative`, and `/brilliant-alternative`; each must return HTTP 200.
2. Open each page and confirm its distinct competitor heading, comparison content, and guided-problem links render.
3. Inspect each page's `<link rel="canonical">`; it must exactly match its `https://equathora.com/<slug>` address.
4. Confirm `robots.txt` does not disallow any comparison path and `sitemap.xml` lists each canonical address once.
5. Open `/learn`, follow all three comparison links, and open the homepage's Khan Academy guide link; none may reach a missing page.
6. From each comparison page, open one guided problem and confirm the selected destination survives sign-in after the authentication fix is released.
