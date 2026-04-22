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
  Opportunity,
} from '@/types/strapi';

import qs from 'qs';

const DEFAULT_REVALIDATE_SECONDS = 60;
const DEFAULT_FETCH_TIMEOUT_MS = Number(process.env.STRAPI_FETCH_TIMEOUT_MS || 10000);
const DEFAULT_FETCH_RETRIES = Number(process.env.STRAPI_FETCH_RETRIES || 2);
const DEFAULT_FETCH_RETRY_BACKOFF_MS = Number(process.env.STRAPI_FETCH_RETRY_BACKOFF_MS || 300);

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function shouldRetryStatus(status: number) {
  return status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
}

function resolveStrapiBaseURL(serverSide = false) {
  const baseUrl =
    (serverSide && process.env.STRAPI_URL) ||
    process.env.NEXT_PUBLIC_STRAPI_URL ||
    'http://127.0.0.1:1337';

  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
}

export function getStrapiURL(path = '') {
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('//')) {
    return path;
  }

  return `${resolveStrapiBaseURL(false)}${path}`;
}

function getStrapiAPIURL(path: string, queryString = '') {
  return `${resolveStrapiBaseURL(true)}/api${path}${queryString ? `?${queryString}` : ''}`;
}

export async function fetchAPI<T>(
  path: string,
  urlParamsObject: Record<string, unknown> = {},
  options: RequestInit = {}
): Promise<T> {
  const queryString = qs.stringify(urlParamsObject, {
    encodeValuesOnly: true,
  });

  const requestUrl = getStrapiAPIURL(path, queryString);

  const headers = new Headers({
    'Content-Type': 'application/json',
  });

  if (process.env.STRAPI_API_TOKEN) {
    headers.set('Authorization', `Bearer ${process.env.STRAPI_API_TOKEN}`);
  }

  if (options.headers) {
    const incomingHeaders = new Headers(options.headers);
    incomingHeaders.forEach((value, key) => {
      headers.set(key, value);
    });
  }

  const mergedOptions: RequestInit = {
    next: { revalidate: DEFAULT_REVALIDATE_SECONDS },
    ...options,
    headers,
  };

  let lastError: unknown;

  for (let attempt = 0; attempt <= DEFAULT_FETCH_RETRIES; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), DEFAULT_FETCH_TIMEOUT_MS);

    try {
      const response = await fetch(requestUrl, {
        ...mergedOptions,
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        const message = `[Strapi] ${response.status} ${response.statusText} - ${requestUrl}${
          errorText ? ` - ${errorText}` : ''
        }`;

        if (attempt < DEFAULT_FETCH_RETRIES && shouldRetryStatus(response.status)) {
          const delay = DEFAULT_FETCH_RETRY_BACKOFF_MS * Math.pow(2, attempt);
          console.warn(`${message} (retry ${attempt + 1}/${DEFAULT_FETCH_RETRIES} in ${delay}ms)`);
          await sleep(delay);
          continue;
        }

        throw new Error(message);
      }

      return (await response.json()) as T;
    } catch (error: unknown) {
      lastError = error;

      const isAbort = error?.name === 'AbortError';
      const isNetworkError = error instanceof TypeError;
      const canRetry = attempt < DEFAULT_FETCH_RETRIES && (isAbort || isNetworkError);

      if (canRetry) {
        const delay = DEFAULT_FETCH_RETRY_BACKOFF_MS * Math.pow(2, attempt);
        console.warn(
          `[Strapi] Request failed (${isAbort ? 'timeout' : 'network'}) - ${requestUrl} (retry ${
            attempt + 1
          }/${DEFAULT_FETCH_RETRIES} in ${delay}ms)`
        );
        await sleep(delay);
        continue;
      }

      break;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  console.error('[Strapi] FetchAPI Error:', {
    url: requestUrl,
    error: lastError,
  });

  throw new Error('Unable to fetch content from Strapi at the moment.');
}

// API Methods

export async function getHomeData(): Promise<HomeType | null> {
  try {
    const res = await fetchAPI<StrapiItemResponse<HomeType>>('/home', {
      populate: {
        heroImage: true,
        stats: true,
        featuredReports: { populate: '*' },
        featuredNews: { populate: '*' },
      },
    });
    return res.data;
  } catch (error) {
    console.error('Error fetching Home data:', error);
    return null;
  }
}

export async function getAllAuditReports(params = {}): Promise<StrapiCollectionResponse<AuditReport>> {
  try {
    return await fetchAPI<StrapiCollectionResponse<AuditReport>>('/audit-reports', {
      populate: '*',
      sort: 'reportDate:desc',
      ...params,
    });
  } catch (error) {
    return { data: [], meta: { pagination: { page: 1, pageSize: 10, pageCount: 0, total: 0 } } };
  }
}

export async function getAuditReportBySlug(slug: string): Promise<AuditReport | null> {
  try {
    const res = await fetchAPI<StrapiCollectionResponse<AuditReport>>('/audit-reports', {
      filters: { slug: { $eq: slug } },
      populate: '*',
    });
    return res.data?.[0] || null;
  } catch (error) {
    return null;
  }
}

export async function getAllNews(params = {}): Promise<StrapiCollectionResponse<News>> {
  try {
    return await fetchAPI<StrapiCollectionResponse<News>>('/newss', {
      populate: '*',
      sort: 'date:desc',
      ...params,
    });
  } catch (error) {
    return { data: [], meta: { pagination: { page: 1, pageSize: 10, pageCount: 0, total: 0 } } };
  }
}

export async function getNewsBySlug(slug: string): Promise<News | null> {
  try {
    const res = await fetchAPI<StrapiCollectionResponse<News>>('/newss', {
      filters: { slug: { $eq: slug } },
      populate: '*',
    });
    return res.data?.[0] || null;
  } catch (error) {
    return null;
  }
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
  try {
    return await fetchAPI<StrapiCollectionResponse<Resource>>('/resources', { populate: '*', ...params });
  } catch (error) {
    return { data: [], meta: { pagination: { page: 1, pageSize: 10, pageCount: 0, total: 0 } } };
  }
}

export async function getOpportunities(params = {}): Promise<StrapiCollectionResponse<Opportunity>> {
  try {
    return await fetchAPI<StrapiCollectionResponse<Opportunity>>('/opportunitys', {
      populate: '*',
      sort: 'deadline:desc',
      ...params,
    });
  } catch (error) {
    return { data: [], meta: { pagination: { page: 1, pageSize: 10, pageCount: 0, total: 0 } } };
  }
}
