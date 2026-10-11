import { eq } from 'drizzle-orm';
import { db, sqlite } from './drizzle';
import * as schema from './schema';

export interface Publication {
  id: string;
  type: string;
  year: string;
  title: string;
  authors: string;
  journal: string;
  accent: string;
}

export interface NewsItem {
  id: string;
  date: string;
  month: string;
  year: string;
  category: string;
  title: string;
  href: string;
}

export interface OrganizationMember {
  id: string;
  group: OrganizationGroup;
  name: string;
  isLeader: boolean;
  photo?: string;
}

export interface Praktikum {
  id: string;
  modul: string;
  judul: string;
  deskripsi: string;
  pdfPath: string | null;
  gambar: string[];
  createdAt: string;
}

export interface NewPraktikum {
  id?: string;
  modul: string;
  judul: string;
  deskripsi: string;
  pdfPath?: string | null;
  gambar?: string[];
  createdAt?: string;
}

export const ORGANIZATION_GROUPS = {
  kaur: "Lab Head",
  laboran: "Lab Assistant",
  coordinator: "Lab Coordinator",
  secretary: "Secretariat",
  treasurer: "Treasury",
  rnd: "R&D Division",
  hrd: "Human Resources Division",
  media: "Media & Creative Division",
} as const;

export type OrganizationGroup = keyof typeof ORGANIZATION_GROUPS;

export function isOrganizationGroup(value: string): value is OrganizationGroup {
  return Object.hasOwn(ORGANIZATION_GROUPS, value);
}

export const DEFAULT_ORGANIZATION_MEMBERS: OrganizationMember[] = [
  { id: "org-kaur-lab", group: "kaur", name: "", isLeader: true },
  { id: "org-laboran", group: "laboran", name: "", isLeader: true },
  { id: "org-koordinator", group: "coordinator", name: "", isLeader: true },
  { id: "org-sekretaris", group: "secretary", name: "", isLeader: true },
  { id: "org-bendahara", group: "treasurer", name: "", isLeader: true },
  { id: "org-rnd", group: "rnd", name: "", isLeader: true },
  { id: "org-hrd", group: "hrd", name: "", isLeader: true },
  { id: "org-media-creative", group: "media", name: "", isLeader: true },
];

export interface LabDatabase {
  researchAreas: Record<string, unknown>[];
  publications: Publication[];
  team: Record<string, unknown>[];
  organizationMembers: OrganizationMember[];
  newsItems: NewsItem[];
  praktikum?: Praktikum[];
}

function parseStringArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    if (Array.isArray(parsed) && parsed.every((item) => typeof item === 'string')) {
      return parsed;
    }
    return [];
  } catch {
    return [];
  }
}

// Praktikum CRUD functions
export function getAllPraktikum(): Praktikum[] {
  const rows = db.select().from(schema.praktikum).all();
  return rows.map((row) => ({
    id: row.id,
    modul: row.modul,
    judul: row.judul,
    deskripsi: row.deskripsi,
    pdfPath: row.pdfPath,
    gambar: parseStringArray(row.gambar),
    createdAt: row.createdAt,
  }));
}

export function getPraktikumById(id: string): Praktikum | null {
  const [row] = db.select().from(schema.praktikum).where(eq(schema.praktikum.id, id)).all();
  if (!row) return null;
  return {
    id: row.id,
    modul: row.modul,
    judul: row.judul,
    deskripsi: row.deskripsi,
    pdfPath: row.pdfPath,
    gambar: parseStringArray(row.gambar),
    createdAt: row.createdAt,
  };
}

export function createPraktikum(data: NewPraktikum): Praktikum {
  const id = data.id ?? crypto.randomUUID();
  const createdAt = data.createdAt ?? new Date().toISOString();
  const gambarJson = JSON.stringify(data.gambar ?? []);

  db.insert(schema.praktikum).values({
    id,
    modul: data.modul,
    judul: data.judul,
    deskripsi: data.deskripsi,
    pdfPath: data.pdfPath ?? null,
    gambar: gambarJson,
    createdAt,
  }).run();

  return {
    id,
    modul: data.modul,
    judul: data.judul,
    deskripsi: data.deskripsi,
    pdfPath: data.pdfPath ?? null,
    gambar: data.gambar ?? [],
    createdAt,
  };
}

export function updatePraktikum(id: string, data: Partial<NewPraktikum>): Praktikum | null {
  const existing = getPraktikumById(id);
  if (!existing) return null;

  const updateValues: {
    modul?: string;
    judul?: string;
    deskripsi?: string;
    pdfPath?: string | null;
    gambar?: string;
  } = {};

  if (data.modul !== undefined) updateValues.modul = data.modul;
  if (data.judul !== undefined) updateValues.judul = data.judul;
  if (data.deskripsi !== undefined) updateValues.deskripsi = data.deskripsi;
  if (data.pdfPath !== undefined) updateValues.pdfPath = data.pdfPath;
  if (data.gambar !== undefined) updateValues.gambar = JSON.stringify(data.gambar);

  if (Object.keys(updateValues).length > 0) {
    db.update(schema.praktikum).set(updateValues).where(eq(schema.praktikum.id, id)).run();
  }

  return getPraktikumById(id);
}

export function deletePraktikum(id: string): boolean {
  const result = db.delete(schema.praktikum).where(eq(schema.praktikum.id, id)).run();
  return result.changes > 0;
}

export function getDb(): LabDatabase {
  const rawResearchAreas = db.select().from(schema.researchAreas).all();
  const rawPublications = db.select().from(schema.publications).all();
  const rawTeam = db.select().from(schema.team).all();
  const rawMembers = db.select().from(schema.organizationMembers).all();
  const rawNews = db.select().from(schema.newsItems).all();

  const researchAreas = rawResearchAreas.map((row) => {
    let parsedTags: unknown = [];
    try {
      parsedTags = typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags;
    } catch {
      parsedTags = [];
    }
    return {
      id: row.id,
      number: row.number,
      icon: row.icon,
      title: row.title,
      description: row.description,
      tags: parsedTags,
    };
  });

  const publications: Publication[] = rawPublications.map((row) => ({
    id: row.id,
    type: row.type,
    year: row.year,
    title: row.title,
    authors: row.authors,
    journal: row.journal,
    accent: row.accent,
  }));

  const team: Record<string, unknown>[] = rawTeam.map((row) => ({
    id: row.id,
    initials: row.initials,
    title: row.title,
    focus: row.focus,
    color: row.color,
  }));

  const organizationMembers: OrganizationMember[] = (
    rawMembers.length > 0 ? rawMembers : DEFAULT_ORGANIZATION_MEMBERS
  ).map((row) => ({
    id: row.id,
    group: isOrganizationGroup(row.group) ? row.group : 'kaur',
    name: row.name,
    isLeader: Boolean(row.isLeader),
    ...(row.photo ? { photo: row.photo } : {}),
  }));

  const newsItems: NewsItem[] = rawNews.map((row) => ({
    id: row.id,
    date: row.date,
    month: row.month,
    year: row.year,
    category: row.category,
    title: row.title,
    href: row.href,
  }));

  return {
    researchAreas,
    publications,
    team,
    organizationMembers,
    newsItems,
    praktikum: getAllPraktikum(),
  };
}

export function saveDb(data: LabDatabase): void {
  const syncTransaction = sqlite.transaction(() => {
    if (data.researchAreas && Array.isArray(data.researchAreas)) {
      db.delete(schema.researchAreas).run();
      if (data.researchAreas.length > 0) {
        db.insert(schema.researchAreas).values(
          data.researchAreas.map((item) => ({
            id: String(item.id ?? ''),
            number: String(item.number ?? ''),
            icon: String(item.icon ?? ''),
            title: String(item.title ?? ''),
            description: String(item.description ?? ''),
            tags: typeof item.tags === 'string' ? item.tags : JSON.stringify(item.tags ?? []),
          }))
        ).run();
      }
    }

    if (data.publications && Array.isArray(data.publications)) {
      db.delete(schema.publications).run();
      if (data.publications.length > 0) {
        db.insert(schema.publications).values(
          data.publications.map((item) => ({
            id: item.id,
            type: item.type,
            year: item.year,
            title: item.title,
            authors: item.authors,
            journal: item.journal,
            accent: item.accent,
          }))
        ).run();
      }
    }

    if (data.team && Array.isArray(data.team)) {
      db.delete(schema.team).run();
      if (data.team.length > 0) {
        db.insert(schema.team).values(
          data.team.map((item) => ({
            id: String(item.id ?? ''),
            initials: String(item.initials ?? ''),
            title: String(item.title ?? ''),
            focus: String(item.focus ?? ''),
            color: String(item.color ?? ''),
          }))
        ).run();
      }
    }

    if (data.organizationMembers && Array.isArray(data.organizationMembers)) {
      db.delete(schema.organizationMembers).run();
      if (data.organizationMembers.length > 0) {
        db.insert(schema.organizationMembers).values(
          data.organizationMembers.map((item) => ({
            id: item.id,
            group: item.group,
            name: item.name,
            isLeader: Boolean(item.isLeader),
            photo: item.photo ?? null,
          }))
        ).run();
      }
    }

    if (data.newsItems && Array.isArray(data.newsItems)) {
      db.delete(schema.newsItems).run();
      if (data.newsItems.length > 0) {
        db.insert(schema.newsItems).values(
          data.newsItems.map((item) => ({
            id: item.id,
            date: item.date,
            month: item.month,
            year: item.year,
            category: item.category,
            title: item.title,
            href: item.href,
          }))
        ).run();
      }
    }

    if (data.praktikum && Array.isArray(data.praktikum)) {
      db.delete(schema.praktikum).run();
      if (data.praktikum.length > 0) {
        db.insert(schema.praktikum).values(
          data.praktikum.map((item) => ({
            id: item.id,
            modul: item.modul,
            judul: item.judul,
            deskripsi: item.deskripsi,
            pdfPath: item.pdfPath ?? null,
            gambar: Array.isArray(item.gambar) ? JSON.stringify(item.gambar) : String(item.gambar ?? '[]'),
            createdAt: item.createdAt,
          }))
        ).run();
      }
    }
  });

  syncTransaction();
}
