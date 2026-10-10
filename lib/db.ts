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

export interface OrganizationMember {
  id: string;
  group: OrganizationGroup;
  name: string;
  isLeader: boolean;
  photo?: string;
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

function isOrganizationMemberArray(value: unknown): value is OrganizationMember[] {
  return (
    isRecordArray(value) &&
    value.every(
      (item) =>
        typeof item.id === "string" &&
        typeof item.group === "string" &&
        isOrganizationGroup(item.group) &&
        typeof item.name === "string" &&
        typeof item.isLeader === "boolean" &&
        (item.photo === undefined || typeof item.photo === "string"),
    )
  );
}

function migrateOrganizationMembers(value: unknown): OrganizationMember[] | null {
  if (isOrganizationMemberArray(value)) return value;
  if (!isRecordArray(value)) return null;

  const legacyGroups: Record<string, OrganizationGroup> = {
    "org-kaur-lab": "kaur",
    "org-laboran": "laboran",
    "org-koordinator": "coordinator",
    "org-sekretaris": "secretary",
    "org-bendahara": "treasurer",
    "org-rnd": "rnd",
    "org-hrd": "hrd",
    "org-media-creative": "media",
  };

  const migrated: OrganizationMember[] = [];
  for (const item of value) {
    if (
      typeof item.id !== "string" ||
      typeof item.name !== "string" ||
      (item.photo !== undefined && typeof item.photo !== "string")
    ) {
      return null;
    }
    const group =
      typeof item.group === "string" && isOrganizationGroup(item.group)
        ? item.group
        : legacyGroups[item.id];
    if (!group) return null;

    migrated.push({
      id: item.id,
      group,
      name: item.name,
      isLeader: typeof item.isLeader === "boolean" ? item.isLeader : true,
      ...(typeof item.photo === "string" ? { photo: item.photo } : {}),
    });
  }
  return migrated;
}

function parseDb(data: string): LabDatabase {
  const parsed: unknown = JSON.parse(data);
  const organizationMembers =
    typeof parsed === "object" &&
    parsed !== null &&
    "organizationMembers" in parsed
      ? parsed.organizationMembers
      : DEFAULT_ORGANIZATION_MEMBERS;
  const normalizedOrganizationMembers =
    migrateOrganizationMembers(organizationMembers);

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
    !normalizedOrganizationMembers ||
    !isNewsItemArray(parsed.newsItems)
  ) {
    throw new Error('The lab content database has an invalid format.');
  }

  return {
    researchAreas: parsed.researchAreas,
    publications: parsed.publications,
    team: parsed.team,
    organizationMembers: normalizedOrganizationMembers,
    newsItems: parsed.newsItems,
  };
}

export function getDb(): LabDatabase {
  try {
    return parseDb(fs.readFileSync(dbPath, 'utf-8'));
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return {
        researchAreas: [],
        publications: [],
        team: [],
        organizationMembers: DEFAULT_ORGANIZATION_MEMBERS,
        newsItems: [],
      };
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
