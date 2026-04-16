import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Anmelden · NimmMeinAuto",
  description: "Melde dich bei NimmMeinAuto an, um deine Inserate, Angebote und Nachrichten zu verwalten.",
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
