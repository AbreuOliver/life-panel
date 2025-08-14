export function parseUserAgent(ua: string) {
  let device = "Unknown Device";
  let os = "Unknown OS";
  let browser = "Unknown Browser";

  // Detect device
  if (/iPhone/.test(ua)) device = "iPhone";
  else if (/iPad/.test(ua)) device = "iPad";
  else if (/Android/.test(ua)) device = "Android Device";
  else if (/Macintosh/.test(ua)) device = "Mac";
  else if (/Windows/.test(ua)) device = "Windows PC";

  // Detect OS
  if (/iPhone OS (\d+_\d+)/.test(ua)) {
    os = `iOS ${RegExp.$1.replace("_", ".")}`;
  } else if (/Mac OS X (\d+_\d+)/.test(ua)) {
    os = `macOS ${RegExp.$1.replace("_", ".")}`;
  } else if (/Android (\d+(\.\d+)?)/.test(ua)) {
    os = `Android ${RegExp.$1}`;
  } else if (/Windows NT (\d+\.\d+)/.test(ua)) {
    const versionMap: Record<string, string> = {
      "10.0": "10",
      "6.3": "8.1",
      "6.2": "8",
      "6.1": "7"
    };
    os = `Windows ${versionMap[RegExp.$1] || RegExp.$1}`;
  }

  // Detect browser
  if (/Safari\/\d+/.test(ua) && /Version\/([\d.]+)/.test(ua)) {
    browser = `Safari ${RegExp.$1}`;
  } else if (/Chrome\/([\d.]+)/.test(ua)) {
    browser = `Chrome ${RegExp.$1}`;
  } else if (/Firefox\/([\d.]+)/.test(ua)) {
    browser = `Firefox ${RegExp.$1}`;
  } else if (/Edg\/([\d.]+)/.test(ua)) {
    browser = `Edge ${RegExp.$1}`;
  }

  return `${device} • ${os} • ${browser}`;
}
