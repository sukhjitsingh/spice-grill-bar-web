import { getImage } from 'astro:assets';

import { menu } from '@/lib/menu';
import type { MenuImageMap } from '@/types/menu';

const THUMB_SIZES = [128, 256, 384] as const;
const THUMB_DEFAULT = 256;
const FULL_MAX_WIDTH = 1200;

const sources = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/menu/*.{jpg,jpeg,png,webp}',
  { eager: true }
);

async function buildOne(source: ImageMetadata, alt: string) {
  const thumbs = await Promise.all(
    THUMB_SIZES.map(async (size) => ({
      size,
      img: await getImage({ src: source, width: size, height: size, fit: 'cover', format: 'webp' }),
    }))
  );
  const full = await getImage({
    src: source,
    width: Math.min(FULL_MAX_WIDTH, source.width),
    format: 'webp',
  });

  return {
    alt,
    thumb: {
      src: thumbs.find((t) => t.size === THUMB_DEFAULT)!.img.src,
      srcSet: thumbs.map((t) => `${t.img.src} ${t.size}w`).join(', '),
      width: THUMB_DEFAULT,
      height: THUMB_DEFAULT,
    },
    full: {
      src: full.src,
      width: Number(full.attributes.width),
      height: Number(full.attributes.height),
    },
  };
}

async function build(): Promise<MenuImageMap> {
  const byName = new Map(
    Object.entries(sources).map(([path, mod]) => [path.split('/').pop() as string, mod.default])
  );

  const entries = await Promise.all(
    menu
      .flatMap((cat) => cat.items)
      .filter((item) => item.image)
      .map(async (item) => {
        const source = byName.get(item.image!);
        if (!source) {
          throw new Error(
            `Menu item "${item.name}": image "${item.image}" not found in src/assets/menu/`
          );
        }
        if (!item.imageAlt?.trim()) {
          throw new Error(`Menu item "${item.name}": has image "${item.image}" but no imageAlt`);
        }
        return [item.image!, await buildOne(source, item.imageAlt)] as const;
      })
  );
  return Object.fromEntries(entries);
}

let cached: Promise<MenuImageMap> | undefined;

export function getMenuImages(): Promise<MenuImageMap> {
  cached ??= build();
  return cached;
}
