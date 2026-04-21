import { MetadataRoute } from 'next';
import { getAllAuditReports, getAllNews } from '@/lib/strapi';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Static routes
  const routes = [
    '',
    '/about',
    '/functions',
    '/reports',
    '/news',
    '/resources',
    '/opportunities',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic reports
  let reportsSitemap: MetadataRoute.Sitemap = [];
  try {
    const reports = await getAllAuditReports();
    reportsSitemap = (reports?.data || []).map((report) => ({
      url: `${baseUrl}/reports/${report.slug}`,
      lastModified: new Date(report.publishedAt || report.reportDate),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
  } catch (e) {
    console.error('Sitemap: Failed to fetch reports');
  }

  // Dynamic news
  let newsSitemap: MetadataRoute.Sitemap = [];
  try {
    const news = await getAllNews();
    newsSitemap = (news?.data || []).map((article) => ({
      url: `${baseUrl}/news/${article.slug}`,
      lastModified: new Date(article.publishedAt || article.date),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (e) {
    console.error('Sitemap: Failed to fetch news');
  }

  return [...routes, ...reportsSitemap, ...newsSitemap];
}
