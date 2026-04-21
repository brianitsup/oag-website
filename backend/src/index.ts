// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   */
  async bootstrap({ strapi } /* : { strapi: Core.Strapi } */) {
    try {
      // Find the public role
      const roles = await strapi.db.query('plugin::users-permissions.role').findMany({
        where: { type: 'public' },
        populate: ['permissions']
      });
      
      if (roles.length > 0) {
        const publicRole = roles[0];
        const apiNames = [
          'api::home.home',
          'api::about-us.about-us',
          'api::function.function',
          'api::contact-setting.contact-setting',
          'api::audit-report.audit-report',
          'api::news.news',
          'api::resource.resource',
          'api::opportunity.opportunity'
        ];
        const actions = ['find', 'findOne'];
        
        for (const api of apiNames) {
          for (const action of actions) {
            const actionId = `${api}.${action}`;
            
            // Check if permission already exists
            const exists = await strapi.db.query('plugin::users-permissions.permission').findOne({
              where: {
                action: actionId,
                role: publicRole.id
              }
            });
            
            if (!exists) {
              await strapi.db.query('plugin::users-permissions.permission').create({
                data: {
                  action: actionId,
                  role: publicRole.id
                }
              });
            }
          }
        }
        strapi.log.info('Successfully configured public permissions for content types.');
      }
    } catch (e) {
      strapi.log.error('Could not configure public permissions automatically.');
      console.error(e);
    }
  },
};
