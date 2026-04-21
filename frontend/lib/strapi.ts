/**
 * Reusable fetch utility for Strapi REST API
 */
import { 
  StrapiCollectionResponse, 
  StrapiItemResponse, 
  HomeType, 
  AuditReport, 
  News,
  AboutUsType,
  FunctionsType,
  ContactSettingType,
  Resource,
  Opportunity
} from '@/types/strapi';

import qs from 'qs';

export function getStrapiURL(path = '') {
  return `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337'}${path}`;
}

export async function fetchAPI<T>(
  path: string,
  urlParamsObject: Record<string, any> = {},
  options: RequestInit = {}
): Promise<T> {
  try {
    // Default options using Next.js caching strategy
    const mergedOptions: RequestInit = {
      next: { revalidate: 60 },
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    if (process.env.STRAPI_API_TOKEN) {
      mergedOptions.headers = {
        ...mergedOptions.headers,
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      };
    }

    const queryString = qs.stringify(urlParamsObject, {
      encodeValuesOnly: true, // prettify URL
    });

    const requestUrl = `${getStrapiURL(`/api${path}${queryString ? `?${queryString}` : ''}`)}`;

    const response = await fetch(requestUrl, mergedOptions);

    if (!response.ok) {
      console.error(response.statusText);
      throw new Error(`An error occurred please try again: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('FetchAPI Error:', error);
    throw new Error('Please check if your Strapi server is running and accessible.');
  }
}

// API Methods

export async function getHomeData(): Promise<HomeType | null> {
  try {
    const res = await fetchAPI<StrapiItemResponse<HomeType>>('/home', {
      populate: {
        heroImage: true,
        stats: true,
        featuredReports: { populate: '*' },
        featuredNews: { populate: '*' }
      }
    });
    return res.data;
  } catch (error) {
    console.error('Error fetching Home data:', error);
    return null;
  }
}

export async function getAllAuditReports(params = {}): Promise<StrapiCollectionResponse<AuditReport>> {
  return fetchAPI<StrapiCollectionResponse<AuditReport>>('/audit-reports', {
    populate: '*',
    sort: 'reportDate:desc',
    ...params
  });
}

export async function getAuditReportBySlug(slug: string): Promise<AuditReport | null> {
  const res = await fetchAPI<StrapiCollectionResponse<AuditReport>>('/audit-reports', {
    filters: { slug: { $eq: slug } },
    populate: '*'
  });
  return res.data?.[0] || null;
}

export async function getAllNews(params = {}): Promise<StrapiCollectionResponse<News>> {
  return fetchAPI<StrapiCollectionResponse<News>>('/newss', {
    populate: '*',
    sort: 'date:desc',
    ...params
  });
}

export async function getNewsBySlug(slug: string): Promise<News | null> {
  const res = await fetchAPI<StrapiCollectionResponse<News>>('/newss', {
    filters: { slug: { $eq: slug } },
    populate: '*'
  });
  return res.data?.[0] || null;
}

export async function getAboutUsData(): Promise<AboutUsType | null> {
  const res = await fetchAPI<StrapiItemResponse<AboutUsType>>('/about-us', { populate: '*' }).catch(() => null);
  return res?.data || null;
}

export async function getFunctionsData(): Promise<FunctionsType | null> {
  const res = await fetchAPI<StrapiItemResponse<FunctionsType>>('/function', { populate: '*' }).catch(() => null);
  return res?.data || null;
}

export async function getContactSettings(): Promise<ContactSettingType | null> {
  const res = await fetchAPI<StrapiItemResponse<ContactSettingType>>('/contact-setting', { populate: '*' }).catch(() => null);
  return res?.data || null;
}

export async function getResources(params = {}): Promise<StrapiCollectionResponse<Resource>> {
  return fetchAPI<StrapiCollectionResponse<Resource>>('/resources', { populate: '*', ...params });
}

export async function getOpportunities(params = {}): Promise<StrapiCollectionResponse<Opportunity>> {
  return fetchAPI<StrapiCollectionResponse<Opportunity>>('/opportunitys', { populate: '*', sort: 'deadline:desc', ...params });
}
