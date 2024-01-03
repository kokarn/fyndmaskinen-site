// Build a sitemap and place it in public folder

const fs = require('fs');
const path = require('path');

const sitemapTemplate = fs.readFileSync(path.join(__dirname, '..', 'assets', 'sitemap.xml'), 'utf8');

// Replace all the __LAST_MOD__ with the current date
const sitemap = sitemapTemplate.replace(
    /__LAST_MOD__/ug,
    new Date().toISOString(),
);

fs.writeFileSync(path.join(__dirname, '..', 'public', 'sitemap.xml'), sitemap);