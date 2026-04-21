import type { Schema, Struct } from '@strapi/strapi';

export interface SharedFunctionItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_function_items';
  info: {
    displayName: 'FunctionItem';
    icon: 'list';
  };
  attributes: {
    icon: Schema.Attribute.String;
    text: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'SEO';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedStatCard extends Struct.ComponentSchema {
  collectionName: 'components_shared_stat_cards';
  info: {
    displayName: 'StatCard';
    icon: 'chart-pie';
  };
  attributes: {
    label: Schema.Attribute.String;
    value: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.function-item': SharedFunctionItem;
      'shared.seo': SharedSeo;
      'shared.stat-card': SharedStatCard;
    }
  }
}
