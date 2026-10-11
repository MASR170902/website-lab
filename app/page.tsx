import Link from "next/link";
import Image from "next/image";
import heroImage from "../public/background.jpg";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Atom,
  BookOpen,
  Check,
  ExternalLink,
  Fingerprint,
  Network,
  Radio,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";

import { getDb, ORGANIZATION_GROUPS } from "@/lib/db";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: Record<string, any> = { Network, Fingerprint, Radio };

export default async function Home() {
  const db = getDb();
  const researchAreas = db.researchAreas;
  const publications = db.publications;
  const organizationMembers = db.organizationMembers;
  const newsItems = db.newsItems;

  return (
    <main>
      <SiteHeader />

      <section className="hero-photo relative isolate min-h-[660px] overflow-hidden text-white md:min-h-[710px]">
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          placeholder="blur"
          fetchPriority="high"
          sizes="100vw"
          className="absolute inset-0 z-0 object-cover"
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0d2535]/70 via-[#103643]/45 to-[#123d45]/10" />
        <div className="network-grid pointer-events-none absolute inset-0 z-10 opacity-20" />
        <div className="container-wide relative z-20 flex min-h-[660px] items-center py-20 md:min-h-[710px]">
          <div className="max-w-[700px]">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/90 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-[#7cdaa2]" />
              Researching a safer digital world
            </div>
            <h1 className="max-w-[680px] text-[clamp(42px,7vw,76px)] font-semibold leading-[1.04] tracking-[-0.055em] drop-shadow-md">
              Securing the networks that connect us.
            </h1>
            <p className="mt-7 max-w-[540px] text-base leading-7 text-slate-200 md:text-[17px] md:leading-8 drop-shadow-md">
              PNS Lab is where real network and security problems get solved.
              Not simulations. Not textbook exercises. Actual systems, actual
              vulnerabilities, actual fixes — by students who mean it.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button
                asChild
                size="lg"
                variant="light"
                className="hero-research-button"
              >
                <a href="#research">
                  Explore Research <ArrowRight size={17} />
                </a>
              </Button>
              <a
                href="#about"
                className="inline-flex h-14 items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                Discover our lab <ArrowDown size={15} />
              </a>
            </div>
            <div className="mt-16 flex items-center gap-4 border-t border-white/20 pt-5 text-xs text-slate-300">
              <span className="flex -space-x-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#274657] bg-[#d8e9e5] text-[9px] font-bold text-ink">P</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#274657] bg-[#d7e5ec] text-[9px] font-bold text-ink">N</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#274657] bg-[#e2ead9] text-[9px] font-bold text-ink">S</span>
              </span>
              <span>Curiosity-led research. Real-world impact.</span>
            </div>
          </div>

        </div>
      </section>

      <section id="about" className="border-b border-slate-100 bg-white">
        <div className="container-wide py-16 md:py-[84px]">
          <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-start">
            <div>
              <span className="eyebrow">Who we are</span>
              <h2 className="mt-5 max-w-[440px] text-3xl font-semibold leading-tight tracking-[-0.04em] text-ink md:text-[40px]">
                Programming and network security. One lab.
              </h2>
            </div>
            <div className="md:border-l md:border-slate-200 md:pl-10">
              <p className="text-[15px] leading-7 text-slate-600">
                PNS Lab is a research laboratory at Telkom University
                Purwokerto, focused on two things: programming and network
                security. Not as separate disciplines. As one.
              </p>
              <p className="mt-4 text-[15px] leading-7 text-slate-600">
                The lab exists for a straightforward reason — to produce people
                who actually understand what they&apos;re doing. Not just
                students who passed the exam.
              </p>
            </div>
          </div>

          <div className="mt-12 grid gap-8 border-t border-slate-200 pt-9 md:grid-cols-2 md:gap-12">
            <article>
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-ocean">
                What we do
              </span>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Research here starts from concrete problems. Infrastructure
                that hasn&apos;t been hardened. Protocols that need testing.
                Tools that don&apos;t exist yet but should.
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                From there, findings get documented, published, and turned
                into hands-on learning material. The cycle repeats. That&apos;s
                how the lab runs.
              </p>
            </article>
            <article>
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-ocean">
                Our approach
              </span>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Members are trained to think like attackers. Not because the
                lab teaches anything reckless — but because understanding how
                something breaks is the only honest way to understand how to
                protect it.
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                It&apos;s harder than sitting in a lecture. That&apos;s exactly
                why people join.
              </p>
            </article>
          </div>

          <div className="mt-8">
            <a
              href="#team"
              className="inline-flex items-center gap-2 text-sm font-semibold text-ocean hover:text-leaf"
            >
              Meet our community <ArrowRight size={15} />
            </a>
          </div>

          <div className="mt-12 flex flex-col gap-2 border-t border-slate-200 pt-8 sm:flex-row sm:items-end sm:gap-4">
            <span className="text-5xl font-semibold leading-none tracking-[-0.06em] text-ocean md:text-6xl">
              23
            </span>
            <span className="pb-1 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
              Active members
            </span>
          </div>
        </div>
      </section>

      <section id="research" className="section-space bg-mist">
        <div className="container-wide">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <span className="eyebrow">What we work on</span>
              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-ink md:text-[42px]">
                Research areas
              </h2>
            </div>
            <p className="max-w-[390px] text-sm leading-6 text-slate-600">
              From foundational research to applied solutions, we explore the
              ideas shaping a more secure digital future.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {researchAreas.map(({ number, icon, title, description, tags }: any) => {
              const Icon = iconMap[icon] || Network;
              return (
              <article
                key={title}
                className="group rounded-2xl border border-slate-200 bg-white p-7 transition-all hover:-translate-y-1 hover:border-[#c6ddd1] hover:shadow-[0_15px_40px_rgba(23,43,58,0.07)]"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#edf5f0] text-ocean">
                    <Icon size={22} strokeWidth={1.7} />
                  </span>
                  <span className="text-xs font-medium tracking-widest text-slate-400">{number}</span>
                </div>
                <h3 className="mt-7 text-xl font-semibold tracking-tight text-ink">{title}</h3>
                <p className="mt-3 min-h-[84px] text-[13px] leading-6 text-slate-600">{description}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {tags.map((tag: string) => (
                    <span key={tag} className="rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-medium text-slate-600">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="practicum" className="section-space bg-white">
        <div className="container-wide">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <span className="eyebrow">Learn by doing</span>
              <h2 className="mt-5 max-w-[500px] text-3xl font-semibold leading-tight tracking-[-0.045em] text-ink md:text-[42px]">
                Practicum at PNS Lab
              </h2>
            </div>
            <p className="max-w-[620px] text-sm leading-7 text-slate-600">
              Turn concepts in programming and network security into practical
              skills. The practicum emphasizes learning through guided,
              hands-on work and a responsible approach to solving real-world
              technical problems.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "Build practical skills",
                description:
                  "Strengthen your foundations by working through practical programming and networking challenges.",
              },
              {
                number: "02",
                title: "Explore security",
                description:
                  "Learn to identify weaknesses and think critically about how systems can be made more secure.",
              },
              {
                number: "03",
                title: "Learn responsibly",
                description:
                  "Apply what you learn in a guided environment that values documentation, collaboration, and responsible practice.",
              },
            ].map((item) => (
              <article
                key={item.number}
                className="rounded-2xl border border-slate-200 bg-mist p-7"
              >
                <span className="text-xs font-medium tracking-widest text-ocean">
                  {item.number}
                </span>
                <h3 className="mt-5 text-lg font-semibold tracking-tight text-ink">
                  {item.title}
                </h3>
                <p className="mt-3 text-[13px] leading-6 text-slate-600">
                  {item.description}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#cbe3d6] bg-[#edf6f1] p-6 sm:p-7">
            <div className="max-w-[550px]">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-leaf">
                Dokumentasi &amp; Modul
              </span>
              <h3 className="mt-1 text-lg font-semibold text-ink">
                Dokumentasi Praktikum PNS Lab
              </h3>
              <p className="mt-1 text-xs leading-5 text-slate-600">
                Akses galeri foto dokumentasi kegiatan laboratorium, rangkuman materi pembelajaran, dan modul panduan resmi.
              </p>
            </div>
            <Link
              href="/praktikum"
              className="inline-flex items-center gap-2 rounded-xl bg-ocean px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#12586e]"
            >
              <BookOpen size={17} />
              Lihat Dokumentasi Praktikum <ArrowRight size={16} />
            </Link>
          </div>

          <a
            href="#contact"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-ocean"
          >
            Ask about the practicum <ArrowRight size={15} />
          </a>
        </div>
      </section>

      <section className="section-space bg-white">
        <div className="container-wide">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div className="relative min-h-[410px] overflow-hidden rounded-[24px] bg-[#173c4c] p-8 text-white md:p-10">
              <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "radial-gradient(circle at 80% 25%, rgba(80,169,121,.7), transparent 25%), radial-gradient(circle at 20% 80%, rgba(23,107,135,.8), transparent 35%)" }} />
              <div className="network-grid absolute inset-0 opacity-40" />
              <div className="relative flex h-full min-h-[350px] flex-col justify-between">
                <div className="flex items-start justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-white/10">
                    <ShieldCheck size={23} />
                  </span>
                  <span className="rounded-full border border-white/20 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/80">
                    Featured research
                  </span>
                </div>
                <div className="relative mx-auto my-5 flex h-[170px] w-[230px] items-center justify-center">
                  <span className="absolute h-[155px] w-[155px] rounded-full border border-dashed border-white/30" />
                  <span className="absolute h-[112px] w-[112px] rounded-full border border-white/30" />
                  <span className="absolute h-[70px] w-[70px] rounded-full bg-[#50a979]/25 ring-1 ring-[#a8e5bd]/70" />
                  <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-ocean shadow-xl">
                    <Atom size={24} />
                  </span>
                  <span className="absolute left-[25px] top-[34px] h-3 w-3 rounded-full bg-[#a8e5bd] ring-4 ring-white/10" />
                  <span className="absolute right-[29px] top-[58px] h-2.5 w-2.5 rounded-full bg-white ring-4 ring-white/10" />
                  <span className="absolute bottom-[25px] left-[76px] h-2 w-2 rounded-full bg-[#72d49a] ring-4 ring-white/10" />
                  <span className="absolute bottom-[39px] right-[36px] h-3 w-3 rounded-full bg-[#b8e8c9] ring-4 ring-white/10" />
                </div>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#a8e5bd]">Current focus</p>
                    <p className="mt-2 text-xl font-semibold tracking-tight">Building resilient networks</p>
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30">
                    <ArrowDownRight size={17} />
                  </span>
                </div>
              </div>
            </div>

            <div>
              <span className="eyebrow">Research in action</span>
              <h2 className="mt-5 max-w-[540px] text-3xl font-semibold leading-tight tracking-[-0.045em] text-ink md:text-[42px]">
                Designing networks that can withstand tomorrow&apos;s threats.
              </h2>
              <p className="mt-5 max-w-[550px] text-sm leading-7 text-slate-600">
                As more of our lives depend on connected systems, the cost of
                disruption continues to grow. Our group investigates practical
                ways to detect threats earlier, limit their impact, and help
                networks recover with confidence.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  "Threat detection on live network traffic",
                  "Tools built for actual deployment, not just demos",
                  "Research published and shared openly",
                ].map((point: string) => (
                  <div key={point} className="flex items-center gap-3 text-[13px] text-slate-700">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e8f5ed] text-leaf">
                      <Check size={12} strokeWidth={2.5} />
                    </span>
                    {point}
                  </div>
                ))}
              </div>
              <a href="#publications" className="mt-9 inline-flex items-center gap-2 text-sm font-semibold text-ocean hover:text-leaf">
                Browse our publications <ArrowRight size={15} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="publications" className="section-space bg-mist">
        <div className="container-wide">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <span className="eyebrow">Knowledge shared</span>
              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-ink md:text-[42px]">
                Latest publications
              </h2>
            </div>
            <a href="mailto:pns-lab@example.edu?subject=Publication%20list" className="inline-flex items-center gap-2 text-sm font-semibold text-ocean hover:text-leaf">
              View all publications <ArrowUpRight size={15} />
            </a>
          </div>

          <div className="mt-10 rounded-2xl border border-slate-200 bg-white px-6 md:px-8">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {publications.map((publication: any) => (
              <article key={publication.title} className="publication-row grid gap-4 py-6 md:grid-cols-[155px_1fr_54px] md:items-center md:gap-7 md:py-7">
                <div className="flex items-center gap-2">
                  <span className={`rounded-md px-2.5 py-1.5 text-[9px] font-bold tracking-[0.08em] ${publication.accent}`}>
                    {publication.type}
                  </span>
                </div>
                <div>
                  <h3 className="max-w-[690px] text-[15px] font-semibold leading-6 text-ink md:text-base">
                    {publication.title}
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    {publication.authors} <span className="mx-1.5 text-slate-300">·</span> <em>{publication.journal}</em>
                  </p>
                </div>
                <div className="flex items-center justify-between md:justify-end md:gap-4">
                  <span className="text-xs font-medium text-slate-400">{publication.year}</span>
                  <a
                    href="mailto:pns-lab@example.edu?subject=Publication%20request"
                    aria-label={`Request ${publication.title}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-ocean hover:text-ocean"
                  >
                    <ExternalLink size={15} />
                  </a>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-4 text-[11px] text-slate-400">
            Publication titles shown as illustrative examples. Contact the lab for the current bibliography.
          </p>
        </div>
      </section>

      <section id="team" className="section-space bg-white">
        <div className="container-wide">
          <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-end">
            <div>
              <span className="eyebrow">Organization Structure</span>
              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-ink md:text-[42px]">
                Lab Leadership
              </h2>
            </div>
            <p className="max-w-[510px] text-sm leading-7 text-slate-600 md:justify-self-end">
              Meet the people behind the Programming and Network Security Lab.
              Leadership names and photos are maintained by the lab administrator.
            </p>
          </div>

          {(() => {
            const groups = {
              kaur: organizationMembers.filter((member) => member.group === "kaur"),
              laboran: organizationMembers.filter((member) => member.group === "laboran"),
              coordinator: organizationMembers.filter((member) => member.group === "coordinator"),
              secretary: organizationMembers.filter((member) => member.group === "secretary"),
              treasurer: organizationMembers.filter((member) => member.group === "treasurer"),
              rnd: organizationMembers.filter((member) => member.group === "rnd"),
              hrd: organizationMembers.filter((member) => member.group === "hrd"),
              media: organizationMembers.filter((member) => member.group === "media"),
            };
            const ordered = (members: typeof organizationMembers) =>
              [...members].sort((first, second) => Number(second.isLeader) - Number(first.isLeader));
            const renderPerson = (
              member: (typeof organizationMembers)[number],
              group: keyof typeof groups,
            ) => (
              <article
                key={member.id}
                className="flex w-[178px] shrink-0 flex-col items-center rounded-xl border border-slate-200 bg-white px-4 pb-4 pt-5 text-center shadow-[0_5px_18px_rgba(23,43,58,0.05)] transition-all hover:-translate-y-1 hover:border-[#bddbc9] hover:shadow-[0_10px_24px_rgba(23,43,58,0.1)]"
              >
                <div className="relative mb-3 h-[76px] w-[76px] rounded-full bg-gradient-to-br from-[#176b87] via-[#50a979] to-[#b7d9c4] p-[3px] shadow-[0_8px_20px_rgba(23,107,135,0.18)]">
                  <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full border-[3px] border-white bg-[#f1f6f4]">
                    {member.photo ? (
                      <Image src={member.photo} alt={`Foto ${member.name || ORGANIZATION_GROUPS[group]}`} fill sizes="76px" className="object-cover" />
                    ) : (
                      <UserRound size={34} strokeWidth={1.4} className="text-[#8ba69a]" />
                    )}
                  </div>
                </div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ocean">
                  {member.isLeader
                    ? group === "secretary"
                      ? "Lab Secretary"
                      : group === "treasurer"
                        ? "Lab Treasurer"
                        : ["rnd", "hrd", "media"].includes(group)
                          ? "Division Lead"
                          : ORGANIZATION_GROUPS[group]
                    : group === "secretary"
                      ? "Secretariat Member"
                      : group === "treasurer"
                        ? "Treasury Member"
                        : "STAFF"}
                </p>
                <p className={`mt-1 text-xs leading-5 ${member.name ? "text-slate-600" : "text-slate-400"}`}>
                  {member.name || "Member name"}
                </p>
              </article>
            );
            const groupWidths = (
              lists: (typeof organizationMembers)[],
            ) =>
              lists.map((members) =>
                Math.max(250, ordered(members).length * 178 + Math.max(0, ordered(members).length - 1) * 12 + 32),
              );
            const renderGroupPanel = (
              group: keyof typeof groups,
              members: typeof organizationMembers,
            ) => {
              const sortedMembers = ordered(members);
              const leader = sortedMembers.find((member) => member.isLeader);
              const staff = sortedMembers.filter((member) => !member.isLeader);
              const hasStaffTree = ["rnd", "hrd", "media"].includes(group);

              return (
                <section
                  className="relative rounded-2xl border border-slate-200 bg-[#f8faf9] p-4 shadow-[0_8px_24px_rgba(23,43,58,0.05)]"
                  style={{ width: groupWidths([members])[0] }}
                >
                  <h3 className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.08em] text-ink">
                    {ORGANIZATION_GROUPS[group]}
                  </h3>
                  {hasStaffTree ? (
                    <div className="flex flex-col items-center">
                      {leader && renderPerson(leader, group)}
                      {staff.length > 0 && (
                        <div
                          className="relative mt-0 grid w-max items-start pt-8"
                          style={{
                            gridTemplateColumns: `repeat(${staff.length}, 178px)`,
                            columnGap: "12px",
                          }}
                        >
                          {staff.length > 1 && (
                            <span
                              aria-hidden="true"
                              className="absolute top-4 h-[2px] bg-[#94a3b8]"
                              style={{
                                left: "89px",
                                right: "89px",
                              }}
                            />
                          )}
                          {staff.map((member) => (
                            <div key={member.id} className="relative">
                              <span
                                aria-hidden="true"
                                className="absolute left-1/2 top-[-32px] h-8 w-[2px] -translate-x-1/2 bg-[#94a3b8]"
                              />
                              {renderPerson(member, group)}
                            </div>
                          ))}
                          <span
                            aria-hidden="true"
                            className="absolute left-1/2 top-0 h-4 w-[2px] -translate-x-1/2 bg-[#94a3b8]"
                          />
                        </div>
                      )}
                      {!leader && staff.length === 0 && (
                        <p className="w-[210px] py-6 text-center text-xs text-slate-400">
                          No members added yet
                        </p>
                      )}
                    </div>
                  ) : members.length ? (
                    <div className="flex w-full justify-center gap-3">
                      {sortedMembers.map((member) => renderPerson(member, group))}
                    </div>
                  ) : (
                    <p className="w-[210px] py-6 text-center text-xs text-slate-400">
                      No members added yet
                    </p>
                  )}
                </section>
              );
            };
            const sideLists = [groups.secretary, groups.treasurer];
            const sideWidths = groupWidths(sideLists);
            const sideColumnWidth = Math.max(...sideWidths);
            const sideTotalWidth = sideColumnWidth * 2 + 250 + 48;
            const sideBranchLeft = `${(sideColumnWidth / 2 / sideTotalWidth) * 100}%`;
            const sideBranchRight = sideBranchLeft;
            const divisionGroups = [
              ["rnd", groups.rnd],
              ["hrd", groups.hrd],
              ["media", groups.media],
            ] as const;
            const divisionWidths = groupWidths(divisionGroups.map(([, members]) => members));
            const divisionTotalWidth = divisionWidths.reduce((total, width) => total + width, 0) + 48;
            const divisionBranchLeft = `${(divisionWidths[0] / 2 / divisionTotalWidth) * 100}%`;
            const divisionBranchRight = `${(divisionWidths[2] / 2 / divisionTotalWidth) * 100}%`;

            return (
              <div className="mt-12 overflow-x-auto pb-4">
                <div className="mx-auto flex w-max min-w-full flex-col items-center px-4">
                  {groups.kaur[0] && renderPerson(groups.kaur[0], "kaur")}
                  <div aria-hidden="true" className="h-8 w-px bg-gradient-to-b from-[#50a979] to-slate-300" />
                  {groups.laboran[0] && renderPerson(groups.laboran[0], "laboran")}
                  <div aria-hidden="true" className="h-8 w-px bg-gradient-to-b from-[#50a979] to-slate-300" />
                  {groups.coordinator[0] && renderPerson(groups.coordinator[0], "coordinator")}

                  <div
                    className="relative mt-8 grid w-max items-start gap-6"
                    style={{ gridTemplateColumns: `${sideColumnWidth}px 250px ${sideColumnWidth}px` }}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute top-0 z-0 h-[2px] bg-[#94a3b8]"
                      style={{ left: sideBranchLeft, right: sideBranchRight }}
                    />
                    <span
                      aria-hidden="true"
                      className="absolute left-1/2 z-0 w-[2px] -translate-x-1/2 bg-[#94a3b8]"
                      style={{ top: -32, bottom: -49 }}
                    />
                    <div className="relative z-10 flex justify-center pt-8">
                      <span aria-hidden="true" className="absolute left-1/2 top-0 h-8 w-[2px] -translate-x-1/2 bg-[#94a3b8]" />
                      {renderGroupPanel("secretary", groups.secretary)}
                    </div>
                    <div className="w-[250px] shrink-0" aria-hidden="true" />
                    <div className="relative z-10 flex justify-center pt-8">
                      <span aria-hidden="true" className="absolute left-1/2 top-0 h-8 w-[2px] -translate-x-1/2 bg-[#94a3b8]" />
                      {renderGroupPanel("treasurer", groups.treasurer)}
                    </div>
                  </div>

                  <div
                    className="relative mt-12 grid w-max grid-flow-col auto-cols-max gap-6"
                    style={{ gridTemplateColumns: divisionWidths.map((width) => `${width}px`).join(" ") }}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute top-0 z-0 h-[2px] bg-[#94a3b8]"
                      style={{ left: divisionBranchLeft, right: divisionBranchRight }}
                    />
                    {divisionGroups.map(([group, members]) => (
                      <div key={group} className="relative z-10 flex justify-center pt-8">
                        <span aria-hidden="true" className="absolute left-1/2 top-0 h-8 w-[2px] -translate-x-1/2 bg-[#94a3b8]" />
                        {renderGroupPanel(group, members)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}

          <div className="mt-8 rounded-2xl bg-[#eff6f1] px-6 py-5 md:flex md:items-center md:justify-between">
            <p className="text-sm font-medium text-ink">Interested in doing research with us?</p>
            <a href="#contact" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-ocean hover:text-leaf md:mt-0">
              Explore opportunities <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>

      <section id="news" className="section-space bg-[#f7f9f8]">
        <div className="container-wide">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <span className="eyebrow">From the lab</span>
              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-ink md:text-[42px]">
                News & events
              </h2>
            </div>
            <a href="mailto:pns-lab@example.edu?subject=Lab%20updates" className="inline-flex items-center gap-2 text-sm font-semibold text-ocean hover:text-leaf">
              Get lab updates <ArrowRight size={15} />
            </a>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {newsItems.map((item: any) => (
              <a
                key={item.title}
                href={item.href}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(23,43,58,0.06)]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-[54px] w-[54px] flex-col items-center justify-center rounded-xl bg-mist">
                      <span className="text-lg font-semibold leading-5 text-ink">{item.date}</span>
                      <span className="mt-1 text-[8px] font-bold tracking-[0.12em] text-ocean">{item.month}</span>
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">{item.year}</span>
                  </div>
                  <ArrowUpRight className="team-arrow text-slate-400" size={17} />
                </div>
                <span className="mt-7 inline-block text-[9px] font-bold tracking-[0.15em] text-leaf">{item.category}</span>
                <h3 className="mt-2 text-[15px] font-semibold leading-6 text-ink group-hover:text-ocean">
                  {item.title}
                </h3>
                <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-ocean">
                  Learn more <ArrowRight size={13} />
                </span>
              </a>
            ))}
          </div>
          <p className="mt-4 text-[11px] text-slate-400">
            Sample news entries — replace with confirmed lab announcements and dates.
          </p>
        </div>
      </section>

      <section id="contact" className="bg-ink py-16 text-white md:py-[76px]">
        <div className="container-wide flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#a8e5bd]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#69cf91]" /> Let&apos;s work together
            </span>
            <h2 className="mt-4 max-w-[610px] text-3xl font-semibold leading-tight tracking-[-0.04em] md:text-[40px]">
              Have a question or an idea to explore?
            </h2>
            <p className="mt-3 max-w-[680px] text-sm leading-7 text-slate-300">
              PNS Lab is open to research collaboration, industry partnerships,
              and students who are serious about learning network security
              from the inside out.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            variant="light"
            className="contact-cta-button shrink-0"
          >
            <a href="mailto:pns-lab@example.edu">
              Get in touch <ArrowUpRight size={16} />
            </a>
          </Button>
        </div>
      </section>

      <footer className="bg-[#102330] py-12 text-white">
        <div className="container-wide">
          <div className="grid gap-10 border-b border-white/10 pb-10 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
            <div>
              <a
                href="#"
                aria-label="Programming Labs and Network Security Labs home"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2"
              >
                <Image
                  src="/logo-programming.png"
                  alt="Programming Labs"
                  width={120}
                  height={61}
                  className="h-12 w-auto max-w-[88px] object-contain"
                />
                <span aria-hidden="true" className="h-8 w-px bg-slate-200" />
                <Image
                  src="/logo-network-security.png"
                  alt="Network Security Labs"
                  width={120}
                  height={74}
                  className="h-12 w-auto max-w-[78px] object-contain"
                />
              </a>
              <p className="mt-5 max-w-[255px] text-xs leading-6 text-slate-400">
                Research that works in the real world.
              </p>
            </div>
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-white">Explore</h3>
              <div className="mt-5 flex flex-col gap-3 text-xs text-slate-400">
                <a href="#about" className="hover:text-white">About the lab</a>
                <a href="#research" className="hover:text-white">Research areas</a>
                <a href="#practicum" className="hover:text-white">Practicum</a>
                <a href="#publications" className="hover:text-white">Publications</a>
                <a href="#team" className="hover:text-white">Our team</a>
                <a href="#contact" className="hover:text-white">Contact</a>
              </div>
            </div>
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-white">Get in touch</h3>
              <div className="mt-5 flex flex-col gap-3 text-xs text-slate-400">
                <a href="mailto:pns-lab@example.edu" className="hover:text-white">pns-lab@example.edu</a>
                <span>Faculty of Electrical Engineering (FTE)</span>
                <span>Building TT 303, Telkom University Purwokerto</span>
                <span>Purwokerto, Indonesia</span>
              </div>
            </div>
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-white">Follow along</h3>
              <div className="mt-5 flex flex-col gap-3 text-xs text-slate-400">
                <a href="https://www.instagram.com/pnslaboratory?utm_source=ig_web_button_share_sheet&psln=ZDNlZDc0MzIxNw==" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-white">Instagram <ArrowUpRight size={12} /></a>
                <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-white">LinkedIn <ArrowUpRight size={12} /></a>
                <a href="https://github.com/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-white">GitHub <ArrowUpRight size={12} /></a>
                <a href="https://scholar.google.com/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-white">Google Scholar <ArrowUpRight size={12} /></a>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 pt-6 text-[10px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span>© 2025 Programming & Network Security Lab. All rights reserved.</span>
            <span>Built for research, learning & a safer internet.</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
