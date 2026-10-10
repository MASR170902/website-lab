'use server';

import { getDb, saveDb } from '@/lib/db';
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
  const dateObj = dateStr ? new Date(`${dateStr}T00:00:00`) : new Date();
  if (
    Number.isNaN(dateObj.getTime()) ||
    (dateStr && dateObj.toISOString().slice(0, 10) !== dateStr)
  ) {
    throw new Error('News date is invalid.');
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

function getTextField(formData: FormData, name: string): string {
  const value = formData.get(name);
  if (typeof value !== 'string') {
    throw new Error(`The ${name} field must be text.`);
  }
  return value.trim();
}
