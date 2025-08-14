import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  return {
    deviceInfo: locals.deviceInfo,
    themeColor: locals.themeColor
  };
};