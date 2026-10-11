import fs from 'node:fs';
import path from 'node:path';
import { NextRequest } from 'next/server';

const MIME_TYPES: Record<string, string> = {
  '.pdf': 'application/pdf',
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
  const uploadsDir = path.resolve(process.cwd(), 'data', 'uploads');
  const relativePath = path.normalize(pathSegments.join('/'));
  const fullPath = path.resolve(uploadsDir, relativePath);

  // Prevent path traversal: ensure resolved path is strictly inside uploads directory
  if (!fullPath.startsWith(uploadsDir + path.sep)) {
    return new Response('Forbidden', { status: 403 });
  }

  if (!fs.existsSync(fullPath)) {
    return new Response('File not found', { status: 404 });
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
