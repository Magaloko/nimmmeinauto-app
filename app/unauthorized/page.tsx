import Link from "next/link";
import { Navbar } from "@/components/navbar";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mb-6">
          <svg aria-hidden="true" className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M4.929 4.929l14.142 14.142M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Kein Zugriff</h1>
        <p className="text-foreground-muted mb-8 max-w-sm">
          Du hast keine Berechtigung für diese Seite. Bitte melde dich mit einem berechtigten Konto an.
        </p>
        <div className="flex gap-3">
          <Link
            href="/login"
            className="px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors text-sm"
          >
            Anmelden
          </Link>
          <Link
            href="/"
            className="px-5 py-2.5 border border-border text-foreground rounded-lg font-medium hover:border-primary hover:text-primary transition-colors text-sm"
          >
            Zur Startseite
          </Link>
        </div>
      </main>
    </div>
  );
}
