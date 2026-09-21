// Server-safe: the root layout inlines the script below, so this module must
// not reach into client-only code.
export const ANNOUNCEMENT_STORAGE_KEY = "nyes-neck-daily-drops-banner-dismissed";

/**
 * Runs before first paint so a returning visitor who already dismissed the
 * banner never sees it flash in, and the page never shifts by the banner's
 * height once React hydrates. CSS in globals.css keys off the attribute.
 */
export const ANNOUNCEMENT_PREPAINT_SCRIPT = `try{if(localStorage.getItem(${JSON.stringify(ANNOUNCEMENT_STORAGE_KEY)})==="true"){document.documentElement.dataset.announcement="dismissed"}}catch(e){}`;
