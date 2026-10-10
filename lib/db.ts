import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'db.json');

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

export interface LabDatabase {
  researchAreas: Record<string, unknown>[];
  publications: Publication[];
  team: Record<string, unknown>[];
  newsItems: NewsItem[];
}

function isRecordArray(value: unknown): value is Record<string, unknown>[] {
  return (
    Array.isArray(value) &&
    value.every((item) => typeof item === 'object' && item !== null && !Array.isArray(item))
  );
}

function isPublicationArray(value: unknown): value is Publication[] {
  return (
    isRecordArray(value) &&
    value.every(
      (item) =>
        typeof item.id === 'string' &&
        typeof item.type === 'string' &&
        typeof item.year === 'string' &&
        typeof item.title === 'string' &&
        typeof item.authors === 'string' &&
        typeof item.journal === 'string' &&
        typeof item.accent === 'string',
    )
  );
}

function isNewsItemArray(value: unknown): value is NewsItem[] {
  return (
    isRecordArray(value) &&
    value.every(
      (item) =>
        typeof item.id === 'string' &&
        typeof item.date === 'string' &&
        typeof item.month === 'string' &&
        typeof item.year === 'string' &&
        typeof item.category === 'string' &&
        typeof item.title === 'string' &&
        typeof item.href === 'string',
    )
  );
}

function parseDb(data: string): LabDatabase {
  const parsed: unknown = JSON.parse(data);
  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    !('researchAreas' in parsed) ||
    !('publications' in parsed) ||
    !('team' in parsed) ||
    !('newsItems' in parsed) ||
    !isRecordArray(parsed.researchAreas) ||
    !isPublicationArray(parsed.publications) ||
    !isRecordArray(parsed.team) ||
    !isNewsItemArray(parsed.newsItems)
  ) {
    throw new Error('The lab content database has an invalid format.');
  }

  return {
    researchAreas: parsed.researchAreas,
    publications: parsed.publications,
    team: parsed.team,
    newsItems: parsed.newsItems,
  };
}

export function getDb(): LabDatabase {
  try {
    return parseDb(fs.readFileSync(dbPath, 'utf-8'));
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return { researchAreas: [], publications: [], team: [], newsItems: [] };
    }
    throw error;
  }
}

export function saveDb(data: LabDatabase): void {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const temporaryPath = `${dbPath}.${process.pid}.tmp`;
  fs.writeFileSync(temporaryPath, JSON.stringify(data, null, 2), {
    encoding: 'utf-8',
    mode: 0o600,
  });
  fs.renameSync(temporaryPath, dbPath);
}
