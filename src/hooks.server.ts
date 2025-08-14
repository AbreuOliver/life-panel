import type { Handle } from '@sveltejs/kit';
import { parseUserAgent } from '$lib/utils/userAgentParser';

export const handle: Handle = async ({ event, resolve }) => {
  const userAgent = event.request.headers.get('user-agent') || '';
  const deviceInfo = parseUserAgent(userAgent);
  
  // Add device info to locals so it's available everywhere
  event.locals.deviceInfo = deviceInfo;
  event.locals.themeColor = getThemeColorForDevice(deviceInfo);
  
  return resolve(event);
};

function getThemeColorForDevice(deviceInfo: string): string {
  if (deviceInfo.includes("iPhone") || deviceInfo.includes("iPad")) {
    return "#007AFF"; // iOS blue 
  } else if (deviceInfo.includes("Android") || deviceInfo.includes("Galaxy") || deviceInfo.includes("Samsung")) {
    return "#1E1E1E"; // NEARLY BLACK
  }
  return "#82D844"; // THEME GREEN
}