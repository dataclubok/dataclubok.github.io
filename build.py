# -*- coding: utf-8 -*-
"""Genera las paginas de dataclubok.github.io. Correr: python3 build.py"""
import io, os

WA_CONSULTA = "https://wa.me/5493434068333?text=Hola%20Data%20Club%21%20Te%20quiero%20hacer%20una%20consulta."
WA_MAYOR    = "https://wa.me/5493434068333?text=Hola%20Data%20Club%21%20Quiero%20consultar%20precios%20mayoristas."

NAV = [("/","Inicio"),("/productos/","Productos"),("/nosotros/","Nosotros"),
       ("/envios/","Envíos"),("/mayoristas/","Mayoristas"),("/preguntas/","Preguntas")]

SHELL = u"""<!DOCTYPE html>
<html lang="es-AR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:type" content="website">
<link rel="icon" href="/logo.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600&family=Archivo+Black&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/estilo.css">
</head>
<body>
<header class="top">
  <div class="in">
    <a class="brand" href="/"><img src="/logo.png" alt=""><span>DATA CLUB</span></a>
    <nav class="nav">{nav}</nav>
  </div>
</header>

<div class="wrap">
{body}
  <footer>
    <div class="fnav">{fnav}</div>
    Data Club · Paraná, Entre Ríos<br>
    <a href="https://instagram.com/{ig}" target="_blank" rel="noopener">@{ig}</a>
  </footer>
</div>

<button class="cartfab" id="cartfab" aria-label="Ver tu pedido">
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.2"
       stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M5 8h14l-1.2 11.1a2 2 0 0 1-2 1.9H8.2a2 2 0 0 1-2-1.9L5 8z"/>
    <path d="M9 8V6.4A3 3 0 0 1 12 3.4a3 3 0 0 1 3 3V8"/>
  </svg>
  <span>Tu pedido</span><span class="cnt" id="cartn">0</span>
</button>
<div class="ov" id="ov"></div>
<div class="ov" id="ov2"></div>
<div class="modal" id="ficha" role="dialog" aria-modal="true" aria-label="Producto">
  <button class="sh-x mx" id="fx" aria-label="Cerrar">&times;</button>
  <div id="fcont"></div>
</div>
<aside class="sheet" id="sheet" role="dialog" aria-modal="true" aria-label="Tu pedido">
  <div class="sh-head"><h3>TU PEDIDO</h3><button class="sh-x" id="shx" aria-label="Cerrar">&times;</button></div>
  <div id="items"></div>
  <div id="foot"></div>
</aside>
<a class="wafab" href="{wa}" target="_blank" rel="noopener" aria-label="Escribinos por WhatsApp">
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.1"
       stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M21 11.6a8.4 8.4 0 0 1-8.5 8.4 8.7 8.7 0 0 1-3.9-.9L3 21l1.9-5.1A8.3 8.3 0 0 1 4 12.1 8.4 8.4 0 0 1 12.5 3.2 8.4 8.4 0 0 1 21 11.6z"/>
  </svg>
  <span>WhatsApp</span>
</a>
<div class="toast" id="toast"></div>
<script src="/app.js" defer></script>
</body>
</html>
"""

INSTAGRAM = u"""
  <section class="sec">
    <h2>SEGUINOS</h2>
    <div class="rule"></div>
    <a class="handle" href="https://instagram.com/data.club1" target="_blank" rel="noopener">@data.club1</a>
    <div id="igbox">
      <div class="igbox">
        <p>Ahí subimos los ingresos nuevos, los talles que entran y lo que se va.
           Si no te querés quedar afuera de un modelo, seguinos.</p>
        <a class="btn" href="https://instagram.com/data.club1" target="_blank" rel="noopener">Ver el Instagram</a>
      </div>
    </div>
  </section>
"""

PASOS = u"""
    <div class="steps">
      <div class="step">
        <h3>Elegí tu talle</h3>
        <p>Entrá a Productos, buscá el modelo y tocá el talle. Se suma a tu pedido,
           y podés agregar todas las prendas que quieras.</p>
      </div>
      <div class="step">
        <h3>Mirala antes de pagar</h3>
        <p>Te mandamos fotos y video de la prenda exacta que te llevás.
           Lo que ves es lo que recibís.</p>
      </div>
      <div class="step">
        <h3>Pagá y coordinamos</h3>
        <p>Transferencia, o efectivo si retirás. Arreglamos envío o punto de retiro
           y la camiseta sale.</p>
      </div>
    </div>
"""

# ------------------------------------------------------------------ paginas
INICIO = u"""
  <div class="hero">
    <img src="/logo.png" alt="Data Club">
    <h1>DATA CLUB</h1>
    <div class="rule"></div>
    <p class="sub">Camisetas y shorts de clubes y selecciones, actuales y retro.<br>
      <b>Paraná, Entre Ríos</b> · Envíos a todo el país</p>
    <div class="cta">
      <a class="p" href="/productos/">Ver productos</a>
      <a class="g" href="%(wa)s" target="_blank" rel="noopener">Escribinos</a>
    </div>
    <div class="perks">
      <div class="perk"><b>Dos calidades</b><span>Estándar y Premium, vos elegís</span></div>
      <div class="perk"><b>Envíos</b><span>A todo el país, y en moto dentro de Paraná</span></div>
      <div class="perk"><b>Retiro</b><span>Dos puntos en Paraná, a coordinar</span></div>
    </div>
  </div>

  <section class="sec">
    <h2>DESTACADOS</h2>
    <div class="rule"></div>
    <div class="grid" id="destacados"></div>
    <a class="btn vertodo" href="/productos/">Ver todos los productos</a>
  </section>

  <section class="sec">
    <h2>QUIÉNES SOMOS</h2>
    <div class="rule"></div>
    <div class="lead">
      <p>Somos <b>Data Club</b>, un emprendimiento de Paraná, Entre Ríos.</p>
      <p>Arrancamos con una idea simple: que ponerte la camiseta de tu equipo no tenga que ser un lujo.
         Traemos camisetas y shorts de clubes y selecciones, actuales y retro, con buena calidad
         y a precios que aguantan cualquier comparación.</p>
      <p class="kick">Al final, la camiseta no es una prenda más: es la que te ponés cuando juega el tuyo.</p>
    </div>
    <a class="btn vertodo" href="/nosotros/">Conocenos más</a>
  </section>

  <section class="sec">
    <h2>CÓMO COMPRAR</h2>
    <div class="rule"></div>
%(pasos)s
    <p class="note"><b>Tener en cuenta:</b> por el momento no hacemos cambios, ni por talle ni por modelo.
       Por eso te mostramos todo en detalle antes de cerrar la compra.</p>
  </section>
%(ig)s
""" % {"wa":WA_CONSULTA,"pasos":PASOS,"ig":INSTAGRAM}

PRODUCTOS = u"""
  <div class="phead">
    <h1>PRODUCTOS</h1>
    <div class="rule"></div>
    <p class="sub">Tocá el talle que querés y se suma a tu pedido.
       Podés juntar varias prendas y mandarlas todas juntas por WhatsApp.</p>
  </div>

  <div class="bar">
    <input type="search" id="q" placeholder="Buscá tu equipo…" autocomplete="off">
    <div class="chips" id="chips"></div>
  </div>

  <p class="count" id="count"></p>
  <div class="grid" id="grid"></div>
  <div class="state" id="state">Cargando los productos…</div>
"""

NOSOTROS = u"""
  <div class="phead">
    <h1>NOSOTROS</h1>
    <div class="rule"></div>
  </div>

  <section class="sec">
    <div class="lead">
      <p>Somos <b>Data Club</b>, un emprendimiento de Paraná, Entre Ríos.</p>
      <p>Arrancamos con una idea simple: que ponerte la camiseta de tu equipo no tenga que ser un lujo.
         Traemos camisetas y shorts de clubes y selecciones, actuales y retro, con buena calidad
         y a precios que aguantan cualquier comparación.</p>
      <p>Manejamos dos calidades, <b>Estándar</b> y <b>Premium</b>, y vamos renovando el stock
         todo el tiempo. Elegís el modelo, te mandamos fotos y video de la prenda tal cual es,
         coordinamos la entrega y listo.</p>
      <p class="kick">Al final, la camiseta no es una prenda más: es la que te ponés cuando juega el tuyo.</p>
    </div>
  </section>

  <section class="sec">
    <h2>CÓMO COMPRAR</h2>
    <div class="rule"></div>
%(pasos)s
    <p class="note"><b>Tener en cuenta:</b> por el momento no hacemos cambios, ni por talle ni por modelo.
       Por eso te mostramos todo en detalle antes de cerrar la compra.</p>
    <a class="btn vertodo" href="/productos/">Ver los productos</a>
  </section>
%(ig)s
""" % {"pasos":PASOS,"ig":INSTAGRAM}

ENVIOS = u"""
  <div class="phead">
    <h1>ENVÍOS Y ENTREGAS</h1>
    <div class="rule"></div>
    <p class="sub">Llegamos a todo el país, y en Paraná podés retirar o recibirlo en el día a coordinar.</p>
  </div>

  <section class="sec">
    <div class="cols">
      <div class="box">
        <h3>Retiro en Paraná</h3>
        <p>Tenemos dos puntos de retiro: uno en <b>zona sur</b> y otro en <b>zona San Agustín</b>.
           Se coordinan antes por WhatsApp.</p>
      </div>
      <div class="box">
        <h3>Envío dentro de la ciudad</h3>
        <p>Mandamos en moto (Uber) a cualquier punto de Paraná, a coordinar por WhatsApp.</p>
      </div>
      <div class="box">
        <h3>A todo el país</h3>
        <p>Enviamos por <b>Correo Argentino</b>, <b>Andreani</b> o <b>Vía Cargo</b>,
           estés donde estés.</p>
      </div>
    </div>
    <p class="note">El costo del envío corre por cuenta del cliente.</p>
  </section>

  <section class="sec">
    <h2>PAGOS Y CAMBIOS</h2>
    <div class="rule"></div>
    <div class="cols">
      <div class="box">
        <h3>Medios de pago</h3>
        <p>Por <b>transferencia</b>, o en <b>efectivo</b> si retirás la mercadería
           en alguno de nuestros puntos de retiro.</p>
      </div>
      <div class="box">
        <h3>Cambios</h3>
        <p>Por el momento <b>no hacemos cambios</b>, ni por talle ni por modelo.</p>
        <p>Antes de cerrar la compra te mandamos fotos y video de la prenda exacta que te llevás,
           para que la veas tal cual es. Una vez efectuada la compra no se realizan cambios.</p>
      </div>
    </div>
    <a class="btn vertodo" href="%(wa)s" target="_blank" rel="noopener">Consultar por WhatsApp</a>
  </section>
""" % {"wa":WA_CONSULTA}

MAYORISTAS = u"""
  <div class="phead">
    <h1>MAYORISTAS</h1>
    <div class="rule"></div>
  </div>

  <section class="sec">
    <div class="mayo">
      <div class="big">DESDE 10 UNIDADES</div>
      <p>¿Revendés, tenés un local o querés armar el perchero de tu negocio?
         Trabajamos venta por mayor a partir de 10 unidades, y cuanta más cantidad lleves,
         mejor queda el precio. Escribinos y te pasamos los valores.</p>
      <a class="btn" href="%(wa)s" target="_blank" rel="noopener">Consultar precios mayoristas</a>
    </div>
  </section>

  <section class="sec">
    <h2>CÓMO FUNCIONA</h2>
    <div class="rule"></div>
    <div class="cols">
      <div class="box">
        <h3>Armado del pedido</h3>
        <p>Podés combinar modelos, talles y calidades hasta llegar a las 10 unidades.
           No hace falta que lleves 10 del mismo.</p>
      </div>
      <div class="box">
        <h3>Precio por cantidad</h3>
        <p>Cuantas más unidades, mejor el precio por prenda. Consultanos la cantidad
           que tenés en mente y te pasamos el valor.</p>
      </div>
      <div class="box">
        <h3>Entrega</h3>
        <p>Mismas opciones que siempre: retiro en Paraná, envío en moto dentro de la ciudad
           o despacho a todo el país.</p>
      </div>
    </div>
  </section>
""" % {"wa":WA_MAYOR}

FAQ_ITEMS = [
 (u"¿Hacen cambios?",
  u"Por el momento no. No hacemos cambios por talle ni por modelo. Por eso, antes de cerrar la compra, "
  u"te mandamos fotos y video de la prenda exacta que te llevás, para que la veas tal cual es. "
  u"Una vez efectuada la compra no se realizan cambios."),
 (u"¿Cómo puedo pagar?",
  u"Por transferencia, o en efectivo si retirás la mercadería en alguno de nuestros puntos de retiro."),
 (u"¿Hacen envíos a todo el país?",
  u"Sí. Dentro de Paraná mandamos en moto (Uber) y al resto del país por Correo Argentino, "
  u"Andreani o Vía Cargo. El costo del envío corre por cuenta del cliente."),
 (u"¿Puedo retirar en persona?",
  u"Sí, en Paraná tenemos dos puntos de retiro, en zona sur y en zona San Agustín. "
  u"Se coordinan antes por WhatsApp."),
 (u"¿Qué diferencia hay entre Estándar y Premium?",
  u"Son dos calidades distintas. La Premium tiene mejor tela y terminación, y por eso vale un poco más. "
  u"En cada modelo figura cuál es."),
 (u"¿Cómo sé qué talle pedir?",
  u"En cada modelo ves los talles que hay disponibles. Si tenés dudas, escribinos antes de comprar "
  u"y te damos una mano, así no te equivocás."),
 (u"¿Cómo hago para pedir varias prendas juntas?",
  u"En Productos tocá el talle de cada prenda que quieras: se van sumando a tu pedido. "
  u"Cuando termines, abrí el botón “Tu pedido” y mandanos todo junto por WhatsApp."),
 (u"¿El stock está actualizado?",
  u"Lo actualizamos nosotros a mano, así que puede pasar que algo recién vendido siga figurando. "
  u"Cuando nos escribas te confirmamos la disponibilidad al momento."),
 (u"¿Venden por mayor?",
  u"Sí, a partir de 10 unidades. Cuanta más cantidad, mejor el precio. "
  u"Consultanos por WhatsApp y te pasamos los valores."),
]
PREGUNTAS = u"""
  <div class="phead">
    <h1>PREGUNTAS FRECUENTES</h1>
    <div class="rule"></div>
    <p class="sub">Si no encontrás lo que buscás, escribinos por WhatsApp y te respondemos.</p>
  </div>

  <section class="sec">
    <div class="faq">
%s
    </div>
    <a class="btn vertodo" href="%s" target="_blank" rel="noopener">Hacer una consulta</a>
  </section>
""" % ("\n".join(u"      <details><summary>%s</summary><p>%s</p></details>"%(q,a)
                 for q,a in FAQ_ITEMS), WA_CONSULTA)

PAGES = [
 ("",           u"Data Club · Camisetas y shorts de fútbol",
  u"Camisetas y shorts de clubes y selecciones, actuales y retro. Paraná, Entre Ríos. Envíos a todo el país.",
  "/", INICIO),
 ("productos",  u"Productos · Data Club",
  u"Todas las camisetas y shorts disponibles, con talles y precios. Armá tu pedido y mandalo por WhatsApp.",
  "/productos/", PRODUCTOS),
 ("nosotros",   u"Nosotros · Data Club",
  u"Quiénes somos y cómo comprar en Data Club, Paraná, Entre Ríos.",
  "/nosotros/", NOSOTROS),
 ("envios",     u"Envíos y entregas · Data Club",
  u"Envíos a todo el país, moto dentro de Paraná y dos puntos de retiro. Medios de pago y política de cambios.",
  "/envios/", ENVIOS),
 ("mayoristas", u"Mayoristas · Data Club",
  u"Venta por mayor desde 10 unidades. Cuanta más cantidad, mejor el precio.",
  "/mayoristas/", MAYORISTAS),
 ("preguntas",  u"Preguntas frecuentes · Data Club",
  u"Cambios, medios de pago, envíos, talles y calidades. Todo lo que suelen preguntarnos.",
  "/preguntas/", PREGUNTAS),
]

base="/home/claude/dataclubok.github.io"
for folder,title,desc,here,body in PAGES:
    nav="".join(u'<a href="%s"%s>%s</a>'%(h," aria-current=\"page\"" if h==here else "",l)
                for h,l in NAV)
    fnav="".join(u'<a href="%s">%s</a>'%(h,l) for h,l in NAV)
    html=SHELL.format(title=title,desc=desc,nav=nav,fnav=fnav,body=body,
                      ig="data.club1",wa=WA_CONSULTA)
    d=os.path.join(base,folder) if folder else base
    if folder and not os.path.isdir(d): os.makedirs(d)
    io.open(os.path.join(d,"index.html"),"w",encoding="utf-8").write(html)
    print("escrito", (folder or ".")+"/index.html", len(html))
