import Image from "next/image";
import heroImage from "../public/hero-building.jpg";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Atom,
  Check,
  ChevronDown,
  ExternalLink,
  Fingerprint,
  Globe2,
  Network,
  Radio,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";

import { getDb } from "@/lib/db";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: Record<string, any> = { Network, Fingerprint, Radio };

export default async function Home() {
  const db = getDb();
  const researchAreas = db.researchAreas;
  const publications = db.publications;
  const team = db.team;
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
          className="absolute inset-0 -z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0d2535]/95 via-[#103643]/75 to-[#123d45]/35" />
        <div className="network-grid pointer-events-none absolute inset-0 z-0 opacity-40" />
        <div className="container-wide relative z-10 flex min-h-[660px] items-center py-20 md:min-h-[710px]">
          <div className="max-w-[700px]">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/90 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-[#7cdaa2]" />
              Researching a safer digital world
            </div>
            <h1 className="max-w-[680px] text-[clamp(42px,7vw,76px)] font-semibold leading-[1.04] tracking-[-0.055em]">
              Securing the networks that connect us.
            </h1>
            <p className="mt-7 max-w-[540px] text-base leading-7 text-slate-200 md:text-[17px] md:leading-8">
              We are the Programming & Network Security Lab — advancing trusted
              technologies through thoughtful research, collaboration, and
              hands-on learning.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="bg-white text-ink hover:bg-emerald-50">
                <a href="#research">
                  Explore Research <ArrowRight size={17} />
                </a>
              </Button>
              <a
                href="#about"
                className="inline-flex h-14 items-center gap-2 rounded-full px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
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

          <div className="absolute bottom-12 right-0 hidden w-[250px] rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md lg:block">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-200">Connected by research</span>
              <Globe2 size={17} className="text-[#a6e7bb]" />
            </div>
            <div className="mt-5 flex items-end gap-1.5">
              {[28, 42, 34, 54, 39, 64, 48, 74, 58, 86, 67, 96, 78, 62, 82, 55].map(
                (height, index) => (
                  <span
                    key={index}
                    className="flex-1 rounded-t-sm bg-gradient-to-t from-[#55b77d] to-[#a8e5bd]"
                    style={{ height: `${height}px`, opacity: 0.45 + index * 0.035 }}
                  />
                ),
              )}
            </div>
            <p className="mt-3 text-[10px] text-slate-300">People · Ideas · Networks</p>
          </div>
        </div>
        <a
          href="#about"
          className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-t-xl border border-b-0 border-white/20 bg-white/10 px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.17em] text-white/80 backdrop-blur-sm"
        >
          Scroll to explore <ChevronDown size={13} />
        </a>
      </section>

      <section id="about" className="border-b border-slate-100 bg-white">
        <div className="container-wide grid gap-10 py-16 md:grid-cols-[1fr_1.3fr] md:items-center md:py-[84px]">
          <div>
            <span className="eyebrow">Who we are</span>
            <h2 className="mt-5 max-w-[440px] text-3xl font-semibold leading-tight tracking-[-0.04em] text-ink md:text-[40px]">
              Better security starts with better questions.
            </h2>
          </div>
          <div className="md:border-l md:border-slate-200 md:pl-10">
            <p className="text-[15px] leading-7 text-slate-600">
              PNS Lab brings together researchers and students to understand
              the challenges facing today&apos;s connected world. We pair
              rigorous computer science with practical experimentation to make
              digital systems more secure, dependable, and accessible.
            </p>
            <a
              href="#team"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ocean hover:text-leaf"
            >
              Meet our community <ArrowRight size={15} />
            </a>
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
                  "Security-minded design for connected infrastructure",
                  "Practical tools informed by real-world constraints",
                  "Open collaboration across research and education",
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
              <span className="eyebrow">People behind the research</span>
              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-ink md:text-[42px]">
                A curious community.
              </h2>
            </div>
            <p className="max-w-[510px] text-sm leading-7 text-slate-600 md:justify-self-end">
              Our lab is a collaborative space for faculty, researchers, and
              students who want to make a meaningful contribution to network
              security.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {team.map((member: any) => (
              <article key={member.title} className="team-card rounded-2xl border border-slate-200 p-6 transition-colors hover:border-[#bddbc9] md:p-7">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-sm font-bold ${member.color}`}>
                  {member.initials}
                </div>
                <div className="mt-8 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-ink">{member.title}</h3>
                    <p className="mt-2 text-xs text-slate-500">{member.focus}</p>
                  </div>
                  <ArrowUpRight className="team-arrow text-slate-400" size={18} />
                </div>
              </article>
            ))}
          </div>
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
            <p className="mt-3 text-sm text-slate-300">We would love to hear from students, researchers, and collaborators.</p>
          </div>
          <Button asChild size="lg" className="shrink-0 bg-white text-ink hover:bg-emerald-50">
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
                Researching secure, resilient, and trustworthy digital systems.
              </p>
            </div>
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-white">Explore</h3>
              <div className="mt-5 flex flex-col gap-3 text-xs text-slate-400">
                <a href="#about" className="hover:text-white">About the lab</a>
                <a href="#research" className="hover:text-white">Research areas</a>
                <a href="#publications" className="hover:text-white">Publications</a>
                <a href="#team" className="hover:text-white">Our team</a>
              </div>
            </div>
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-white">Get in touch</h3>
              <div className="mt-5 flex flex-col gap-3 text-xs text-slate-400">
                <a href="mailto:pns-lab@example.edu" className="hover:text-white">pns-lab@example.edu</a>
                <span>Department / Faculty</span>
                <span>University address</span>
                <span>City, Country</span>
              </div>
            </div>
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-white">Follow along</h3>
              <div className="mt-5 flex flex-col gap-3 text-xs text-slate-400">
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
