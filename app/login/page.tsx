import { login } from '../actions';
import { Button } from '@/components/ui/button';

export default async function LoginPage(props: { searchParams: Promise<{ error?: string }> }) {
  const searchParams = await props.searchParams;
  const error = searchParams.error;

  return (
    <div className="flex items-center justify-center min-h-[70vh] bg-mist">
      <div className="bg-white p-10 rounded-3xl border border-slate-200 w-full max-w-[420px] shadow-sm">
        <h1 className="text-2xl font-semibold mb-2 text-ink text-center">Admin Login</h1>
        <p className="text-sm text-slate-500 mb-8 text-center">Please enter the password to continue.</p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">
            {error === 'configuration'
              ? 'Admin login is not configured. Set the required server secrets before deployment.'
              : 'Incorrect password. Please try again.'}
          </div>
        )}

        <form action={login} className="flex flex-col gap-4">
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            required 
            className="border border-slate-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-ocean" 
          />
          <Button type="submit" size="lg" className="rounded-xl w-full">Login</Button>
        </form>
      </div>
    </div>
  );
}
