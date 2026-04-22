import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

const MODEL_TO_TAGS: Record<string, string[]> = {
  home: ['strapi:home'],
  'audit-report': ['strapi:reports'],
  auditReports: ['strapi:reports'],
  news: ['strapi:news'],
  aboutUs: ['strapi:about'],
  function: ['strapi:functions'],
  'contact-setting': ['strapi:contact'],
  resource: ['strapi:resources'],
  opportunity: ['strapi:opportunities'],
};

export async function POST(request: Request) {
  const secret = request.headers.get('x-revalidate-secret');

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid revalidation secret.' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const model = typeof body?.model === 'string' ? body.model : undefined;
    const slug = typeof body?.slug === 'string' ? body.slug : undefined;

    const tags = new Set<string>();

    if (model && MODEL_TO_TAGS[model]) {
      MODEL_TO_TAGS[model].forEach((tag) => tags.add(tag));
    }

    if (model === 'audit-report' && slug) {
      tags.add(`strapi:report:${slug}`);
    }

    if (model === 'news' && slug) {
      tags.add(`strapi:news:${slug}`);
    }

    if (tags.size === 0) {
      tags.add('strapi:home');
      tags.add('strapi:reports');
      tags.add('strapi:news');
      tags.add('strapi:about');
      tags.add('strapi:functions');
      tags.add('strapi:contact');
      tags.add('strapi:resources');
      tags.add('strapi:opportunities');
    }

    tags.forEach((tag) => revalidateTag(tag, 'max'));

    return NextResponse.json({ revalidated: true, tags: Array.from(tags) });
  } catch (error) {
    console.error('Revalidation route error:', error);
    return NextResponse.json({ message: 'Failed to revalidate tags.' }, { status: 500 });
  }
}
