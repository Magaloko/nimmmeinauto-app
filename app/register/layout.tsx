import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registrieren · NimmMeinAuto",
  description: "Erstelle ein kostenloses NimmMeinAuto-Konto, um deine Inserate, Angebote und Nachrichten zu verwalten.",
  robots: { index: false, follow: false },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
