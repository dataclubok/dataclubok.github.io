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
function slug(d){
  return (d.club+"-"+d.modelo+"-"+d.tipo+"-"+(d.calidad||"")).toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");
}
/* "S \u00b7 M(1) \u00b7 XL" -> [{t:"S",q:null},{t:"M",q:1},{t:"XL",q:null}] */
/* "M" = 1 unidad. "M(3)" = 3. "M(0)" = sin stock, no se muestra. */
function talles(d){
  return String(d.talles||"").split(/[\u00b7,/|]+/).map(x=>x.trim()).filter(Boolean).map(x=>{
    const m=x.match(/^(.+?)\s*\((\d+)\)$/);
    return m ? {t:m[1].trim(), q:parseInt(m[2],10), exp:true} : {t:x, q:1, exp:false};
  }).filter(x=>x.q>0);
}
/* stock de un talle, buscado en los datos vivos; si no esta, el guardado */
function stockDe(x){
  const d=DATA.filter(p=>p.club===x.club&&p.modelo===x.modelo
    &&(p.calidad||"")===(x.cal||"")&&p.tipo===x.tipo)[0];
  if(d){ const t=talles(d).filter(z=>z.t===x.talle)[0]; return t?t.q:0; }
  return x.max||1;
}
let FOTOS={};
const dUrl=(id,w)=>"https://lh3.googleusercontent.com/d/"+id+"=w"+w;
/* URLs propias de la planilla, si no las hay usa fotos.json (ids de Drive) */
function fotos(d,w){
  const own=String(d.foto||"").split(/[\s,]+/).map(x=>x.trim()).filter(x=>/^https?:/i.test(x));
  if(own.length) return own;
  return (FOTOS[slug(d)]||[]).map(id=>dUrl(id,w||700));
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
    foto:ix("foto"),nota:ix("nota"),descripcion:ix("descrip"),dorsal:ix("dorsal")};
  return rows.slice(1).map(r=>({
    orden:parseFloat(r[c.orden])||999, mostrar:(r[c.mostrar]||"SI").trim(),
    club:(r[c.club]||"").trim(), modelo:(r[c.modelo]||"").trim(),
    calidad:(r[c.calidad]||"").trim(), tipo:(r[c.tipo]||"").trim(),
    talles:(r[c.talles]||"").trim(), precio:(r[c.precio]||"").trim(),
    foto:(r[c.foto]||"").trim(), nota:(r[c.nota]||"").trim(),
    descripcion:(r[c.descripcion]||"").trim(),
    dorsal:(r[c.dorsal]||"").trim()
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
    if(filtro==="retro"&&d.calidad.toLowerCase().indexOf("ret")!==0) return false;
    if(filtro==="dorsal"&&!d.dorsal) return false;
    if(filtro==="lisa"&&d.dorsal) return false;
    if(texto){
      const t=(d.club+" "+d.modelo+" "+d.tipo+" "+d.calidad+" "+d.talles+" "+(d.dorsal||"")).toLowerCase();
      if(t.indexOf(texto)<0) return false;
    }
    return true;
  }).sort((a,b)=>a.orden-b.orden);
}
function qualCls(d){
  const c=(d.calidad||"").toLowerCase();
  if(c.indexOf("pre")===0) return " pre";
  if(c.indexOf("ret")===0) return " ret";
  return "";
}
function botonTalle(d,x){
  const ult=x.exp&&x.q===1;
  return '<button class="sz'+(ult?" last":"")+'" aria-pressed="false" data-club="'+esc(d.club)
    +'" data-modelo="'+esc(d.modelo)+'" data-cal="'+esc(d.calidad)+'" data-tipo="'+esc(d.tipo)
    +'" data-talle="'+esc(x.t)+'" data-precio="'+num(d.precio)+'" data-stock="'+x.q+'"'
    +(ult?' title="\u00daltimo disponible"':'')+'>'+esc(x.t)+'</button>';
}
function ultimos(ts){
  const u=ts.filter(x=>x.exp&&x.q===1).map(x=>x.t);
  if(!u.length) return "";
  return '<div class="last-l">'+(u.length===1?"\u00daltimo en talle ":"\u00daltimos en talle ")
    +esc(u.join(" \u00b7 "))+'</div>';
}
function tarjeta(d){
  const ts=talles(d), fs=fotos(d,500);
  const q=qualCls(d);
  const img=fs.length
    ? '<img src="'+esc(fs[0])+'" alt="'+esc(d.club+" "+d.modelo)+'" loading="lazy" '
      +'onerror="this.parentNode.innerHTML=NOIMG">'
    : NOIMG;
  return '<article class="card"><button class="ph" data-ficha="'+esc(slug(d))+'" '
    +'aria-label="Ver '+esc(d.club+" "+d.modelo)+'">'+img
    +(d.nota?'<div class="tag">'+esc(d.nota)+'</div>':'')
    +(fs.length>1?'<div class="nfotos">'+fs.length+' fotos</div>':'')
    +'<div class="qual'+q+'">'+esc(d.calidad||d.tipo)+'</div></button>'
    +'<div class="body">'
    +'<button class="club lk" data-ficha="'+esc(slug(d))+'">'+esc(d.club)+'</button>'
    +'<div class="model">'+esc(d.modelo)+(d.tipo.toLowerCase()==="short"?" \u00b7 Short":"")+'</div>'
    +(dorsalTxt(d)?'<div class="dors">Dorsal '+esc(dorsalTxt(d))+'</div>':'')
    +'<div class="sizes">'
    +(ts.length ? ts.map(x=>botonTalle(d,x)).join("")
      : '<button class="sz" data-consulta="1" data-prenda="'+esc(nombre(d))+'">Consultar</button>')
    +'</div>'+ultimos(ts)
    +(ts.length?'<div class="addwrap" hidden><button class="btn add">Agregar a mi pedido</button></div>':'')
    +'<div class="hint">'+(ts.length?"Eleg\u00ed tu talle":"Escribinos por WhatsApp")+'</div>'
    +'<div class="price">'+esc(money(d.precio))+'</div></div></article>';
}

/* ---------- ficha de producto ---------- */
let FOTO=0, FICHA=null, FICHA_PUSH=false;
function fichaHTML(d){
  const ts=talles(d), fs=fotos(d,1100), th=fotos(d,160);
  const q=qualCls(d);
  const main=fs.length
    ? '<img id="fimg" src="'+esc(fs[FOTO]||fs[0])+'" alt="'+esc(d.club+" "+d.modelo)+'">'
    : NOIMG;
  const thumbs = fs.length>1
    ? '<div class="fthumbs">'+fs.map((u,i)=>'<button data-foto="'+i+'" aria-pressed="'+(i===FOTO)+'">'
        +'<img src="'+esc(th[i]||u)+'" alt="" loading="lazy"></button>').join("")+'</div>'
    : "";
  const desc = d.descripcion
    ? esc(d.descripcion)
    : (cap(d.tipo)+" de "+d.club+" "+d.modelo+(d.calidad?" \u00b7 "+d.calidad:"")
       +(d.dorsal?" \u00b7 con dorsal "+d.dorsal:" \u00b7 lisa")
       +" \u00b7 tela versi\u00f3n jugador. Antes de cerrar la compra te mandamos fotos y video "
       +"de la prenda exacta que te llev\u00e1s.");
  return '<div class="fbody"><div class="fgal"><div class="fmain">'+main+'</div>'+thumbs+'</div>'
    +'<div class="finfo">'
    +'<div class="fqual'+q+'">'+esc(d.calidad||d.tipo)+'</div>'
    +'<h2 class="fclub">'+esc(d.club)+'</h2>'
    +'<div class="fmod">'+esc(d.modelo)+' \u00b7 '+esc(cap(d.tipo))
    +(dorsalTxt(d)?' \u00b7 Dorsal '+esc(dorsalTxt(d)):'')+'</div>'
    +'<div class="fprice">'+esc(money(d.precio))+'</div>'
    +'<div class="flab">Talles disponibles</div>'
    +'<div class="sizes">'
    +(ts.length ? ts.map(x=>botonTalle(d,x)).join("")
      : '<button class="sz" data-consulta="1" data-prenda="'+esc(nombre(d))+'">Consultar</button>')
    +'</div>'+ultimos(ts)
    +(ts.length?'<div class="addwrap" hidden><button class="btn add">Agregar a mi pedido</button></div>':'')
    +'<p class="fdesc">'+desc+'</p>'
    +'<button class="btn2" id="verpedido">Ver mi pedido</button>'
    +'<button class="seguir" id="copiar" data-slug="'+esc(slug(d))+'">Copiar link de este producto</button>'
    +'</div></div>';
}
function ficha(sl,deHistorial){
  const d=DATA.filter(x=>slug(x)===sl)[0];
  const box=document.getElementById("ficha"); if(!d||!box) return;
  FICHA=d; FOTO=0;
  document.getElementById("fcont").innerHTML=fichaHTML(d);
  box.classList.add("on"); document.getElementById("ov2").classList.add("on");
  document.body.style.overflow="hidden";
  box.scrollTop=0;
  if(!deHistorial){
    try{ history.pushState({p:sl},"","?p="+encodeURIComponent(sl)); FICHA_PUSH=true; }catch(e){}
  }
}
function cerrarFicha(deHistorial){
  const box=document.getElementById("ficha"); if(!box) return;
  const estaba=box.classList.contains("on");
  box.classList.remove("on"); document.getElementById("ov2").classList.remove("on");
  document.body.style.overflow=""; FICHA=null;
  if(deHistorial){ FICHA_PUSH=false; return; }
  if(!estaba) return;
  if(FICHA_PUSH){ FICHA_PUSH=false; try{ history.back(); }catch(e){} }
  else { try{ history.replaceState(null,"",location.pathname); }catch(e){} }
}
window.addEventListener("popstate",function(){
  const sl=new URLSearchParams(location.search).get("p");
  if(sl) ficha(sl,true); else cerrarFicha(true);
});
function chips(){
  const c=document.getElementById("chips"); if(!c) return;
  const hayDorsal=DATA.some(d=>d.dorsal);
  const hayRetro =DATA.some(d=>(d.calidad||"").toLowerCase().indexOf("ret")===0);
  const l=[["todo","Todo"],["camiseta","Camisetas"],["short","Shorts"]];
  if(hayDorsal) l.push(["lisa","Lisas"],["dorsal","Con dorsal"]);
  l.push(["est\u00e1ndar","Est\u00e1ndar"],["premium","Premium"]);
  if(hayRetro) l.push(["retro","Retro"]);
  c.innerHTML=l.map(([k,t])=>'<button class="chip" data-k="'+k+'" aria-pressed="'
    +(k===filtro)+'">'+t+'</button>').join("");
}
/* el dorsal solo se muestra si el modelo no lo nombra ya */
function dorsalTxt(d){
  if(!d.dorsal) return "";
  const m=(d.modelo||"").toLowerCase(), p=d.dorsal.toLowerCase().split(/\s+/)[0];
  return m.indexOf(p)>=0 ? "" : d.dorsal;
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
function sinStock(n){
  toast(n===1 ? "Queda una sola unidad de ese talle"
              : "Solo hay "+n+" unidades de ese talle");
}
function cartAdd(o){
  const k=[o.club,o.modelo,o.cal,o.tipo,o.talle].join("|");
  const f=CART.filter(x=>x.k===k)[0];
  const max=o.max||1;
  if(f){
    if(f.q>=Math.max(stockDe(f),1)){ sinStock(stockDe(f)); return false; }
    f.q++; f.max=max;
  } else {
    if(max<1){ sinStock(0); return false; }
    CART.push({k:k,club:o.club,modelo:o.modelo,cal:o.cal,
      tipo:o.tipo,talle:o.talle,precio:o.precio,max:max,q:1});
  }
  cartSave(); cartPaint();
  fb("AddToCart",{content_name:titulo(o),value:o.precio||0,currency:"ARS"});
  return true;
}
function cartQty(k,d){
  const f=CART.filter(x=>x.k===k)[0]; if(!f) return;
  if(d>0 && f.q>=Math.max(stockDe(f),1)){ sinStock(stockDe(f)); return; }
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
    +'<button class="'+(x.q>=Math.max(stockDe(x),1)?"off":"")+'" data-q="1" data-k="'
    +esc(x.k)+'" aria-label="Agregar uno">+</button>'
    +'<button class="rm" data-del="'+esc(x.k)+'">Quitar</button>'
    +'</div></div>'
    +'<div class="it-p">'+(x.precio?money(x.precio*x.q):"a confirmar")+'</div></div>').join("");
  const t=cartTotal();
  ft.innerHTML='<div class="tot"><span>Total</span><b>'+(t?money(t):"a confirmar")+'</b></div>'
    +entregaHTML()
    +'<button class="btn" id="pedir">Hacer el pedido por WhatsApp</button>'
    +'<button class="seguir" id="seguir">Seguir mirando</button>';
}
function sheet(on){
  const sh=document.getElementById("sheet"); if(!sh) return;
  sh.classList.toggle("on",on);
  document.getElementById("ov").classList.toggle("on",on);
  document.body.style.overflow = on ? "hidden" : "";
}
/* eventos de Meta: no hacen nada si el pixel no esta puesto */
function fb(ev,data){ try{ if(window.fbq) fbq("track",ev,data||{}); }catch(e){} }
function waOpen(msg){
  if(!WA){ toast("Falta cargar el n\u00famero de WhatsApp"); return; }
  const a=document.createElement("a");
  a.href="https://wa.me/"+WA+"?text="+encodeURIComponent(msg);
  a.target="_blank"; a.rel="noopener";
  document.body.appendChild(a); a.click(); a.remove();
}
const ENTREGAS={
  retiro:"Retiro en Paran\u00e1",
  moto:"Env\u00edo dentro de Paran\u00e1",
  interior:"Env\u00edo al interior"
};
function getEnt(){ try{ return localStorage.getItem("dc_entrega")||""; }catch(e){ return ""; } }
function getLoc(){ try{ return localStorage.getItem("dc_loc")||""; }catch(e){ return ""; } }
function setEnt(v){ try{ localStorage.setItem("dc_entrega",v); }catch(e){} }
function setLoc(v){ try{ localStorage.setItem("dc_loc",v); }catch(e){} }
function entregaHTML(){
  const e=getEnt();
  return '<div class="flab">\u00bfC\u00f3mo lo quer\u00e9s recibir?</div>'
    +'<div class="ents">'
    +Object.keys(ENTREGAS).map(k=>'<button class="ent" data-ent="'+k+'" aria-pressed="'
        +(k===e)+'">'+ENTREGAS[k]+'</button>').join("")
    +'</div>'
    +(e==="interior"
      ? '<input class="loc" id="loc" type="text" placeholder="\u00bfA qu\u00e9 ciudad?" value="'
        +esc(getLoc())+'">'
      : "");
}
function pedido(){
  const L=CART.map((x,i)=>(i+1)+") "+titulo(x)+" \u00b7 Talle "+(x.talle||"a confirmar")
      +" \u00b7 x"+x.q+(x.precio?" \u00b7 "+money(x.precio*x.q):""));
  let m="Hola Data Club! Te hago un pedido:\n\n"+L.join("\n");
  const t=cartTotal();
  if(t) m+="\n\nTotal: "+money(t);
  const e=getEnt();
  if(e){
    m+="\nEntrega: "+ENTREGAS[e];
    if(e==="interior"&&getLoc()) m+=" ("+getLoc()+")";
  }
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
  const fi=e.target.closest("[data-ficha]");
  if(fi){ ficha(fi.dataset.ficha); return; }
  if(e.target.closest("#ov2")||e.target.closest("#fx")||e.target.closest("#fback")){ cerrarFicha(); return; }
  if(e.target.closest("#verpedido")){ cerrarFicha(); sheet(true); return; }
  const cp=e.target.closest("#copiar");
  if(cp){
    const u=location.origin+"/productos/?p="+encodeURIComponent(cp.dataset.slug);
    if(navigator.clipboard){ navigator.clipboard.writeText(u).then(
      ()=>toast("Link copiado"),()=>toast(u)); } else toast(u);
    return;
  }
  const th=e.target.closest("[data-foto]");
  if(th&&FICHA){
    FOTO=parseInt(th.dataset.foto,10);
    document.getElementById("fcont").innerHTML=fichaHTML(FICHA);
    return;
  }
  const en=e.target.closest("[data-ent]");
  if(en){ setEnt(en.dataset.ent===getEnt()?"":en.dataset.ent); cartPaint(); return; }
  if(e.target.closest("#cartfab")){ sheet(true); return; }
  if(e.target.closest("#ov")||e.target.closest("#shx")||e.target.closest("#seguir")){ sheet(false); return; }
  if(e.target.closest("#pedir")){
    fb("InitiateCheckout",{value:cartTotal(),currency:"ARS",num_items:cartN()});
    waOpen(pedido()); return;
  }
  if(e.target.closest(".wafab")){ fb("Contact"); return; }
  const q=e.target.closest("[data-q]");
  if(q){ cartQty(q.dataset.k,parseInt(q.dataset.q,10)); return; }
  const dl=e.target.closest("[data-del]");
  if(dl){ cartDel(dl.dataset.del); return; }
  const sz=e.target.closest(".sz");
  if(sz){
    if(sz.dataset.consulta){ waOpen("Hola! Me interesa "+sz.dataset.prenda+"."); return; }
    const caja=sz.closest(".body")||sz.closest(".finfo"); if(!caja) return;
    const ya=sz.getAttribute("aria-pressed")==="true";
    caja.querySelectorAll(".sz").forEach(b=>b.setAttribute("aria-pressed","false"));
    sz.setAttribute("aria-pressed", ya?"false":"true");
    const w=caja.querySelector(".addwrap");
    if(w) w.hidden=ya;
    return;
  }
  const add=e.target.closest(".add");
  if(add){
    const caja=add.closest(".body")||add.closest(".finfo"); if(!caja) return;
    const sel=caja.querySelector('.sz[aria-pressed="true"]');
    if(!sel){ toast("Eleg\u00ed un talle primero"); return; }
    const ok=cartAdd({club:sel.dataset.club,modelo:sel.dataset.modelo,cal:sel.dataset.cal,
             tipo:sel.dataset.tipo,talle:sel.dataset.talle,precio:num(sel.dataset.precio),
             max:num(sel.dataset.stock)||1});
    if(ok) toast("Agregado a tu pedido \u00b7 talle "+sel.dataset.talle);
  }
});
document.addEventListener("keydown",e=>{ if(e.key==="Escape"){ sheet(false); cerrarFicha(); } });
document.addEventListener("input",e=>{ if(e.target.id==="loc") setLoc(e.target.value.trim()); });
const qin=document.getElementById("q");
if(qin) qin.addEventListener("input",e=>{ texto=e.target.value.trim().toLowerCase(); render(); });

(async function(){
  cartLoad(); cartPaint();
  instagram();
  if(!document.getElementById("grid")&&!document.getElementById("destacados")) return;
  chips();
  try{
    const fr=await fetch("/fotos.json?_="+Date.now(),{cache:"no-store"});
    if(fr.ok) FOTOS=await fr.json();
  }catch(e){}
  try{
    const r=await fetch(CSV+"&_="+Date.now(),{cache:"no-store"});
    if(!r.ok) throw new Error(r.status);
    const rows=parseCSV(await r.text());
    if(rows.length<2) throw new Error("vacio");
    DATA=fromRows(rows);
  }catch(err){ DATA=FALLBACK; }
  chips();
  render();
  const sl=new URLSearchParams(location.search).get("p");
  if(sl) ficha(sl,true);
})();
