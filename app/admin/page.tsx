import { getDb } from '@/lib/db';
import { addPublication, addNews, deleteItem, logout } from '../actions';
import { Button } from '@/components/ui/button';
import { requireAdmin } from '@/lib/require-admin';

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
