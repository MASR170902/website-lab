"use client";

import { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createPraktikum } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, FileText, ImagePlus, Loader2 } from "lucide-react";

export function AdminPraktikumForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedPhotoCount, setSelectedPhotoCount] = useState<number>(0);
  const [selectedPdfName, setSelectedPdfName] = useState<string | null>(null);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    setSelectedPhotoCount(files ? files.length : 0);
    setErrorMessage(null);
  }
  function handlePdfChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    setSelectedPdfName(files && files.length > 0 ? files[0].name : null);
    setErrorMessage(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const judul = (formData.get("judul") as string)?.trim() || "";
    const deskripsi = (formData.get("deskripsi") as string)?.trim() || "";
    const photoInput = form.querySelector('input[name="gambar"]') as HTMLInputElement;
    const pdfInput = form.querySelector('input[name="pdf"]') as HTMLInputElement;

    // Validasi client-side
    if (!judul) {
      setErrorMessage("Judul kegiatan praktikum wajib diisi.");
      return;
    }

    if (!deskripsi) {
      setErrorMessage("Deskripsi kegiatan wajib diisi (1-3 paragraf).");
      return;
    }

    const photoFiles = photoInput?.files ? Array.from(photoInput.files) : [];
    if (photoFiles.length === 0) {
      setErrorMessage("Wajib mengunggah minimal 1 foto dokumentasi kegiatan.");
      return;
    }

    const maxPhotoSize = 3 * 1024 * 1024; // 3MB
    for (const file of photoFiles) {
      if (file.size > maxPhotoSize) {
        setErrorMessage(
          `Ukuran foto "${file.name}" (${(file.size / (1024 * 1024)).toFixed(1)} MB) melebihi batas maksimal 3 MB.`
        );
        return;
      }
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setErrorMessage(
          `Format foto "${file.name}" tidak didukung. Gunakan file JPEG, PNG, atau WebP.`
        );
        return;
      }
    }

    const pdfFiles = pdfInput?.files ? Array.from(pdfInput.files) : [];
    if (pdfFiles.length > 0 && pdfFiles[0].size > 0) {
      const pdf = pdfFiles[0];
      const maxPdfSize = 20 * 1024 * 1024; // 20MB
      if (pdf.size > maxPdfSize) {
        setErrorMessage(
          `Ukuran file PDF "${pdf.name}" (${(pdf.size / (1024 * 1024)).toFixed(1)} MB) melebihi batas maksimal 20 MB.`
        );
        return;
      }
      if (pdf.type !== "application/pdf" && !pdf.name.toLowerCase().endsWith(".pdf")) {
        setErrorMessage(`File modul harus berformat PDF (.pdf).`);
        return;
      }
    }

    startTransition(async () => {
      try {
        await createPraktikum(formData);
        setSuccessMessage("Dokumentasi kegiatan praktikum berhasil disimpan!");
        formRef.current?.reset();
        setSelectedPhotoCount(0);
        setSelectedPdfName(null);
        router.refresh();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan dokumentasi.";
        setErrorMessage(message);
      }
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5">
      {errorMessage && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-xs leading-5 text-red-700">
          <AlertCircle size={18} className="shrink-0 text-red-600 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800">Validasi Gagal</p>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs leading-5 text-emerald-800">
          <CheckCircle2 size={18} className="shrink-0 text-emerald-600 mt-0.5" />
          <div>
            <p className="font-semibold text-emerald-900">Berhasil Disimpan</p>
            <p className="mt-0.5">{successMessage}</p>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700">
          Label / Modul
          <span className="text-[11px] font-normal text-slate-500">
            Contoh: &quot;Modul 01&quot;, &quot;Workshop Keamanan&quot;
          </span>
          <input
            name="modul"
            placeholder="Modul 01"
            defaultValue="Modul 01"
            required
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-ink outline-none transition focus:border-ocean focus:ring-1 focus:ring-ocean"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700">
          Judul Kegiatan <span className="text-red-500">*</span>
          <span className="text-[11px] font-normal text-slate-500">
            Nama topik atau kegiatan praktikum yang diselenggarakan
          </span>
          <input
            name="judul"
            placeholder="Contoh: Analisis Paket Jaringan dengan Wireshark"
            required
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-ink outline-none transition focus:border-ocean focus:ring-1 focus:ring-ocean"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700">
        Deskripsi Kegiatan (1-3 Paragraf) <span className="text-red-500">*</span>
        <span className="text-[11px] font-normal text-slate-500">
          Jelaskan secara luas materi apa yang diajarkan, skenario latihan, dan pemahaman yang diperoleh mahasiswa.
        </span>
        <textarea
          name="deskripsi"
          rows={4}
          placeholder="Tuliskan penjelasan kegiatan praktikum di sini. Gunakan baris baru untuk memisahkan paragraf."
          required
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-ink outline-none transition focus:border-ocean focus:ring-1 focus:ring-ocean"
        />
      </label>

      {/* Bagian Utama: Foto Dokumentasi */}
      <div className="rounded-xl border-2 border-dashed border-[#a8d4c0] bg-[#f4faf7] p-5">
        <label className="flex flex-col gap-1 text-xs font-semibold text-slate-800">
          <span className="flex items-center gap-2 text-sm font-bold text-ocean">
            <ImagePlus size={18} /> Foto Dokumentasi Kegiatan (Utama) <span className="text-red-500">*</span>
          </span>
          <span className="text-[11px] font-normal text-slate-600">
            Wajib minimal 1 foto. Mendukung pilihan banyak foto (multiple), format JPEG, PNG, atau WebP (maks. 3MB per foto). Foto otomatis dioptimasi dengan Sharp.
          </span>
          <input
            name="gambar"
            type="file"
            multiple
            required
            accept="image/jpeg,image/png,image/webp"
            onChange={handlePhotoChange}
            className="mt-2 block w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-ocean file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white file:transition hover:file:bg-[#12586e]"
          />
        </label>
        {selectedPhotoCount > 0 && (
          <p className="mt-2 text-xs font-medium text-emerald-700">
            ✓ {selectedPhotoCount} foto dokumentasi dipilih
          </p>
        )}
      </div>

      {/* Bagian Opsional: File PDF Modul */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700">
          <span className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <FileText size={16} className="text-slate-400" /> Modul PDF (Opsional)
          </span>
          <span className="text-[11px] font-normal text-slate-500">
            File dokumen modul praktikum resmi (.pdf, maks. 20MB). Boleh dikosongkan jika belum tersedia.
          </span>
          <input
            name="pdf"
            type="file"
            accept="application/pdf,.pdf"
            onChange={handlePdfChange}
            className="mt-2 block w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-slate-700 file:transition hover:file:bg-slate-200"
          />
        </label>
        {selectedPdfName && (
          <p className="mt-2 text-xs font-medium text-ocean">
            ✓ File PDF dipilih: {selectedPdfName}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 px-6"
        >
          {isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Menyimpan &amp; Memproses Foto...
            </>
          ) : (
            "Simpan Dokumentasi Praktikum"
          )}
        </Button>
      </div>
    </form>
  );
}
