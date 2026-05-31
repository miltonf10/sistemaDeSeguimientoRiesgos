import type { Handle } from '@sveltejs/kit';

const moduleMap: Record<string, string> = {
  isms: 'ISMS',
  compliance: 'Compliance',
  orm: 'ORM',
  aml: 'AML',
  auditoria: 'Auditorías',
};

export const handle: Handle = async ({ event, resolve }) => {
  const firstSeg = event.url.pathname.split('/')[1]?.toLowerCase() || '';
  const moduleId = moduleMap[firstSeg] || '';

  return resolve(event, {
    transformPageChunk: ({ html }) => {
      if (moduleId) {
        return html.replace('<html lang="es">', `<html lang="es" data-module="${moduleId}">`);
      }
      return html;
    }
  });
};
