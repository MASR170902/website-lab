import fs from 'node:fs';
import path from 'node:path';
import { db, sqlite } from '../lib/drizzle';
import * as schema from '../lib/schema';

interface JsonResearchArea {
  id: string;
  number: string;
  icon: string;
  title: string;
  description: string;
  tags: string[];
}
interface JsonPublication {
  id: string;
  type: string;
  year: string;
  title: string;
  authors: string;
  journal: string;
  accent: string;
}

interface JsonTeamMember {
  id: string;
  initials: string;
  title: string;
  focus: string;
  color: string;
}

interface JsonOrganizationMember {
  id: string;
  group: string;
  name: string;
  isLeader: boolean;
  photo?: string;
}

interface JsonNewsItem {
  id: string;
  date: string;
  month: string;
  year: string;
  category: string;
  title: string;
  href: string;
}

interface JsonDatabase {
  researchAreas?: JsonResearchArea[];
  publications?: JsonPublication[];
  team?: JsonTeamMember[];
  organizationMembers?: JsonOrganizationMember[];
  newsItems?: JsonNewsItem[];
}

function migrate() {
  const jsonPath = path.join(process.cwd(), 'data', 'db.json');
  console.log(`Reading JSON data from: ${jsonPath}`);

  if (!fs.existsSync(jsonPath)) {
    throw new Error(`File ${jsonPath} does not exist.`);
  }

  const raw = fs.readFileSync(jsonPath, 'utf-8');
  const data: JsonDatabase = JSON.parse(raw);

  const migrationTx = sqlite.transaction(() => {
    // 1. Research Areas
    const areas = data.researchAreas ?? [];
    db.delete(schema.researchAreas).run();
    if (areas.length > 0) {
      db.insert(schema.researchAreas).values(
        areas.map((area) => ({
          id: area.id,
          number: area.number,
          icon: area.icon,
          title: area.title,
          description: area.description,
          tags: JSON.stringify(area.tags ?? []),
        }))
      ).run();
    }
    console.log(`[researchAreas] Migrated ${areas.length} rows`);

    // 2. Publications
    const pubs = data.publications ?? [];
    db.delete(schema.publications).run();
    if (pubs.length > 0) {
      db.insert(schema.publications).values(
        pubs.map((pub) => ({
          id: pub.id,
          type: pub.type,
          year: pub.year,
          title: pub.title,
          authors: pub.authors,
          journal: pub.journal,
          accent: pub.accent,
        }))
      ).run();
    }
    console.log(`[publications] Migrated ${pubs.length} rows`);

    // 3. Team
    const teamMembers = data.team ?? [];
    db.delete(schema.team).run();
    if (teamMembers.length > 0) {
      db.insert(schema.team).values(
        teamMembers.map((member) => ({
          id: member.id,
          initials: member.initials,
          title: member.title,
          focus: member.focus,
          color: member.color,
        }))
      ).run();
    }
    console.log(`[team] Migrated ${teamMembers.length} rows`);

    // 4. Organization Members
    const members = data.organizationMembers ?? [];
    db.delete(schema.organizationMembers).run();
    if (members.length > 0) {
      db.insert(schema.organizationMembers).values(
        members.map((member) => ({
          id: member.id,
          group: member.group,
          name: member.name,
          isLeader: Boolean(member.isLeader),
          photo: member.photo ?? null,
        }))
      ).run();
    }
    console.log(`[organizationMembers] Migrated ${members.length} rows`);

    // 5. News Items
    const news = data.newsItems ?? [];
    db.delete(schema.newsItems).run();
    if (news.length > 0) {
      db.insert(schema.newsItems).values(
        news.map((item) => ({
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
    console.log(`[newsItems] Migrated ${news.length} rows`);
  });

  migrationTx();
  console.log('Migration completed successfully!');
}

try {
  migrate();
} catch (error) {
  console.error('Migration failed:', error);
  process.exit(1);
}
