import Link from "next/link";
import { Search, UserRound, Wine } from "lucide-react";

const menu = ["Países & regiões", "Produtores", "Tipos & uvas", "Pontuados", "Recomendados"];

export function Header() {
  return (
    <>
      <div className="announcement">Curadoria independente • Descubra novos rótulos e grandes produtores</div>
      <header className="header shell">
        <Link href="/" className="brand"><Wine size={23} /> GUILH<span>WINES</span></Link>
        <nav className="desktopNav">{menu.map((item) => <Link key={item} href="/catalogo">{item}</Link>)}</nav>
        <div className="headerActions"><Search size={19} /><Link href="/admin" aria-label="Admin"><UserRound size={19} /></Link></div>
      </header>
    </>
  );
}
