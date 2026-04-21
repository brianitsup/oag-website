const fs = require('fs');
const path = require('path');

const models = [
  // Single Types
  {
    name: 'home',
    kind: 'singleType',
    attributes: {
      heroTitle: { type: 'string' },
      heroSubtitle: { type: 'text' },
      heroImage: { type: 'media', multiple: false, allowedTypes: ['images'] },
      stats: { type: 'component', repeatable: true, component: 'shared.stat-card' },
      featuredReports: { type: 'relation', relation: 'oneToMany', target: 'api::audit-report.audit-report' },
      featuredNews: { type: 'relation', relation: 'oneToMany', target: 'api::news.news' }
    }
  },
  {
    name: 'about-us',
    kind: 'singleType',
    attributes: {
      title: { type: 'string' },
      body: { type: 'richtext' },
      image: { type: 'media', multiple: false, allowedTypes: ['images'] }
    }
  },
  {
    name: 'function',
    kind: 'singleType',
    attributes: {
      title: { type: 'string' },
      description: { type: 'richtext' },
      functions: { type: 'component', repeatable: true, component: 'shared.function-item' }
    }
  },
  {
    name: 'contact-setting',
    kind: 'singleType',
    attributes: {
      address: { type: 'text' },
      phone: { type: 'string' },
      email: { type: 'string' },
      googleMapsEmbedUrl: { type: 'text' }
    }
  },
  // Collection Types
  {
    name: 'audit-report',
    kind: 'collectionType',
    attributes: {
      title: { type: 'string' },
      slug: { type: 'uid', targetField: 'title' },
      reportDate: { type: 'date' },
      reportType: { type: 'enumeration', enum: ['Financial', 'Performance', 'Compliance', 'IT'] },
      summary: { type: 'text' },
      fullReport: { type: 'media', multiple: false, allowedTypes: ['files'] },
      coverImage: { type: 'media', multiple: false, allowedTypes: ['images'] },
      publishedAt: { type: 'datetime' }
    }
  },
  {
    name: 'news',
    kind: 'collectionType',
    attributes: {
      title: { type: 'string' },
      slug: { type: 'uid', targetField: 'title' },
      date: { type: 'date' },
      category: { type: 'string' },
      excerpt: { type: 'text' },
      content: { type: 'richtext' },
      featuredImage: { type: 'media', multiple: false, allowedTypes: ['images'] },
      author: { type: 'string' }
    }
  },
  {
    name: 'resource',
    kind: 'collectionType',
    attributes: {
      title: { type: 'string' },
      slug: { type: 'uid', targetField: 'title' },
      category: { type: 'string' },
      description: { type: 'text' },
      file: { type: 'media', multiple: false, allowedTypes: ['files'] }
    }
  },
  {
    name: 'opportunity',
    kind: 'collectionType',
    attributes: {
      title: { type: 'string' },
      slug: { type: 'uid', targetField: 'title' },
      type: { type: 'enumeration', enum: ['Job', 'Tender'] },
      deadline: { type: 'datetime' },
      description: { type: 'richtext' },
      attachment: { type: 'media', multiple: false, allowedTypes: ['files'] }
    }
  }
];

models.forEach(model => {
  const dir = path.join(__dirname, 'src', 'api', model.name);
  fs.mkdirSync(path.join(dir, 'content-types', model.name), { recursive: true });
  fs.mkdirSync(path.join(dir, 'controllers'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'routes'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'services'), { recursive: true });

  // Schema
  const schema = {
    kind: model.kind,
    collectionName: model.name.replace('-', '_') + 's',
    info: {
      singularName: model.name,
      pluralName: model.name + 's',
      displayName: model.name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    },
    options: { draftAndPublish: true },
    attributes: model.attributes
  };
  fs.writeFileSync(path.join(dir, 'content-types', model.name, 'schema.json'), JSON.stringify(schema, null, 2));

  // Controller
  const ctrlContent = `import { factories } from '@strapi/strapi';\nexport default factories.createCoreController('api::${model.name}.${model.name}');`;
  fs.writeFileSync(path.join(dir, 'controllers', model.name + '.ts'), ctrlContent);

  // Route
  const routeContent = `import { factories } from '@strapi/strapi';\nexport default factories.createCoreRouter('api::${model.name}.${model.name}');`;
  fs.writeFileSync(path.join(dir, 'routes', model.name + '.ts'), routeContent);

  // Service
  const srvContent = `import { factories } from '@strapi/strapi';\nexport default factories.createCoreService('api::${model.name}.${model.name}');`;
  fs.writeFileSync(path.join(dir, 'services', model.name + '.ts'), srvContent);
});

// Components
const compDir = path.join(__dirname, 'src', 'components', 'shared');
fs.mkdirSync(compDir, { recursive: true });

const statCard = {
  collectionName: 'components_shared_stat_cards',
  info: { displayName: 'StatCard', icon: 'chart-pie' },
  options: {},
  attributes: {
    label: { type: 'string' },
    value: { type: 'string' }
  }
};
fs.writeFileSync(path.join(compDir, 'stat-card.json'), JSON.stringify(statCard, null, 2));

const funcItem = {
  collectionName: 'components_shared_function_items',
  info: { displayName: 'FunctionItem', icon: 'list' },
  options: {},
  attributes: {
    icon: { type: 'string' },
    title: { type: 'string' },
    text: { type: 'text' }
  }
};
fs.writeFileSync(path.join(compDir, 'function-item.json'), JSON.stringify(funcItem, null, 2));

console.log('Schemas generated.');
