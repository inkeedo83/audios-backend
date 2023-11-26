import 'dotenv/config';
export const APP_HOST = 'http://localhost:5010';
export const BUCKET = 'files';
export const ALLOWED_MIME_TYPES = ['jpeg', 'png', 'mpeg'];
export const DEFAULT_IMAGE_NAME = 'default_image.jpeg';
export const ORDERS = ['ASC', 'DESC'] as const;

export const MINIO_HOST = process.env.MINIO_HOST
  ? String(process.env.MINIO_HOST)
  : 'localhost';

export const CATEGORIES = [
  'animals',
  'food',
  'meme',
  'movie',
  'music',
  'nature',
  'news',
  'sport',
] as const;

export const CATS = [
  'animals',
  'food',
  'meme',
  'movie',
  'music',
  'nature',
  'news',
  'sport',
];
