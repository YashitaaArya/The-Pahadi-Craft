/**
 * Compresses/resizes an image file entirely in the browser before upload.
 * A 20MB straight-off-camera photo doesn't need to be that large for the web -
 * this brings it down to something Cloudinary's free tier (and any browser)
 * is happy with, while still looking sharp for product photography.
 *
 * - Resizes so the longest edge is at most `maxDimension` px (default 2000,
 *   comfortably larger than any screen will display a product photo at).
 * - Re-encodes as JPEG at `quality` (default 0.85, visually near-lossless).
 * - Leaves small images alone rather than needlessly re-compressing them.
 */
export async function compressImage(
  file: File,
  options: { maxDimension?: number; quality?: number } = {}
): Promise<File> {
  const { maxDimension = 2000, quality = 0.85 } = options;

  // Nothing to do for already-small files - skip the round-trip through canvas.
  if (file.size <= 1.5 * 1024 * 1024) {
    return file;
  }

  const imageBitmap = await createImageBitmap(file);
  const { width, height } = imageBitmap;

  const scale = Math.min(1, maxDimension / Math.max(width, height));
  const targetWidth = Math.round(width * scale);
  const targetHeight = Math.round(height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    // Canvas unsupported for some reason - fall back to the original file
    // rather than blocking the upload entirely.
    return file;
  }
  ctx.drawImage(imageBitmap, 0, 0, targetWidth, targetHeight);

  const blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', quality)
  );

  if (!blob) {
    return file;
  }

  const newName = file.name.replace(/\.[^.]+$/, '') + '.jpg';
  return new File([blob], newName, { type: 'image/jpeg' });
}