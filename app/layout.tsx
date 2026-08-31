import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GuilhWines | Curadoria de Vinhos",
  description: "Curadoria de vinhos, produtores, regiões e rótulos especiais."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
