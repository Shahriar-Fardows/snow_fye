/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://snowfye.com', // তোমার live site URL
  generateRobotsTxt: true, // robots.txt 
  sitemapSize: 5000,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: [
    '/admin*', // admin page গুলো exclude করতে চাও
    '/api*',   // api routes exclude
  ],
};
