'use server';

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import {
  getDb,
  isOrganizationGroup,
  saveDb,
  createPraktikum as createPraktikumDb,
  updatePraktikum as updatePraktikumDb,
  deletePraktikum as deletePraktikumDb,
  getPraktikumById,
} from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyAdminPassword } from '@/lib/admin-password';
import { requireAdmin } from '@/lib/require-admin';
import { createAdminSession, SESSION_TTL_SECONDS } from '@/lib/session';

export async function login(formData: FormData) {
  const password = formData.get('password');
  if (typeof password !== 'string' || password.length === 0 || password.length > 1024) {
    redirect('/login?error=1');
  }

  let validPassword: boolean;
  try {
    validPassword = await verifyAdminPassword(password);
  } catch {
    redirect('/login?error=configuration');
  }

  if (!validPassword) {
    redirect('/login?error=1');
  }

  let session: string;
  try {
    session = await createAdminSession();
  } catch {
    redirect('/login?error=configuration');
  }

  (await cookies()).set('admin_session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });
  redirect('/admin');
}

export async function logout() {
  (await cookies()).set('admin_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });
  redirect('/login');
}

export async function addPublication(formData: FormData) {
  await requireAdmin();

  const title = getTextField(formData, 'title');
  const authors = getTextField(formData, 'authors');
  const journal = getTextField(formData, 'journal');
  const year = getTextField(formData, 'year');
  const type = getTextField(formData, 'type');
  
  if (!title || !authors || !journal || title.length > 500 || authors.length > 500 || journal.length > 500) {
    throw new Error('Publication fields are invalid.');
  }
  if (year && !/^\d{4}$/.test(year)) {
    throw new Error('Publication year must be a four-digit year.');
  }
  
  const db = getDb();
  db.publications.push({
    id: `pub-${crypto.randomUUID()}`,
    type: type.slice(0, 80) || 'JOURNAL ARTICLE',
    year: year || new Date().getFullYear().toString(),
    title,
    authors,
    journal,
    accent: "bg-[#e7f3ed] text-[#37845d]"
  });
  
  saveDb(db);
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function addNews(formData: FormData) {
  await requireAdmin();

  const title = getTextField(formData, 'title');
  const category = getTextField(formData, 'category');
  const dateStr = getTextField(formData, 'date');
  
  if (!title || title.length > 500 || category.length > 80) {
    throw new Error('News fields are invalid.');
  }
  if (dateStr && !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    throw new Error('News date is invalid.');
  }
  const dateObj = dateStr ? new Date(`${dateStr}T12:00:00`) : new Date();
  if (Number.isNaN(dateObj.getTime())) {
    throw new Error('News date is invalid.');
  }
  if (dateStr) {
    const [y, m, d] = dateStr.split('-');
    if (
      dateObj.getFullYear() !== Number(y) ||
      dateObj.getMonth() + 1 !== Number(m) ||
      dateObj.getDate() !== Number(d)
    ) {
      throw new Error('News date is invalid.');
    }
  }
  
  const db = getDb();
  db.newsItems.push({
    id: `news-${crypto.randomUUID()}`,
    date: dateObj.getDate().toString().padStart(2, '0'),
    month: dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
    year: dateObj.getFullYear().toString(),
    category: category || 'LAB NEWS',
    title,
    href: '#'
  });
  
  saveDb(db);
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function updateOrganizationMember(formData: FormData) {
  await requireAdmin();

  const id = getTextField(formData, 'id');
  const name = getTextField(formData, 'name');
  const isLeaderValue = formData.get('isLeader');
  const isLeader = isLeaderValue === 'true';
  if (isLeaderValue !== 'true' && isLeaderValue !== 'false') {
    throw new Error('Organization member role is invalid.');
  }
  if (name.length > 120) {
    throw new Error('Organization member name must be 120 characters or fewer.');
  }

  const db = getDb();
  const member = db.organizationMembers.find((item) => item.id === id);
  if (!member) {
    throw new Error('Organization member was not found.');
  }

  const photo = formData.get('photo');
  let newPhotoPath: string | undefined;
  if (photo instanceof File && photo.size > 0) {
    newPhotoPath = await storeOrganizationPhoto(photo);
  } else if (photo !== null && !(photo instanceof File)) {
    throw new Error('Organization photo must be an image file.');
  }

  const previousPhoto = member.photo;
  const wasLeader = member.isLeader;
  member.name = name;
  member.isLeader = isLeader;
  if (newPhotoPath) member.photo = newPhotoPath;

  try {
    if (isLeader) {
      for (const other of db.organizationMembers) {
        if (other.group === member.group && other.id !== member.id) {
          other.isLeader = false;
        }
      }
    } else if (wasLeader) {
      const nextLeader = db.organizationMembers.find(
        (other) => other.group === member.group && other.id !== member.id,
      );
      if (nextLeader) nextLeader.isLeader = true;
    }
    saveDb(db);
  } catch (error) {
    if (newPhotoPath) removeStoredOrganizationPhoto(newPhotoPath);
    throw error;
  }

  if (newPhotoPath && previousPhoto) {
    removeStoredOrganizationPhoto(previousPhoto);
  }

  revalidatePath('/');
  revalidatePath('/admin');
}

export async function addOrganizationMember(formData: FormData) {
  await requireAdmin();

  const groupValue = getTextField(formData, 'group');
  if (
    !isOrganizationGroup(groupValue) ||
    !['secretary', 'treasurer', 'rnd', 'hrd', 'media'].includes(groupValue)
  ) {
    throw new Error('This organization group cannot accept additional members.');
  }

  const db = getDb();
  db.organizationMembers.push({
    id: `org-${crypto.randomUUID()}`,
    group: groupValue,
    name: '',
    isLeader: false,
  });
  saveDb(db);
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function deleteOrganizationMember(formData: FormData) {
  await requireAdmin();

  const id = getTextField(formData, 'id');
  const db = getDb();
  const memberIndex = db.organizationMembers.findIndex((item) => item.id === id);
  if (memberIndex === -1) {
    throw new Error('Organization member was not found.');
  }

  const [member] = db.organizationMembers.splice(memberIndex, 1);
  if (member.isLeader) {
    const nextLeader = db.organizationMembers.find(
      (other) => other.group === member.group,
    );
    if (nextLeader) nextLeader.isLeader = true;
  }
  saveDb(db);
  if (member.photo) removeStoredOrganizationPhoto(member.photo);

  revalidatePath('/');
  revalidatePath('/admin');
}

export async function removeOrganizationPhoto(formData: FormData) {
  await requireAdmin();

  const id = getTextField(formData, 'id');
  const db = getDb();
  const member = db.organizationMembers.find((item) => item.id === id);
  if (!member) {
    throw new Error('Organization member was not found.');
  }

  const previousPhoto = member.photo;
  delete member.photo;
  saveDb(db);

  if (previousPhoto) {
    removeStoredOrganizationPhoto(previousPhoto);
  }

  revalidatePath('/');
  revalidatePath('/admin');
}

export async function deleteItem(type: 'publications' | 'newsItems', id: string) {
  await requireAdmin();
  if (type !== 'publications' && type !== 'newsItems') {
    throw new Error('Content type is invalid.');
  }

  const db = getDb();
  if (type === 'publications') {
    db.publications = db.publications.filter((item) => item.id !== id);
  } else {
    db.newsItems = db.newsItems.filter((item) => item.id !== id);
  }
  saveDb(db);
  revalidatePath('/');
  revalidatePath('/admin');
}

async function storeOrganizationPhoto(file: File): Promise<string> {
  const maxBytes = 3 * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error('Organization photos must be 3 MB or smaller.');
  }

  const input = Buffer.from(await file.arrayBuffer());
  const image = sharp(input, { failOn: 'error' });
  const metadata = await image.metadata();
  if (!metadata.format || !['jpeg', 'png', 'webp'].includes(metadata.format)) {
    throw new Error('Organization photos must be JPEG, PNG, or WebP images.');
  }

  const filename = `${crypto.randomUUID()}.webp`;
  const relativePath = `/uploads/organization/${filename}`;
  const outputPath = path.join(process.cwd(), 'public', 'uploads', 'organization', filename);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  await image
    .rotate()
    .resize(512, 512, { fit: 'cover', withoutEnlargement: true })
    .webp({ quality: 84 })
    .toFile(outputPath);

  return relativePath;
}

function removeStoredOrganizationPhoto(photoPath: string): void {
  if (!/^\/uploads\/organization\/[0-9a-f-]+\.webp$/i.test(photoPath)) {
    throw new Error('Stored organization photo path is invalid.');
  }
  const fullPath = path.join(process.cwd(), 'public', photoPath.slice(1));
  if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
}

function getTextField(formData: FormData, name: string): string {
  const value = formData.get(name);
  if (typeof value !== 'string') {
    throw new Error(`The ${name} field must be text.`);
  }
  return value.trim();
}

export async function createPraktikum(formData: FormData) {
  await requireAdmin();

  const modul = getTextField(formData, 'modul').trim() || 'Praktikum';
  const judul = getTextField(formData, 'judul').trim();
  const deskripsi = getTextField(formData, 'deskripsi').trim();

  if (!judul) {
    throw new Error('Judul kegiatan praktikum wajib diisi.');
  }

  if (!deskripsi) {
    throw new Error('Deskripsi kegiatan praktikum wajib diisi (1-3 paragraf).');
  }

  const imageFiles = formData.getAll('gambar');
  const gambar = await storePracticeImages(imageFiles);

  if (gambar.length === 0) {
    throw new Error('Wajib mengunggah minimal 1 foto dokumentasi kegiatan praktikum.');
  }

  const pdfFile = formData.get('pdf');
  let pdfPath: string | null = null;
  if (pdfFile instanceof File && pdfFile.size > 0) {
    pdfPath = await storePdf(pdfFile);
  }

  createPraktikumDb({
    modul,
    judul,
    deskripsi,
    pdfPath,
    gambar,
  });

  revalidatePath('/praktikum');
  revalidatePath('/admin');
}

export async function updatePraktikum(formData: FormData) {
  await requireAdmin();

  const id = getTextField(formData, 'id');
  const existing = getPraktikumById(id);
  if (!existing) {
    throw new Error('Modul praktikum tidak ditemukan.');
  }

  const modul = getTextField(formData, 'modul');
  const judul = getTextField(formData, 'judul');
  const deskripsi = getTextField(formData, 'deskripsi');

  if (!modul || !judul || !deskripsi) {
    throw new Error('Modul, judul, dan deskripsi wajib diisi.');
  }

  let pdfPath = existing.pdfPath;
  const pdfFile = formData.get('pdf');
  if (pdfFile instanceof File && pdfFile.size > 0) {
    const newPdfPath = await storePdf(pdfFile);
    if (existing.pdfPath) {
      removeUploadedFile(existing.pdfPath);
    }
    pdfPath = newPdfPath;
  }

  const imageFiles = formData.getAll('gambar');
  const newImages = await storePracticeImages(imageFiles);
  const gambar = newImages.length > 0 ? [...existing.gambar, ...newImages] : existing.gambar;

  updatePraktikumDb(id, {
    modul,
    judul,
    deskripsi,
    pdfPath,
    gambar,
  });

  revalidatePath('/praktikum');
  revalidatePath('/admin');
}

export async function deletePraktikum(formDataOrId: FormData | string) {
  await requireAdmin();

  const id = typeof formDataOrId === 'string' ? formDataOrId : getTextField(formDataOrId, 'id');
  const existing = getPraktikumById(id);
  if (!existing) {
    throw new Error('Modul praktikum tidak ditemukan.');
  }

  if (existing.pdfPath) {
    removeUploadedFile(existing.pdfPath);
  }
  for (const imgPath of existing.gambar) {
    removeUploadedFile(imgPath);
  }

  deletePraktikumDb(id);

  revalidatePath('/praktikum');
  revalidatePath('/admin');
}

async function storePdf(file: File): Promise<string> {
  const maxBytes = 20 * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error('Ukuran file PDF modul maksimal 20 MB.');
  }
  const isPdfMime = file.type === 'application/pdf';
  const hasPdfExt = file.name.toLowerCase().endsWith('.pdf');
  if (!isPdfMime || !hasPdfExt) {
    throw new Error('File modul praktikum harus berupa file PDF (.pdf).');
  }

  const filename = `${crypto.randomUUID()}.pdf`;
  const relativePath = `/api/files/modules/${filename}`;
  const outputPath = path.join(process.cwd(), 'data', 'uploads', 'modules', filename);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, Buffer.from(await file.arrayBuffer()));

  return relativePath;
}

async function storePracticeImages(files: FormDataEntryValue[]): Promise<string[]> {
  const maxBytes = 3 * 1024 * 1024;
  const savedPaths: string[] = [];

  for (const entry of files) {
    if (!(entry instanceof File) || entry.size === 0) continue;

    if (entry.size > maxBytes) {
      throw new Error('Ukuran setiap gambar dokumentasi maksimal 3 MB.');
    }

    const input = Buffer.from(await entry.arrayBuffer());
    const image = sharp(input, { failOn: 'error' });
    const metadata = await image.metadata();
    if (!metadata.format || !['jpeg', 'png', 'webp'].includes(metadata.format)) {
      throw new Error('Gambar dokumentasi harus berupa gambar JPEG, PNG, atau WebP.');
    }

    const filename = `${crypto.randomUUID()}.webp`;
    const relativePath = `/api/files/practice/${filename}`;
    const outputPath = path.join(process.cwd(), 'data', 'uploads', 'practice', filename);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    await image
      .rotate()
      .resize(1400, 1400, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(outputPath);

    savedPaths.push(relativePath);
  }

  return savedPaths;
}

function removeUploadedFile(fileUrl: string): void {
  if (!fileUrl.startsWith('/api/files/')) return;
  const relativePath = fileUrl.replace(/^\/api\/files\//, '');
  const uploadsDir = path.resolve(process.cwd(), 'data', 'uploads');
  const fullPath = path.resolve(uploadsDir, relativePath);
  if (fullPath.startsWith(uploadsDir + path.sep) && fs.existsSync(fullPath)) {
    try {
      fs.unlinkSync(fullPath);
    } catch {
      // ignore errors
    }
  }
}
