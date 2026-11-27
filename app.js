/* Data Club - app */
const SHEET_ID = "19bg-1XTt5DF_C3qvKXF6Nqs4MHYdTQ0xRzvd3V5RZw8";
const CSV = "https://docs.google.com/spreadsheets/d/"+SHEET_ID+"/gviz/tq?tqx=out:csv&sheet=Catalogo";
const IG = "data.club1";
const WA = "5493434068333";
const IG_FEED  = "https://feeds.behold.so/vnP93odCsrnOKANWCce0";
const IG_POSTS = 3;
const DESTACADOS = 4;

let DATA=[], filtro="todo", texto="";

const esc=s=>String(s).replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));
const num=v=>{const n=parseInt(String(v||"").replace(/[^0-9]/g,""),10);return isFinite(n)?n:0;};
const cap=s=>{s=String(s||"");return s?s.charAt(0).toUpperCase()+s.slice(1).toLowerCase():"";};
function money(v){
  if(v==null) return "";
  const s=String(v);
  const n=parseInt(s.replace(/[^0-9]/g,""),10);
  if(!isFinite(n)||n===0) return s.trim();
  return "$"+n.toLocaleString("es-AR");
}
function nombre(d){
  const art = d.tipo.toLowerCase()==="short" ? "el short" : "la camiseta";
  const cal = d.calidad ? " ("+d.calidad+")" : "";
  return art+" de "+d.club+" "+d.modelo+cal;
}

const FALLBACK = [{"orden": 1, "mostrar": "SI", "club": "River Plate", "modelo": "Titular", "calidad": "Estándar", "tipo": "Camiseta", "talles": "S · M · L · XL · XXL", "precio": 40000, "foto": "", "nota": ""}, {"orden": 2, "mostrar": "SI", "club": "River Plate", "modelo": "Tercera", "calidad": "Estándar", "tipo": "Camiseta", "talles": "S · M · XL · XXL", "precio": 40000, "foto": "", "nota": ""}, {"orden": 3, "mostrar": "SI", "club": "Boca Juniors", "modelo": "Titular", "calidad": "Estándar", "tipo": "Camiseta", "talles": "M · L · XL · XXL", "precio": 40000, "foto": "", "nota": ""}, {"orden": 4, "mostrar": "SI", "club": "Boca Juniors", "modelo": "Suplente", "calidad": "Estándar", "tipo": "Camiseta", "talles": "S · M · XL", "precio": 40000, "foto": "", "nota": ""}, {"orden": 5, "mostrar": "SI", "club": "Racing", "modelo": "Titular", "calidad": "Estándar", "tipo": "Camiseta", "talles": "L · XL · XXL", "precio": 40000, "foto": "", "nota": ""}, {"orden": 6, "mostrar": "SI", "club": "Manchester City", "modelo": "Titular (Enzo)", "calidad": "Estándar", "tipo": "Camiseta", "talles": "L · XL · XXL", "precio": 40000, "foto": "", "nota": ""}, {"orden": 7, "mostrar": "SI", "club": "Boca Juniors", "modelo": "Titular", "calidad": "Premium", "tipo": "Camiseta", "talles": "M · L · XXL", "precio": 47000, "foto": "", "nota": ""}, {"orden": 8, "mostrar": "SI", "club": "Juventus", "modelo": "Titular", "calidad": "Premium", "tipo": "Camiseta", "talles": "M · L · XL · XXL", "precio": 47000, "foto": "", "nota": ""}, {"orden": 9, "mostrar": "SI", "club": "Liverpool", "modelo": "Suplente", "calidad": "Premium", "tipo": "Camiseta", "talles": "S · M", "precio": 47000, "foto": "", "nota": ""}, {"orden": 10, "mostrar": "SI", "club": "Barcelona", "modelo": "Titular", "calidad": "Premium", "tipo": "Camiseta", "talles": "M · L · XL · XXL", "precio": 47000, "foto": "", "nota": ""}, {"orden": 11, "mostrar": "SI", "club": "Barcelona", "modelo": "Titular G5", "calidad": "Premium", "tipo": "Camiseta", "talles": "XL", "precio": 47000, "foto": "", "nota": ""}, {"orden": 12, "mostrar": "SI", "club": "Real Madrid", "modelo": "Titular", "calidad": "Premium", "tipo": "Camiseta", "talles": "XXL", "precio": 47000, "foto": "", "nota": ""}, {"orden": 13, "mostrar": "SI", "club": "Real Madrid", "modelo": "Suplente", "calidad": "Premium", "tipo": "Camiseta", "talles": "L", "precio": 47000, "foto": "", "nota": ""}, {"orden": 14, "mostrar": "SI", "club": "Arsenal", "modelo": "Titular", "calidad": "Premium", "tipo": "Camiseta", "talles": "XXL", "precio": 47000, "foto": "", "nota": ""}, {"orden": 15, "mostrar": "SI", "club": "Manchester United", "modelo": "Retro blanca", "calidad": "Premium", "tipo": "Camiseta", "talles": "M · XL", "precio": 47000, "foto": "", "nota": ""}, {"orden": 16, "mostrar": "SI", "club": "Manchester United", "modelo": "Retro roja", "calidad": "Premium", "tipo": "Camiseta", "talles": "M · XL · XXL", "precio": 47000, "foto": "", "nota": ""}, {"orden": 17, "mostrar": "SI", "club": "Manchester United", "modelo": "Titular", "calidad": "Premium", "tipo": "Camiseta", "talles": "XXL", "precio": 47000, "foto": "", "nota": ""}, {"orden": 18, "mostrar": "SI", "club": "Bayern Munich", "modelo": "Titular", "calidad": "Premium", "tipo": "Camiseta", "talles": "L · XL", "precio": 47000, "foto": "", "nota": ""}, {"orden": 19, "mostrar": "SI", "club": "Atlético Madrid", "modelo": "Titular", "calidad": "Premium", "tipo": "Camiseta", "talles": "L · XL", "precio": 47000, "foto": "", "nota": ""}, {"orden": 20, "mostrar": "SI", "club": "PSG", "modelo": "Suplente", "calidad": "Premium", "tipo": "Camiseta", "talles": "L · XXL", "precio": 47000, "foto": "", "nota": ""}, {"orden": 21, "mostrar": "SI", "club": "España", "modelo": "Titular", "calidad": "Premium", "tipo": "Camiseta", "talles": "M · L", "precio": 47000, "foto": "", "nota": ""}, {"orden": 22, "mostrar": "SI", "club": "Inter", "modelo": "Suplente", "calidad": "Premium", "tipo": "Camiseta", "talles": "M · L", "precio": 47000, "foto": "", "nota": ""}, {"orden": 23, "mostrar": "SI", "club": "Inter", "modelo": "Titular", "calidad": "Premium", "tipo": "Camiseta", "talles": "XXL", "precio": 47000, "foto": "", "nota": ""}, {"orden": 24, "mostrar": "SI", "club": "Milan", "modelo": "Titular", "calidad": "Premium", "tipo": "Camiseta", "talles": "L · XL · XXL", "precio": 47000, "foto": "", "nota": ""}, {"orden": 25, "mostrar": "SI", "club": "Portugal", "modelo": "Titular", "calidad": "Premium", "tipo": "Camiseta", "talles": "M · L · XL · XXL", "precio": 47000, "foto": "", "nota": ""}, {"orden": 26, "mostrar": "SI", "club": "Chelsea", "modelo": "Titular", "calidad": "Premium", "tipo": "Camiseta", "talles": "L · XXL", "precio": 47000, "foto": "", "nota": ""}, {"orden": 27, "mostrar": "SI", "club": "Chelsea", "modelo": "Suplente", "calidad": "Premium", "tipo": "Camiseta", "talles": "M · XL", "precio": 47000, "foto": "", "nota": ""}, {"orden": 28, "mostrar": "SI", "club": "Brasil", "modelo": "Titular", "calidad": "Premium", "tipo": "Camiseta", "talles": "M · L · XL", "precio": 47000, "foto": "", "nota": ""}, {"orden": 29, "mostrar": "SI", "club": "Roma", "modelo": "Titular", "calidad": "Premium", "tipo": "Camiseta", "talles": "XL", "precio": 47000, "foto": "", "nota": ""}, {"orden": 30, "mostrar": "SI", "club": "Portugal", "modelo": "Titular", "calidad": "Premium", "tipo": "Short", "talles": "L", "precio": 42000, "foto": "", "nota": ""}, {"orden": 31, "mostrar": "SI", "club": "Manchester United", "modelo": "Titular blanco", "calidad": "Premium", "tipo": "Short", "talles": "XXL", "precio": 42000, "foto": "", "nota": ""}, {"orden": 32, "mostrar": "SI", "club": "PSG", "modelo": "Titular", "calidad": "Premium", "tipo": "Short", "talles": "XL", "precio": 42000, "foto": "", "nota": ""}, {"orden": 33, "mostrar": "SI", "club": "Tottenham", "modelo": "Titular", "calidad": "Premium", "tipo": "Short", "talles": "L", "precio": 42000, "foto": "", "nota": ""}, {"orden": 34, "mostrar": "SI", "club": "España", "modelo": "Titular", "calidad": "Premium", "tipo": "Short", "talles": "XXL", "precio": 42000, "foto": "", "nota": ""}, {"orden": 35, "mostrar": "SI", "club": "Real Madrid", "modelo": "Titular", "calidad": "Premium", "tipo": "Short", "talles": "M", "precio": 42000, "foto": "", "nota": ""}];

function parseCSV(text){
  const rows=[]; let row=[], cur="", q=false;
  for(let i=0;i<text.length;i++){
    const c=text[i];
    if(q){
      if(c==='"'){ if(text[i+1]==='"'){cur+='"';i++;} else q=false; }
      else cur+=c;
    } else if(c==='"') q=true;
    else if(c===','){ row.push(cur); cur=""; }
    else if(c==='\n'){ row.push(cur); rows.push(row); row=[]; cur=""; }
    else if(c!=='\r') cur+=c;
  }
  if(cur.length||row.length){ row.push(cur); rows.push(row); }
  return rows.filter(r=>r.some(c=>c.trim()!==""));
}

function fromRows(rows){
  const head=rows[0].map(h=>h.trim().toLowerCase());
  const ix=n=>head.findIndex(h=>h.startsWith(n));
  const c={orden:ix("orden"),mostrar:ix("mostrar"),club:ix("club"),modelo:ix("modelo"),
    calidad:ix("calidad"),tipo:ix("tipo"),talles:ix("talles"),precio:ix("precio"),
    foto:ix("foto"),nota:ix("nota")};
  return rows.slice(1).map(r=>({
    orden:parseFloat(r[c.orden])||999, mostrar:(r[c.mostrar]||"SI").trim(),
    club:(r[c.club]||"").trim(), modelo:(r[c.modelo]||"").trim(),
    calidad:(r[c.calidad]||"").trim(), tipo:(r[c.tipo]||"").trim(),
    talles:(r[c.talles]||"").trim(), precio:(r[c.precio]||"").trim(),
    foto:(r[c.foto]||"").trim(), nota:(r[c.nota]||"").trim()
  }));
}
const NOIMG=`<div class="noimg"><svg width="46" height="46" viewBox="0 0 24 24" fill="none"
  stroke="currentColor" stroke-width="1.4"><path d="M12 2l8 3v6c0 5-3.4 9-8 11-4.6-2-8-6-8-11V5z"/></svg>
  <span>Foto en camino</span></div>`;

function visibles(){
  return DATA.filter(d=>{
    if(String(d.mostrar).toUpperCase().indexOf("NO")===0) return false;
    if(!d.club) return false;
    if(filtro==="camiseta"&&d.tipo.toLowerCase()!=="camiseta") return false;
    if(filtro==="short"&&d.tipo.toLowerCase()!=="short") return false;
    if(filtro==="est\u00e1ndar"&&d.calidad.toLowerCase().indexOf("est")!==0) return false;
    if(filtro==="premium"&&d.calidad.toLowerCase().indexOf("pre")!==0) return false;
    if(texto){
      const t=(d.club+" "+d.modelo+" "+d.tipo+" "+d.calidad+" "+d.talles).toLowerCase();
      if(t.indexOf(texto)<0) return false;
    }
    return true;
  }).sort((a,b)=>a.orden-b.orden);
}
function tarjeta(d){
  const sizes=d.talles.split(/[\u00b7,/|]+/).map(s=>s.trim()).filter(Boolean);
  const pre=d.calidad.toLowerCase().indexOf("pre")===0;
  const img=d.foto
    ? '<img src="'+esc(d.foto)+'" alt="'+esc(d.club+" "+d.modelo)+'" loading="lazy" '
      +'onerror="this.parentNode.innerHTML=NOIMG">'
    : NOIMG;
  return '<article class="card"><div class="ph">'+img
    +(d.nota?'<div class="tag">'+esc(d.nota)+'</div>':'')
    +'<div class="qual'+(pre?' pre':'')+'">'+esc(d.calidad||d.tipo)+'</div></div>'
    +'<div class="body"><div class="club">'+esc(d.club)+'</div>'
    +'<div class="model">'+esc(d.modelo)+(d.tipo.toLowerCase()==="short"?" \u00b7 Short":"")+'</div>'
    +'<div class="sizes">'
    +(sizes.length
      ? sizes.map(s=>'<button class="sz" data-club="'+esc(d.club)+'" data-modelo="'+esc(d.modelo)
          +'" data-cal="'+esc(d.calidad)+'" data-tipo="'+esc(d.tipo)+'" data-talle="'+esc(s)
          +'" data-precio="'+num(d.precio)+'">'+esc(s)+'</button>').join("")
      : '<button class="sz" data-consulta="1" data-prenda="'+esc(nombre(d))+'">Consultar</button>')
    +'</div>'
    +'<div class="hint">'+(sizes.length?"Toc\u00e1 tu talle para agregarlo":"Escribinos por WhatsApp")+'</div>'
    +'<div class="price">'+esc(money(d.precio))+'</div></div></article>';
}
function chips(){
  const c=document.getElementById("chips"); if(!c) return;
  c.innerHTML=[["todo","Todo"],["camiseta","Camisetas"],["short","Shorts"],
    ["est\u00e1ndar","Est\u00e1ndar"],["premium","Premium"]]
    .map(([k,l])=>'<button class="chip" data-k="'+k+'" aria-pressed="'+(k===filtro)+'">'+l+'</button>').join("");
}
function render(){
  const grid=document.getElementById("grid");
  if(grid){
    const list=visibles(), st=document.getElementById("state");
    document.getElementById("count").textContent =
      list.length+(list.length===1?" modelo disponible":" modelos disponibles");
    if(!list.length){
      grid.innerHTML=""; st.style.display="block";
      st.textContent="No encontramos nada con esa b\u00fasqueda. Prob\u00e1 con el nombre del club.";
    } else {
      st.style.display="none";
      grid.innerHTML=list.map(tarjeta).join("");
    }
  }
  const dest=document.getElementById("destacados");
  if(dest){
    const l=visibles().slice(0,DESTACADOS);
    dest.innerHTML=l.map(tarjeta).join("");
  }
}

/* ---------- carrito ---------- */
const CART_KEY="dc_cart_v1";
let CART=[];
function cartLoad(){
  try{const r=localStorage.getItem(CART_KEY);CART=r?JSON.parse(r):[];if(!Array.isArray(CART))CART=[];}
  catch(e){CART=[];}
}
function cartSave(){ try{localStorage.setItem(CART_KEY,JSON.stringify(CART));}catch(e){} }
function titulo(x){ return cap(x.tipo||"Prenda")+" "+x.club+" "+x.modelo+(x.cal?" ("+x.cal+")":""); }
function cartAdd(o){
  const k=[o.club,o.modelo,o.cal,o.tipo,o.talle].join("|");
  const f=CART.filter(x=>x.k===k)[0];
  if(f){ f.q++; } else { CART.push({k:k,club:o.club,modelo:o.modelo,cal:o.cal,
    tipo:o.tipo,talle:o.talle,precio:o.precio,q:1}); }
  cartSave(); cartPaint();
}
function cartQty(k,d){
  const f=CART.filter(x=>x.k===k)[0]; if(!f) return;
  f.q+=d; if(f.q<1) CART=CART.filter(x=>x.k!==k);
  cartSave(); cartPaint(); if(!CART.length) sheet(false);
}
function cartDel(k){ CART=CART.filter(x=>x.k!==k); cartSave(); cartPaint(); if(!CART.length) sheet(false); }
function cartN(){ return CART.reduce((a,x)=>a+x.q,0); }
function cartTotal(){ return CART.reduce((a,x)=>a+x.precio*x.q,0); }
function cartPaint(){
  const fab=document.getElementById("cartfab"); if(!fab) return;
  document.getElementById("cartn").textContent=cartN();
  fab.classList.toggle("on",CART.length>0);
  const it=document.getElementById("items"), ft=document.getElementById("foot");
  if(!CART.length){ it.innerHTML='<p class="empty">Todav\u00eda no agregaste nada a tu pedido.</p>';
    ft.innerHTML=""; return; }
  it.innerHTML=CART.map(x=>
     '<div class="it"><div class="it-n">'
    +'<div class="it-t">'+esc(titulo(x))+'</div>'
    +'<div class="it-s">Talle '+esc(x.talle||"a confirmar")
    +(x.precio?' \u00b7 '+money(x.precio)+' c/u':'')+'</div>'
    +'<div class="qty">'
    +'<button data-q="-1" data-k="'+esc(x.k)+'" aria-label="Quitar uno">\u2212</button>'
    +'<span>'+x.q+'</span>'
    +'<button data-q="1" data-k="'+esc(x.k)+'" aria-label="Agregar uno">+</button>'
    +'<button class="rm" data-del="'+esc(x.k)+'">Quitar</button>'
    +'</div></div>'
    +'<div class="it-p">'+(x.precio?money(x.precio*x.q):"a confirmar")+'</div></div>').join("");
  const t=cartTotal();
  ft.innerHTML='<div class="tot"><span>Total</span><b>'+(t?money(t):"a confirmar")+'</b></div>'
    +'<button class="btn" id="pedir">Hacer el pedido por WhatsApp</button>'
    +'<button class="seguir" id="seguir">Seguir mirando</button>';
}
function sheet(on){
  const sh=document.getElementById("sheet"); if(!sh) return;
  sh.classList.toggle("on",on);
  document.getElementById("ov").classList.toggle("on",on);
  document.body.style.overflow = on ? "hidden" : "";
}
function waOpen(msg){
  if(!WA){ toast("Falta cargar el n\u00famero de WhatsApp"); return; }
  const a=document.createElement("a");
  a.href="https://wa.me/"+WA+"?text="+encodeURIComponent(msg);
  a.target="_blank"; a.rel="noopener";
  document.body.appendChild(a); a.click(); a.remove();
}
function pedido(){
  const L=CART.map((x,i)=>(i+1)+") "+titulo(x)+" \u00b7 Talle "+(x.talle||"a confirmar")
      +" \u00b7 x"+x.q+(x.precio?" \u00b7 "+money(x.precio*x.q):""));
  let m="Hola Data Club! Te hago un pedido:\n\n"+L.join("\n");
  const t=cartTotal();
  if(t) m+="\n\nTotal: "+money(t);
  return m;
}
function toast(m){
  const t=document.getElementById("toast"); if(!t) return;
  t.textContent=m; t.classList.add("on");
  clearTimeout(t._h); t._h=setTimeout(()=>t.classList.remove("on"),2600);
}

/* ---------- instagram ---------- */
async function instagram(){
  const box=document.getElementById("igbox");
  if(!box||!IG_FEED) return;
  try{
    const r=await fetch(IG_FEED,{cache:"no-store"});
    if(!r.ok) throw new Error(r.status);
    const d=await r.json();
    const posts=((d&&d.posts)||(Array.isArray(d)?d:[])).slice(0,IG_POSTS);
    if(!posts.length) throw new Error("sin posts");
    const cel=posts.map(p=>{
      const z=p.sizes||{};
      const img=(z.medium&&z.medium.mediaUrl)||(z.full&&z.full.mediaUrl)||(z.small&&z.small.mediaUrl)
                ||p.thumbnailUrl||p.mediaUrl||"";
      const vid=/VIDEO|REEL/i.test(p.mediaType||"");
      const capt=esc(((p.prunedCaption||p.caption||"").replace(/\s+/g," ")).slice(0,100));
      const url=esc(p.permalink||("https://instagram.com/"+IG));
      return '<a class="igp" href="'+url+'" target="_blank" rel="noopener" title="'+capt+'">'
        +(img?'<img src="'+esc(img)+'" alt="'+(capt||"Publicaci\u00f3n de Data Club")+'" loading="lazy">':"")
        +(vid?'<span class="vid">VIDEO</span>':"")+'</a>';
    }).join("");
    box.innerHTML='<div class="iggrid">'+cel+'</div>'
      +'<a class="btn igmore" href="https://instagram.com/'+IG+'" target="_blank" rel="noopener">Ver m\u00e1s en @'+IG+'</a>';
  }catch(err){ /* queda el bloque por defecto */ }
}

/* ---------- eventos ---------- */
document.addEventListener("click",e=>{
  const chip=e.target.closest(".chip");
  if(chip){ filtro=chip.dataset.k; chips(); render(); return; }
  if(e.target.closest("#cartfab")){ sheet(true); return; }
  if(e.target.closest("#ov")||e.target.closest("#shx")||e.target.closest("#seguir")){ sheet(false); return; }
  if(e.target.closest("#pedir")){ waOpen(pedido()); return; }
  const q=e.target.closest("[data-q]");
  if(q){ cartQty(q.dataset.k,parseInt(q.dataset.q,10)); return; }
  const dl=e.target.closest("[data-del]");
  if(dl){ cartDel(dl.dataset.del); return; }
  const sz=e.target.closest(".sz");
  if(sz){
    if(sz.dataset.consulta){ waOpen("Hola! Me interesa "+sz.dataset.prenda+"."); return; }
    cartAdd({club:sz.dataset.club,modelo:sz.dataset.modelo,cal:sz.dataset.cal,
             tipo:sz.dataset.tipo,talle:sz.dataset.talle,precio:num(sz.dataset.precio)});
    toast("Agregado a tu pedido \u00b7 talle "+sz.dataset.talle);
  }
});
document.addEventListener("keydown",e=>{ if(e.key==="Escape") sheet(false); });
const qin=document.getElementById("q");
if(qin) qin.addEventListener("input",e=>{ texto=e.target.value.trim().toLowerCase(); render(); });

(async function(){
  cartLoad(); cartPaint();
  instagram();
  if(!document.getElementById("grid")&&!document.getElementById("destacados")) return;
  chips();
  try{
    const r=await fetch(CSV+"&_="+Date.now(),{cache:"no-store"});
    if(!r.ok) throw new Error(r.status);
    const rows=parseCSV(await r.text());
    if(rows.length<2) throw new Error("vacio");
    DATA=fromRows(rows);
  }catch(err){ DATA=FALLBACK; }
  render();
})();
