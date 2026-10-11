import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const researchAreas = sqliteTable('research_areas', {
  id: text('id').primaryKey(),
  number: text('number').notNull(),
  icon: text('icon').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  tags: text('tags').notNull(),
});
export const publications = sqliteTable('publications', {
  id: text('id').primaryKey(),
  type: text('type').notNull(),
  year: text('year').notNull(),
  title: text('title').notNull(),
  authors: text('authors').notNull(),
  journal: text('journal').notNull(),
  accent: text('accent').notNull(),
});

export const team = sqliteTable('team', {
  id: text('id').primaryKey(),
  initials: text('initials').notNull(),
  title: text('title').notNull(),
  focus: text('focus').notNull(),
  color: text('color').notNull(),
});

export const organizationMembers = sqliteTable('organization_members', {
  id: text('id').primaryKey(),
  group: text('group').notNull(),
  name: text('name').notNull(),
  isLeader: integer('is_leader', { mode: 'boolean' }).notNull(),
  photo: text('photo'),
});

export const newsItems = sqliteTable('news_items', {
  id: text('id').primaryKey(),
  date: text('date').notNull(),
  month: text('month').notNull(),
  year: text('year').notNull(),
  category: text('category').notNull(),
  title: text('title').notNull(),
  href: text('href').notNull(),
});

export const praktikum = sqliteTable('praktikum', {
  id: text('id').primaryKey(),
  modul: text('modul').notNull(),
  judul: text('judul').notNull(),
  deskripsi: text('deskripsi').notNull(),
  pdfPath: text('pdfPath'),
  gambar: text('gambar').notNull(),
  createdAt: text('createdAt').notNull(),
});
