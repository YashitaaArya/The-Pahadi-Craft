export const getDriveImage = (url?: string | null) => {
  if (!url) return url || '';

  try {
    // Common drive file share pattern: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
    const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      return `https://drive.google.com/thumbnail?id=${fileIdMatch[1]}`;
    }

    // Alternate pattern: https://drive.google.com/open?id=FILE_ID
    const idParam = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idParam && idParam[1]) {
      return `https://drive.google.com/thumbnail?id=${idParam[1]}`;
    }

    // If it already looks like a direct uc link, return as-is
    if (url.includes('googleusercontent.com') || url.includes('uc?export') || url.includes('thumbnail?id')) return url;

    return url;
  } catch (e) {
    return url;
  }
};
