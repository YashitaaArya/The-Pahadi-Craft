import { Product } from '../types';
import { getDriveImage } from './driveImage';

export const getProductImageUrls = (product: Partial<Product>) => {
  const urls: string[] = [];
  if (product.image) {
    if (Array.isArray(product.image)) {
      urls.push(...product.image.filter(Boolean));
    } else {
      urls.push(product.image);
    }
  }

  if (product.additionalImages && Array.isArray(product.additionalImages)) {
    urls.push(...product.additionalImages.filter(Boolean));
  }

  if (product.addtionalImages && Array.isArray(product.addtionalImages)) {
    urls.push(...product.addtionalImages.filter(Boolean));
  }

  return urls.map((url) => getDriveImage(url));
};
