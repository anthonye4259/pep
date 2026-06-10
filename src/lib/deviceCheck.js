/**
 * Detect if the current device is an iPad.
 * On iPadOS 13+, Safari reports as desktop, so we use multiple checks.
 * In Capacitor WKWebView, navigator.platform reliably reports "iPad".
 */
export function isIPad() {
  if (typeof navigator === 'undefined') return false;
  
  // Direct iPad check (works in WKWebView / Capacitor)
  if (navigator.platform === 'iPad') return true;
  
  // iPadOS 13+ desktop mode detection
  if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) return true;
  
  // User agent fallback
  if (/iPad/.test(navigator.userAgent)) return true;
  
  return false;
}

/**
 * Check if HealthKit should be available on this device.
 * HealthKit does NOT work reliably on iPad despite isAvailable() returning true.
 * Only return true on iPhone.
 */
export function shouldShowHealthKit() {
  return !isIPad();
}
