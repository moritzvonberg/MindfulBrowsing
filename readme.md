### Mindful Browsing

Please note that this extension was hacked together over the course of 2-3 days.

Mindful browsing is a chrome extension to give you time to actually think if you want to visit the website you are navigating to to avoid wasting time on sites like reddit and youtube out of habit.

User settings are synced across devices, though I haven't tested it across different devices yet.

It works by delaying web requests to user-blacklisted sites by  redirecting them to a custom waiting page and then redirecting back to the original URL after a waiting period. The delay before you are redirected back to the blacklisted website as well as the time before you are forced to wait again are configurable in the settings.

Features I plan to add are:

- [] A better UI for adding blacklisted sites
- [] More configuration options for the delay (s.a. an increasing delay if you visit a site several times)
- [] A list of allowed URLs in blacklisted sites that don't trigger the delay/redirect (for example for productive subreddits)
- anything else I come up with
