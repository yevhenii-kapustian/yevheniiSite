const fs = require('fs');
const path = require('path');
const slugify = require('slugify');
const { createClient } = require('@supabase/supabase-js');

// `npm run build` runs this as a plain node script, before `next build` —
// Next's automatic .env.local loading doesn't apply here, so read it
// manually. On Vercel these are already real env vars, so this is a no-op there.
try {
  const envPath = path.join(__dirname, '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach((line) => {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        if (!process.env[key]) process.env[key] = value;
      }
    });
  }
} catch (error) {
  console.log('Could not read .env.local, continuing without it:', error.message);
}

const baseUrl = 'https://www.yevheniifit.com';

const staticPages = [
  '',
  'legal/terms-conditions',
  'legal/privacy',
  'about',
  'programs',
  'get-started',
];

async function getProgramPages() {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.log('Supabase env vars missing, skipping dynamic program pages in sitemap.');
    return [];
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data, error } = await supabase.from('products').select('name');
    if (error || !data) throw error || new Error('No data returned');

    return data.map((item) => `programs/${slugify(item.name, { lower: true, strict: true })}`);
  } catch (error) {
    console.log('Could not fetch products for sitemap, continuing without them:', error.message);
    return [];
  }
}

async function generateSitemap() {
  const programPages = await getProgramPages();
  const pages = [...staticPages, ...programPages];
  const lastmod = new Date().toISOString();

  const urls = pages.map((page) => {
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
