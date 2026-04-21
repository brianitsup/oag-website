/**
 * Utility for mapping Strapi SEO data to Next.js Metadata
 */
import { Metadata } from 'next';
import { getStrapiURL } from './strapi';

export function getStrapiMedia(url: string | null | undefined) {
  if (url == null) {
    return null;
  }

  // Return the full URL if it's external
  if (url.startsWith('http') || url.startsWith('//')) {
    return url;
  }

  // Prepend Strapi URL
  return `${getStrapiURL()}${url}`;
}

export function generateMetadataFromStrapi(
  seoData: any,
  fallbackTitle = 'Office of the Auditor General',
  fallbackDescription = 'Official website for the Office of the Auditor General'
): Metadata {
  if (!seoData) {
    return {
      title: fallbackTitle,
      description: fallbackDescription,
    };
  }

  const title = seoData.metaTitle || fallbackTitle;
  const description = seoData.metaDescription || fallbackDescription;
  
  let ogImages = [];
  if (seoData.shareImage?.url) {
    ogImages.push({
      url: getStrapiMedia(seoData.shareImage.url) as string,
      alt: seoData.shareImage.alternativeText || title,
    });
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ogImages.length > 0 ? ogImages : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImages.length > 0 ? ogImages : undefined,
    },
  };
}
