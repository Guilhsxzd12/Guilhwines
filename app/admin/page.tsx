"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";
import { LogOut, Plus, Save, Trash2, Wine } from "lucide-react";

type TableName = "wines" | "producers" | "categories" | "countries" | "regions" | "grapes" | "banners";
type Row = Record<string, any>;

const sections: { key: TableName; label: string }[] = [
  { key: "wines", label: "Vinhos" },
  { key: "producers", label: "Bodegas" },
  { key: "categories", label: "Categorias" },
  { key: "countries", label: "Países" },
  { key: "regions", label: "Regiões" },
  { key: "grapes", label: "Uvas" },
  { key: "banners", label: "Banners" }
];

const fields: Record<TableName, { key: string; label: string; type?: string }[]> = {
  wines: [
    {key:"name",label:"Nome"},{key:"slug",label:"Slug"},{key:"vintage",label:"Safra"},{key:"sku",label:"SKU"},{key:"price",label:"Preço",type:"number"},{key:"compare_at_price",label:"Preço anterior",type:"number"},{key:"stock",label:"Estoque",type:"number"},{key:"score",label:"Pontuação",type:"number"},{key:"score_source",label:"Crítico/Fonte"},{key:"image_url",label:"URL da imagem"},{key:"short_description",label:"Descrição curta"}
  ],
  producers: [{key:"name",label:"Nome"},{key:"slug",label:"Slug"},{key:"logo_url",label:"Logo URL"},{key:"description",label:"Descrição"}],
  categories: [{key:"name",label:"Nome"},{key:"slug",label:"Slug"},{key:"description",label:"Descrição"}],
  countries: [{key:"name",label:"Nome"},{key:"slug",label:"Slug"},{key:"flag_emoji",label:"Bandeira"}],
  regions: [{key:"name",label:"Nome"},{key:"slug",label:"Slug"},{key:"country_id",label:"ID do país"}],
  grapes: [{key:"name",label:"Nome"},{key:"slug",label:"Slug"},{key:"description",label:"Descrição"}],
  banners: [{key:"title",label:"Título"},{key:"subtitle",label:"Subtítulo"},{key:"image_url",label:"Imagem URL"},{key:"button_label",label:"Texto botão"},{key:"button_href",label:"Link botão"},{key:"placement",label:"Posição"}]
};

function slugify(v:string){return v.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");}

export default function AdminPage(){
  const supabase = useMemo(()=>getSupabase(),[]);
  const [session,setSession]=useState<any>(null);
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [message,setMessage]=useState("");
  const [active,setActive]=useState<TableName>("wines");
  const [rows,setRows]=useState<Row[]>([]);
  const [editing,setEditing]=useState<Row|null>(null);
  const [loading,setLoading]=useState(false);

  useEffect(()=>{supabase.auth.getSession().then(({data})=>setSession(data.session)); const {data:{subscription}}=supabase.auth.onAuthStateChange((_e,s)=>setSession(s)); return()=>subscription.unsubscribe();},[supabase]);
  useEffect(()=>{if(session) load();},[active,session]);

  async function login(e:FormEvent){
    e.preventDefault(); setMessage("");
    const {data,error}=await supabase.auth.signInWithPassword({email,password});
    if(error){setMessage(error.message);return;}
    const {data:admin}=await supabase.from("admin_users").select("user_id").eq("user_id",data.user.id).maybeSingle();
    if(!admin){await supabase.auth.signOut();setMessage("Usuário autenticado, mas ainda não foi liberado como administrador.");return;}
    setSession(data.session);
  }

  async function load(){setLoading(true);const {data,error}=await supabase.from(active).select("*").order("created_at",{ascending:false});setRows(data||[]);if(error)setMessage(error.message);setLoading(false);}
  function startNew(){const base:Row={active:true}; if(active==="wines")Object.assign(base,{stock:0,currency:"BRL",bottle_ml:750,featured:false,new_arrival:false,bestseller:false}); if(active==="banners")Object.assign(base,{placement:"home_hero"}); setEditing(base);}
  async function save(e:FormEvent){
    e.preventDefault(); if(!editing)return; setLoading(true);
    const payload={...editing}; if(payload.name && !payload.slug)payload.slug=slugify(payload.name); delete payload.id; delete payload.created_at; delete payload.updated_at;
    const q=editing.id?supabase.from(active).update(payload).eq("id",editing.id):supabase.from(active).insert(payload);
    const {error}=await q; setLoading(false);
    if(error){setMessage(error.message);return;} setEditing(null); setMessage("Salvo com sucesso."); load();
  }
  async function remove(id:string){if(!confirm("Excluir este item?"))return;const {error}=await supabase.from(active).delete().eq("id",id);if(error)setMessage(error.message);else load();}

  if(!session)return <main className="adminLogin"><form onSubmit={login} className="loginCard"><div className="brand"><Wine size={22}/> GUILH<span>WINES</span></div><h1>Painel administrativo</h1><p>Entre com um usuário liberado no Supabase.</p><label>E-mail<input value={email} onChange={e=>setEmail(e.target.value)} type="email" required/></label><label>Senha<input value={password} onChange={e=>setPassword(e.target.value)} type="password" required/></label><button className="primaryButton" type="submit">ENTRAR</button>{message&&<div className="adminMessage">{message}</div>}<Link href="/">← Voltar ao site</Link></form></main>;

  return <main className="adminShell">
    <aside className="adminSide"><div className="brand"><Wine size={20}/> GUILH<span>WINES</span></div><small>ADMINISTRAÇÃO</small>{sections.map(s=><button className={active===s.key?"active":""} key={s.key} onClick={()=>{setActive(s.key);setEditing(null)}}>{s.label}</button>)}<div className="adminSpacer"/><Link href="/">Ver site</Link><button onClick={()=>supabase.auth.signOut()}><LogOut size={16}/> Sair</button></aside>
    <section className="adminMain"><header><div><span className="eyebrow dark">CATÁLOGO</span><h1>{sections.find(s=>s.key===active)?.label}</h1></div><button className="primaryButton" onClick={startNew}><Plus size={17}/> NOVO ITEM</button></header>{message&&<div className="adminMessage">{message}</div>}<div className="adminTable"><div className="adminTableHead"><span>Nome / título</span><span>Status</span><span>Ações</span></div>{loading?<p>Carregando...</p>:rows.map(row=><div className="adminRow" key={row.id}><div><strong>{row.name||row.title||row.id}</strong><small>{row.slug||row.placement||""}</small></div><span className={row.active===false?"status off":"status"}>{row.active===false?"Inativo":"Ativo"}</span><div className="rowActions"><button onClick={()=>setEditing(row)}>Editar</button><button aria-label="Excluir" onClick={()=>remove(row.id)}><Trash2 size={16}/></button></div></div>)}</div></section>
    {editing&&<div className="drawerOverlay" onClick={()=>setEditing(null)}><form className="drawer" onSubmit={save} onClick={e=>e.stopPropagation()}><div className="drawerHead"><h2>{editing.id?"Editar":"Novo"} {sections.find(s=>s.key===active)?.label}</h2><button type="button" onClick={()=>setEditing(null)}>×</button></div><div className="drawerFields">{fields[active].map(f=><label key={f.key}>{f.label}<input type={f.type||"text"} step={f.type==="number"?"0.01":undefined} value={editing[f.key]??""} onChange={e=>setEditing({...editing,[f.key]:f.type==="number"&&e.target.value!==""?Number(e.target.value):e.target.value})}/></label>)}<label className="check"><input type="checkbox" checked={editing.active!==false} onChange={e=>setEditing({...editing,active:e.target.checked})}/> Ativo</label></div><button disabled={loading} className="primaryButton" type="submit"><Save size={17}/> SALVAR</button></form></div>}
  </main>;
}
