import { readdir } from 'fs/promises';
import { join } from 'path';
import { NextResponse } from 'next/server';

const FLYING_DIR = join(process.cwd(), 'public', 'images', 'flying');
const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif']);

interface FlyingImage {
  path: string;
  category: string;
}

export async function GET() {
  const images: FlyingImage[] = [];

  try {
    const categories = await readdir(FLYING_DIR, { withFileTypes: true });
    for (const category of categories) {
      if (!category.isDirectory()) continue;
      const files = await readdir(join(FLYING_DIR, category.name));
      for (const file of files) {
        const ext = file.substring(file.lastIndexOf('.')).toLowerCase();
        if (IMAGE_EXTENSIONS.has(ext)) {
          images.push({
            path: `/images/flying/${category.name}/${file}`,
            category: category.name,
          });
        }
      }
    }
  } catch {
    // Directory doesn't exist yet — return empty
  }

  return NextResponse.json(images);
}
