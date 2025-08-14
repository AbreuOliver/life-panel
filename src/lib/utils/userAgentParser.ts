export function parseUserAgent(ua: string) {
  let device = "Unknown Device";
  let os = "Unknown OS";
  let browser = "Unknown Browser";

  // Detect device
  if (/iPhone/.test(ua)) {
    device = "iPhone";
  } else if (/iPad/.test(ua)) {
    device = "iPad";
  } else if (/Android/.test(ua)) {
    // Enhanced Android device detection
    if (/SAMSUNG\s+([\w-]+)/.test(ua)) {
      const model = RegExp.$1;
      // Map common Samsung model codes to friendly names
      const samsungModels: Record<string, string> = {
        'SM-G973U': 'Galaxy S10',
        'SM-G975U': 'Galaxy S10+',
        'SM-G970U': 'Galaxy S10e',
        'SM-G981U': 'Galaxy S20',
        'SM-G985U': 'Galaxy S20+',
        'SM-G988U': 'Galaxy S20 Ultra',
        'SM-G991U': 'Galaxy S21',
        'SM-G996U': 'Galaxy S21+',
        'SM-G998U': 'Galaxy S21 Ultra',
        'SM-N975U': 'Galaxy Note 10+',
        'SM-N976U': 'Galaxy Note 10+ 5G',
        'SM-N986U': 'Galaxy Note 20 Ultra',
        'SM-A515U': 'Galaxy A51',
        'SM-A716U': 'Galaxy A71 5G'
      };
      device = samsungModels[model] || `SAMSUNG ${model}`;
    } else if (/Pixel\s+(\d+[a-zA-Z]*)/i.test(ua)) {
      device = `Google Pixel ${RegExp.$1}`;
    } else if (/LG-(\w+)/.test(ua)) {
      device = `LG ${RegExp.$1}`;
    } else if (/HUAWEI\s+([\w-]+)/i.test(ua)) {
      device = `Huawei ${RegExp.$1}`;
    } else if (/OnePlus\s+([\w-]+)/i.test(ua)) {
      device = `OnePlus ${RegExp.$1}`;
    } else if (/Xiaomi\s+([\w-]+)/i.test(ua)) {
      device = `Xiaomi ${RegExp.$1}`;
    } else if (/Sony\s+([\w-]+)/i.test(ua)) {
      device = `Sony ${RegExp.$1}`;
    } else if (/HTC\s+([\w-]+)/i.test(ua)) {
      device = `HTC ${RegExp.$1}`;
    } else if (/Motorola\s+([\w-]+)/i.test(ua)) {
      device = `Motorola ${RegExp.$1}`;
    } else if (/Nokia\s+([\w-]+)/i.test(ua)) {
      device = `Nokia ${RegExp.$1}`;
    } else {
      // Generic Android device fallback - try to extract any model info
      const androidModelMatch = ua.match(/Android[^;]*;\s*([^)]+)/);
      if (androidModelMatch && androidModelMatch[1].trim() !== '') {
        const modelInfo = androidModelMatch[1].trim();
        // Clean up common patterns
        const cleanModel = modelInfo
          .replace(/^Build\/\w+\s*/, '')
          .replace(/wv$/, '')
          .trim();
        device = cleanModel || "Android Device";
      } else {
        device = "Android Device";
      }
    }
  } else if (/Macintosh/.test(ua)) {
    device = "Mac";
  } else if (/Windows/.test(ua)) {
    device = "Windows PC";
  }

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

  // Enhanced browser detection
  if (/SamsungBrowser\/([\d.]+)/.test(ua)) {
    browser = `Samsung Internet ${RegExp.$1}`;
  } else if (/Safari\/\d+/.test(ua) && /Version\/([\d.]+)/.test(ua)) {
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