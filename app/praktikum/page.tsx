import Link from "next/link";
import { ArrowLeft, ArrowRight, Camera, Images } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { getAllPraktikum } from "@/lib/db";

export const metadata = {
  title: "Practicum Documentation - Programming & Network Security Lab",
  description:
    "Documentation of laboratory practicum activities, learning modules, and sessions at Programming & Network Security Lab.",
};

export default function PraktikumPage() {
  const praktikumList = getAllPraktikum();

  return (
    <main className="min-h-screen bg-[#fafbfc]">
      <SiteHeader />

      <section className="border-b border-slate-200 bg-white py-14">
        <div className="container-wide">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-ocean hover:text-leaf transition-colors"
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <div className="max-w-[720px]">
            <span className="eyebrow">Activity Documentation</span>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-ink md:text-5xl">
              Practicum Documentation
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base sm:text-justify text-pretty">
              Documentation of laboratory practicum activities, hands-on explorations,
              and student guide materials at the Programming &amp; Network Security Lab,
              Telkom University Purwokerto.
            </p>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container-wide">
          {praktikumList.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#edf5f0] text-ocean mb-4">
                <Images size={24} />
              </div>
              <h3 className="text-base font-semibold text-ink">No Practicum Documentation Yet</h3>
              <p className="mt-1 text-xs text-slate-500 max-w-sm">
                Practicum activity documentation will be published by lab administrators after sessions are completed.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {praktikumList.map((item) => {
                const paragraphs = item.deskripsi
                  .split(/\n+/)
                  .map((p) => p.trim())
                  .filter(Boolean);

                return (
                  <article
                    key={item.id}
                    className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-[#c5ddd1] hover:shadow-md"
                  >
                    <div>
                      {item.gambar.length > 0 && (
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                          <img
                            src={item.gambar[0]}
                            alt={item.judul}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                          {item.gambar.length > 1 && (
                            <span className="absolute bottom-3 right-3 rounded-lg bg-black/60 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                              +{item.gambar.length - 1} more photos
                            </span>
                          )}
                        </div>
                      )}

                      <div className="p-6 md:p-7">
                        <div className="flex items-center justify-between gap-3">
                          <span className="rounded-lg bg-[#e8f1f5] px-3 py-1 text-xs font-bold tracking-wide text-[#176b87]">
                            {item.modul}
                          </span>
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span className="inline-flex items-center gap-1">
                              <Camera size={13} /> {item.gambar.length} photos
                            </span>
                            {item.pdfPath && <span>• PDF Module</span>}
                          </div>
                        </div>

                        <h2 className="mt-4 text-xl font-semibold tracking-tight text-ink group-hover:text-ocean transition-colors">
                          {item.judul}
                        </h2>

                        <p className="mt-3 line-clamp-3 text-xs leading-6 text-slate-600">
                          {paragraphs[0] || item.deskripsi}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 md:px-7">
                      <span className="text-[11px] font-medium text-slate-400">
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <Link
                        href={`/praktikum/${item.id}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-ocean px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#12586e]"
                      >
                        View Documentation <ArrowRight size={14} />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
