import Link from "next/link";
import { Header } from "@/components/header";
import { WineCard } from "@/components/wine-card";
import { getSupabase } from "@/lib/supabase";
import type { Wine } from "@/lib/types";

const demo: Wine[] = [
  { id: "1", name: "Altura Malbec", slug: "altura-malbec", vintage: "2022", price: 149.9, score: 94, producer: { name: "Bodega Horizonte" }, country: { name: "Argentina" }, category: { name: "Tinto" } },
  { id: "2", name: "Vale Cabernet Franc", slug: "vale-cabernet-franc", vintage: "2021", price: 189.9, score: 92, producer: { name: "Casa Andina" }, country: { name: "Argentina" }, category: { name: "Tinto" } },
  { id: "3", name: "Costa Chardonnay", slug: "costa-chardonnay", vintage: "2023", price: 119.9, producer: { name: "Viña del Mar" }, country: { name: "Chile" }, category: { name: "Branco" } },
  { id: "4", name: "Reserva de Pedra", slug: "reserva-de-pedra", vintage: "2020", price: 239.9, score: 95, producer: { name: "Quinta do Norte" }, country: { name: "Portugal" }, category: { name: "Tinto" } }
];

async function loadWines() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("wines")
      .select("id,name,slug,vintage,price,compare_at_price,image_url,short_description,score,score_source,stock,producer:producers(name),country:countries(name),region:regions(name),category:categories(name)")
      .eq("active", true)
      .order("featured", { ascending: false })
      .order("sort_order", { ascending: true })
      .limit(8);
    if (error || !data?.length) return demo;
    return data as unknown as Wine[];
  } catch {
    return demo;
  }
}

export default async function Home() {
  const wines = await loadWines();
  return (
    <main>
      <Header />
      <section className="hero">
        <div className="shell heroGrid">
          <div>
            <span className="eyebrow">CURADORIA GUILHWINES</span>
            <h1>Vinhos que contam<br/>histórias de origem.</h1>
            <p>Explore regiões, produtores e estilos com uma seleção criada para quem quer beber melhor — sem complicação.</p>
            <div className="heroActions"><Link className="primaryButton" href="/catalogo">EXPLORAR VINHOS</Link><Link className="textLink" href="/admin">PAINEL ADMIN →</Link></div>
          </div>
          <div className="heroArt"><div className="heroBottle">GW</div><div className="heroCircle" /></div>
        </div>
      </section>

      <section className="shell quickLinks">
        {["Argentina", "Malbec", "Até R$ 150", "90+ pontos", "Novidades"].map((x) => <Link href="/catalogo" key={x}>{x}<span>→</span></Link>)}
      </section>

      <section className="shell section">
        <div className="sectionHead"><div><span className="eyebrow dark">SELEÇÃO DA CASA</span><h2>Destaques da semana</h2></div><Link href="/catalogo">VER TODOS →</Link></div>
        <div className="wineGrid">{wines.slice(0,4).map((wine) => <WineCard wine={wine} key={wine.id} />)}</div>
      </section>

      <section className="editorial">
        <div className="shell editorialGrid">
          <div className="editorialCopy"><span className="eyebrow">REGIÃO EM DESTAQUE</span><h2>Altitude, pedra e amplitude térmica.</h2><p>Descubra vinhos de regiões de altitude, onde noites frias preservam frescor e dão personalidade às uvas.</p><Link className="primaryButton light" href="/catalogo">DESCOBRIR A SELEÇÃO</Link></div>
          <div className="landscape" aria-label="Paisagem de vinhedos" />
        </div>
      </section>

      <section className="shell section">
        <div className="sectionHead"><div><span className="eyebrow dark">PARA DESCOBRIR</span><h2>Mais procurados</h2></div></div>
        <div className="wineGrid">{wines.slice(0,4).reverse().map((wine) => <WineCard wine={wine} key={`b-${wine.id}`} />)}</div>
      </section>

      <footer className="footer"><div className="shell footerGrid"><div><div className="brand footerBrand">GUILH<span>WINES</span></div><p>Curadoria de vinhos, produtores e regiões.</p></div><div><strong>EXPLORE</strong><Link href="/catalogo">Catálogo</Link><Link href="/admin">Admin</Link></div><div><strong>CONTATO</strong><span>WhatsApp</span><span>Instagram</span></div></div></footer>
    </main>
  );
}
