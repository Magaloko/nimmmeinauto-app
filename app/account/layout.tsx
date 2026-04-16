import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mein Konto · NimmMeinAuto",
  description: "Dein persönlicher Bereich bei NimmMeinAuto – Inserate, Angebote, Nachrichten.",
  robots: { index: false, follow: false },
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return children;
}
