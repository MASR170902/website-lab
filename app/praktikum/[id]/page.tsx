import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Camera, FileText } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { getPraktikumById } from "@/lib/db";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(props: PageProps) {
  const { id } = await props.params;
  const item = getPraktikumById(id);
  if (!item) {
    return {
      title: "Documentation Not Found - PNS Lab",
    };
  }

  return {
    title: `${item.modul}: ${item.judul} - PNS Lab`,
    description: item.deskripsi.slice(0, 160),
  };
}

export default async function PraktikumDetailPage(props: PageProps) {
  const { id } = await props.params;
  const item = getPraktikumById(id);

  if (!item) {
    notFound();
  }

  const paragraphs = item.deskripsi
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const formattedDate = new Date(item.createdAt).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-[#fafbfc]">
      <SiteHeader />

      <article className="py-12 md:py-16">
        <div className="container-wide max-w-[960px]">
          <Link
            href="/praktikum"
            className="mb-8 inline-flex items-center gap-2 text-xs font-semibold text-ocean hover:text-leaf transition-colors"
          >
            <ArrowLeft size={14} /> Back to Practicum Documentation
          </Link>

          <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-lg bg-[#e8f1f5] px-3.5 py-1.5 text-xs font-bold tracking-wide text-[#176b87]">
                  {item.modul}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                  <Calendar size={13} /> {formattedDate}
                </span>
              </div>
              {item.pdfPath && (
                <a
                  href={item.pdfPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-ocean px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#12586e]"
                >
                  <FileText size={16} />
                  Download Module (PDF)
                </a>
              )}
            </div>

            <h1 className="mt-5 text-2xl font-bold tracking-[-0.035em] text-ink md:text-4xl">
              {item.judul}
            </h1>

            <div className="mt-8 space-y-4 border-t border-slate-100 pt-8">
              <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                Description &amp; Activity Materials
              </h2>
              {paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-sm leading-7 text-slate-700 md:text-base md:leading-8 sm:text-justify text-pretty hyphens-auto"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {item.gambar.length > 0 && (
              <div className="mt-10 border-t border-slate-100 pt-8">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                    <Camera size={14} /> Photo Documentation ({item.gambar.length} Photos)
                  </h2>
                  <span className="text-[11px] text-slate-400">
                    Click photo to enlarge
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {item.gambar.map((imgSrc, imgIdx) => (
                    <a
                      key={imgIdx}
                      href={imgSrc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm transition-all hover:border-ocean hover:shadow-md"
                    >
                      <img
                        src={imgSrc}
                        alt={`Activity documentation for ${item.judul} - photo ${imgIdx + 1}`}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </header>
        </div>
      </article>
    </main>
  );
}
