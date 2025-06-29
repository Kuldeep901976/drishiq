import { put } from '@vercel/blob';

// Upload image to Vercel Blob
export async function uploadImage(file, filename) {
  try {
    const { url } = await put(filename, file, {
      access: 'public',
    });
    return url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

// Upload multiple images
export async function uploadMultipleImages(files) {
  const uploadPromises = files.map(async (file, index) => {
    const filename = `images/${Date.now()}-${index}-${file.name}`;
    return await uploadImage(file, filename);
  });
  
  return Promise.all(uploadPromises);
}

// Generate optimized image URL with Vercel's image optimization
export function getOptimizedImageUrl(blobUrl, width = 800, quality = 80) {
  // Vercel automatically optimizes images served from blob storage
  return `${blobUrl}?w=${width}&q=${quality}`;
}

// Predefined image categories
export const IMAGE_CATEGORIES = {
  ICONS: 'icons',
  LOGOS: 'logos', 
  BACKGROUNDS: 'backgrounds',
  PROFILE_PICTURES: 'profile-pictures',
  CONTENT: 'content'
};

// Upload with category organization
export async function uploadImageWithCategory(file, category, customName = null) {
  const timestamp = Date.now();
  const filename = customName || `${category}/${timestamp}-${file.name}`;
  return await uploadImage(file, filename);
} 