const fs = require('fs');
const path = require('path');

const baseUrl = 'https://www.yevheniifit.com';

const staticPages = [
  '',
  'legal',
  'legal/terms-conditions',
  'legal/privacy',
  'about',
  'programs',
  'programs/4-weeks-mass-builder',
  'programs/bye-bye-belly-fat',
  'programs/the-fuel-plan',
  'programs/30-day-body-transformation',
  'programs/strong-and-slim-glute-core-sculpt',
];

function generateSitemap() {
  const lastmod = new Date().toISOString();
  const urls = staticPages.map((page) => {
    const loc = page ? `${baseUrl}/${page}` : baseUrl;
    return `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(__dirname, 'public', 'sitemap.xml'), sitemap);
  console.log('Sitemap generated!');
}

generateSitemap();
