import { getDb } from '@/lib/db';
import {
  addOrganizationMember,
  addPublication,
  addNews,
  deleteItem,
  deleteOrganizationMember,
  logout,
  removeOrganizationPhoto,
  updateOrganizationMember,
} from '../actions';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { requireAdmin } from '@/lib/require-admin';
import { ORGANIZATION_GROUPS, type OrganizationGroup } from '@/lib/db';

const organizationGroupOrder: OrganizationGroup[] = [
  'kaur',
  'laboran',
  'coordinator',
  'secretary',
  'treasurer',
  'rnd',
  'hrd',
  'media',
];
const expandableOrganizationGroups: OrganizationGroup[] = [
  'secretary',
  'treasurer',
  'rnd',
  'hrd',
  'media',
];

export default async function AdminPage() {
  await requireAdmin();
  const db = getDb();

  return (
    <div className="container-wide py-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
        <form action={logout}>
          <Button type="submit" variant="outline">Logout</Button>
        </form>
      </div>
      
      <section className="mb-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <div className="mb-5">
          <h2 className="text-xl font-semibold">Lab Organization</h2>
          <p className="mt-1 text-sm text-slate-600">
            Kelola nama dan foto setiap pengurus. Tambahkan anggota Sekretaris,
            Bendahara, atau divisi; bagan publik akan menyesuaikan jumlah orang.
          </p>
        </div>
        <div className="space-y-6">
          {organizationGroupOrder.map((group) => {
            const members = db.organizationMembers.filter((member) => member.group === group);
            const canAddMembers = expandableOrganizationGroups.includes(group);

            return (
              <section key={group} className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-ink">{ORGANIZATION_GROUPS[group]}</h3>
                    {canAddMembers && (
                      <p className="mt-1 text-xs text-slate-500">
                        {members.length} orang · satu kepala, anggota lainnya dapat ditambahkan
                      </p>
                    )}
                  </div>
                  {canAddMembers && (
                    <form action={addOrganizationMember}>
                      <input type="hidden" name="group" value={group} />
                      <Button type="submit" size="sm" variant="outline">Tambah anggota</Button>
                    </form>
                  )}
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {members.map((member) => (
                    <article key={member.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-slate-100 shadow-[0_0_0_1px_#d8e2e6,0_0_0_4px_#f1f6f3]">
                          {member.photo ? (
                            <Image src={member.photo} alt="" width={56} height={56} className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-xs font-semibold text-slate-400">Foto</span>
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-ocean">
                            {member.isLeader ? (group === 'secretary' ? 'Sekretaris Lab' : group === 'treasurer' ? 'Bendahara Lab' : canAddMembers ? 'Kepala Divisi' : ORGANIZATION_GROUPS[group]) : 'Anggota'}
                          </p>
                          <p className="mt-1 text-sm font-semibold text-ink">{member.name || 'Nama belum diisi'}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        <form action={updateOrganizationMember} className="flex flex-col gap-3">
                          <input type="hidden" name="id" value={member.id} />
                          <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
                            Nama pengurus
                            <input
                              name="name"
                              defaultValue={member.name}
                              maxLength={120}
                              placeholder="Masukkan nama"
                              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-normal text-ink outline-none focus:border-ocean"
                            />
                          </label>
                          {canAddMembers ? (
                            <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
                              Jabatan
                              <select
                                name="isLeader"
                                defaultValue={member.isLeader ? 'true' : 'false'}
                                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-ink outline-none focus:border-ocean"
                              >
                                <option value="true">{group === 'secretary' ? 'Sekretaris Lab' : group === 'treasurer' ? 'Bendahara Lab' : 'Kepala Divisi'}</option>
                                <option value="false">{group === 'secretary' ? 'Anggota Sekretaris' : group === 'treasurer' ? 'Anggota Bendahara' : 'Anggota Divisi'}</option>
                              </select>
                            </label>
                          ) : (
                            <input type="hidden" name="isLeader" value="true" />
                          )}
                          <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
                            Foto profil
                            <input
                              name="photo"
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              className="w-full text-xs text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-[#edf5f0] file:px-3 file:py-2 file:font-semibold file:text-ocean"
                            />
                            <span className="font-normal text-slate-400">JPEG, PNG, atau WebP · maks. 3 MB</span>
                          </label>
                          <Button type="submit" size="sm" className="self-start">Simpan perubahan</Button>
                        </form>
                        <div className="flex flex-wrap gap-4">
                          {member.photo && (
                            <form action={removeOrganizationPhoto}>
                              <input type="hidden" name="id" value={member.id} />
                              <button type="submit" className="text-xs font-semibold text-slate-600 hover:underline">
                                Hapus foto
                              </button>
                            </form>
                          )}
                          {canAddMembers && (
                            <form action={deleteOrganizationMember}>
                              <input type="hidden" name="id" value={member.id} />
                              <button type="submit" className="text-xs font-semibold text-red-600 hover:underline">
                                Hapus anggota
                              </button>
                            </form>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-10">
        <section className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <h2 className="text-xl font-semibold mb-4">Add Publication</h2>
          <form action={addPublication} className="flex flex-col gap-3">
            <input name="title" placeholder="Publication Title" required className="border p-2 rounded" />
            <input name="authors" placeholder="Authors (e.g. PNS Lab)" required className="border p-2 rounded" />
            <input name="journal" placeholder="Journal / Conference Name" required className="border p-2 rounded" />
            <div className="flex gap-3">
              <input name="year" placeholder="Year" className="border p-2 rounded w-1/2" />
              <input name="type" placeholder="Type (e.g. JOURNAL)" className="border p-2 rounded w-1/2" />
            </div>
            <Button type="submit" className="mt-2">Save Publication</Button>
          </form>

          <div className="mt-8 space-y-4">
            <h3 className="font-medium text-slate-600">Existing Publications</h3>
            {db.publications.map((p) => (
              <div key={p.id} className="flex justify-between items-center bg-white p-3 rounded shadow-sm">
                <div>
                  <p className="text-sm font-semibold">{p.title}</p>
                  <p className="text-xs text-slate-500">{p.year} - {p.journal}</p>
                </div>
                <form action={async () => {
                  'use server';
                  await deleteItem('publications', p.id);
                }}>
                  <button type="submit" className="text-red-500 text-sm font-semibold hover:underline">Delete</button>
                </form>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <h2 className="text-xl font-semibold mb-4">Add News</h2>
          <form action={addNews} className="flex flex-col gap-3">
            <input name="title" placeholder="News Headline" required className="border p-2 rounded" />
            <input name="category" placeholder="Category (e.g. SEMINAR)" className="border p-2 rounded" />
            <input name="date" type="date" required className="border p-2 rounded" />
            <Button type="submit" className="mt-2">Save News</Button>
          </form>

          <div className="mt-8 space-y-4">
            <h3 className="font-medium text-slate-600">Existing News</h3>
            {db.newsItems.map((n) => (
              <div key={n.id} className="flex justify-between items-center bg-white p-3 rounded shadow-sm">
                <div>
                  <p className="text-sm font-semibold">{n.title}</p>
                  <p className="text-xs text-slate-500">{n.date} {n.month} {n.year}</p>
                </div>
                <form action={async () => {
                  'use server';
                  await deleteItem('newsItems', n.id);
                }}>
                  <button type="submit" className="text-red-500 text-sm font-semibold hover:underline">Delete</button>
                </form>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
