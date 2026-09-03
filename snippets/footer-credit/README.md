# Footer credit

A small "Site by Searchbar Studio" line to add to the footer of client sites.
Every client site quietly links back to searchbarstudio.com, which pairs with
the contact form's "I saw a website you built" option as a passive referral
channel.

This folder is the **canonical source**. Tweak it here, then re-paste to client
sites so they stay consistent. Always get the client's OK on placement before
adding it.

## Design

- Text only, phrasing: "Site by Searchbar Studio".
- Placement: a centered line at the very bottom of the footer, below the
  client's own copyright.
- The studio coral (`#c1592f`) on the linked name is fixed; the "Site by"
  text adapts to light vs dark footers rather than shipping two versions:
  - `footer-credit.html` **inherits the footer's own text color**, so it works
    on a light or dark footer automatically. It must be pasted *inside* the
    footer element to inherit. Want it muted instead of matching the footer
    text? Add `color:#9a8c7b` (light) or `#b9ada0` (dark) to the `<p>`.
  - `footer-credit.php` renders *outside* the footer (via `wp_footer`), so it
    can't inherit. It uses an explicit color, default tuned for a light
    footer; swap to `#b9ada0` for a dark one.
- Fully inline styles so it needs no external CSS.

## Files

- `footer-credit.html` — universal raw HTML. Use for static sites, embeds, and
  WordPress "Custom HTML" blocks (Site Editor footer or a footer widget).
- `footer-credit.php` — WordPress, update-safe. Hooks `wp_footer`. Paste into
  `functions.php`, or (better) save as
  `wp-content/mu-plugins/searchbar-credit.php` so it survives theme updates.

## How to add it

**Static site:** paste the `<p>` from `footer-credit.html` at the bottom of the
footer.

**WordPress, block/Site Editor theme:** Appearance → Editor → the footer
template part → add a Custom HTML block → paste `footer-credit.html`.

**WordPress, classic theme:** use `footer-credit.php` (mu-plugin preferred over
`functions.php` so it isn't lost on theme updates).

## Options

- **Track which site referred:** append a tag to the link, e.g.
  `https://searchbarstudio.com/?ref=brightblooms`. Then analytics show which
  client site sent a visitor.
- **Hover underline** (only where you can add CSS): give the link a class and
  add

  ```css
  .sbs-credit a { text-decoration: none; }
  .sbs-credit a:hover { text-decoration: underline; }
  ```
