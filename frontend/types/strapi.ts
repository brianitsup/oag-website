export interface StrapiImage {
  id: number;
  documentId: string;
  url: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: any;
}

export interface StatCard {
  id: number;
  label: string;
  value: string;
}

export interface FunctionItem {
  id: number;
  icon: string;
  title: string;
  text: string;
}

export interface HomeType {
  id: number;
  documentId: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage?: StrapiImage;
  stats?: StatCard[];
  featuredReports?: AuditReport[];
  featuredNews?: News[];
}

export interface AboutUsType {
  id: number;
  documentId: string;
  title: string;
  body: any; // richtext
  image?: StrapiImage;
}

export interface FunctionsType {
  id: number;
  documentId: string;
  title: string;
  description: any; // richtext
  functions?: FunctionItem[];
}

export interface ContactSettingType {
  id: number;
  documentId: string;
  address: string;
  phone: string;
  email: string;
  googleMapsEmbedUrl: string;
  logo?: StrapiImage;
}

export interface AuditReport {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  reportDate: string;
  reportType: 'Financial' | 'Performance' | 'Compliance' | 'IT';
  summary: string;
  fullReport?: StrapiImage; // media file
  coverImage?: StrapiImage;
  publishedAt: string;
}

export interface News {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  date: string;
  category: string;
  excerpt: string;
  content: any; // richtext
  featuredImage?: StrapiImage;
  author: string;
  publishedAt: string;
}

export interface Resource {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  file?: StrapiImage; // media file
}

export interface Opportunity {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  type: 'Job' | 'Tender';
  deadline: string;
  description: any; // richtext
  attachment?: StrapiImage; // media file
}

// Responses
export interface StrapiCollectionResponse<T> {
  data: T[];
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiItemResponse<T> {
  data: T;
  meta: any;
}
