import fs from 'node:fs';
import path from 'node:path';
import { NextRequest } from 'next/server';

const MIME_TYPES: Record<string, string> = {
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) {
  const params = await context.params;
  const pathSegments = params.path;

  if (!pathSegments || !Array.isArray(pathSegments) || pathSegments.length === 0) {
    return new Response('File path is required', { status: 400 });
  }

  const relativePath = path.normalize(pathSegments.join('/'));

  // Prevent path traversal
  if (relativePath.includes('..') || path.isAbsolute(relativePath)) {
    return new Response('Forbidden', { status: 403 });
  }

  const publicUploadsDir = path.resolve(process.cwd(), 'public', 'uploads');
  const dataUploadsDir = path.resolve(process.cwd(), 'data', 'uploads');

  let fullPath = path.resolve(publicUploadsDir, relativePath);
  if (!fullPath.startsWith(publicUploadsDir + path.sep) || !fs.existsSync(fullPath)) {
    fullPath = path.resolve(dataUploadsDir, relativePath);
    if (!fullPath.startsWith(dataUploadsDir + path.sep) || !fs.existsSync(fullPath)) {
      return new Response('File not found', { status: 404 });
    }
  }

  const stat = fs.statSync(fullPath);
  if (!stat.isFile()) {
    return new Response('Not a file', { status: 404 });
  }

  const ext = path.extname(fullPath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  const fileBuffer = fs.readFileSync(fullPath);

  return new Response(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Length': stat.size.toString(),
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
