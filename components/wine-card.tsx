import Image from "next/image";
import type { Wine } from "@/lib/types";

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function WineCard({ wine }: { wine: Wine }) {
  return (
    <article className="wineCard">
      <div className="wineImage">
        {wine.score ? <span className="score">{wine.score}<small>pts</small></span> : null}
        {wine.image_url ? (
          <Image src={wine.image_url} alt={wine.name} width={260} height={360} className="bottle" />
        ) : (
          <div className="bottlePlaceholder"><span>GW</span></div>
        )}
      </div>
      <div className="wineMeta">{wine.category?.name || "Vinho"}{wine.country?.name ? ` • ${wine.country.name}` : ""}</div>
      <h3>{wine.name}{wine.vintage ? ` ${wine.vintage}` : ""}</h3>
      <p>{wine.producer?.name || "Seleção GuilhWines"}</p>
      <div className="priceRow">
        <strong>{wine.price ? money.format(wine.price) : "Consulte"}</strong>
        {wine.compare_at_price ? <s>{money.format(wine.compare_at_price)}</s> : null}
      </div>
      <button className="outlineButton">CONHECER</button>
    </article>
  );
}
