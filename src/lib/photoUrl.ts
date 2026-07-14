const ABSOLUTE_URL = /^https?:\/\//;

/**
 * Story photos are normally a path relative to public/ (e.g. via the CMS's
 * upload widget), but contributors can also paste an external URL directly
 * into the image field. Only prefix with the site base path when it's the
 * former — an absolute URL must be left untouched.
 */
export function resolvePhotoUrl(base: string, photo: string): string {
  return ABSOLUTE_URL.test(photo) ? photo : `${base}${photo}`;
}

export function isExternalPhoto(photo: string): boolean {
  return ABSOLUTE_URL.test(photo);
}
