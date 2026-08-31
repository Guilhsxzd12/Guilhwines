import { Header } from "@/components/header";
import { WineCard } from "@/components/wine-card";
import { getSupabase } from "@/lib/supabase";
import type { Wine } from "@/lib/types";

export default async function Catalogo() {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("wines")
    .select("id,name,slug,vintage,price,compare_at_price,image_url,score,stock,producer:producers(name),country:countries(name),region:regions(name),category:categories(name)")
    .eq("active", true)
    .order("sort_order");
  const wines = (data || []) as unknown as Wine[];

  return (
    <main>
      <Header/>
      <section className="catalogHero"><div className="shell"><span className="eyebrow">CATÁLOGO</span><h1>Encontre seu próximo vinho.</h1><p>Explore por origem, produtor, uva, estilo, pontuação e faixa de preço.</p></div></section>
      <section className="shell catalogLayout">
        <aside className="filters"><h3>Explorar por</h3>{["País", "Região", "Produtor", "Tipo", "Uva", "Pontuação", "Preço"].map(x=><button key={x}>{x}<span>＋</span></button>)}</aside>
        <div><div className="catalogTop"><strong>{wines.length} vinhos</strong><span>Ordenar: destaques</span></div>{wines.length ? <div className="wineGrid catalogGrid">{wines.map(w=><WineCard wine={w} key={w.id}/>)}</div> : <div className="emptyState"><h2>Seu catálogo está pronto para receber rótulos.</h2><p>Entre no painel admin e cadastre o primeiro vinho.</p></div>}</div>
      </section>
    </main>
  );
}
