/**
 * IMAGE_EXTENSIONS are the extensions associated with supported images.
 */
const IMAGE_EXTENSIONS = /\.(jpe?g|gif|png|webp)$/i;

export default function validateImagePathname(pathname: string) {
  return IMAGE_EXTENSIONS.test(pathname);
}
