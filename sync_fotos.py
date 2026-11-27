# -*- coding: utf-8 -*-
import json,io,unicodedata,re,collections,sys
SRC="/home/claude/patch/todas_fotos.json"
files=json.load(open(SRC)); d={}
print("imagenes:",len(files))

CAM="1cHaOaqYMxX4ExKDAMX-24beht-0JvXeH"; SHO="1prGIWi5DfB9TN4U6nd7ksUsYb5GFsqvj"
# id de carpeta -> (nombre, seccion)
F={
 "11rMVTsay-X5dR1v0MrBw8hS2-37tl2tb":("Racing titular estandar",CAM),
 "1f2f45rdEnqimxrIWvbzpu8_a4Pach-4a":("Real Madrid suplente Valverde estandar",CAM),
 "1r-Tp2vcQtOPHUTAwi9QsY5e5aOot2Ga-":("Atletico Madrid titular",CAM),
 "1bdg_WnHD5_2BjItfIBjvusrh_abqvsoO":("PSG suplente",CAM),
 "1fL1XHgc5ysHjCQHsAojLSGmsSkx0m8Fx":("United titular",CAM),
 "13Vog59kWzrVAaGkHSdLHZzZ3H1VL8vU9":("River suplente estandar",CAM),
 "19-JAVgq12mLAdGRpG-zXBkUPxbjkRtA2":("Barcelona titular Yamal estandar",CAM),
 "13fOCmPHit3fDa2pVHmJZJ8M-5X__v33A":("United retro rojo",CAM),
 "1VRwSr-sAKNVbi-EwKMvWv0zOOA7nQyi-":("Arsenal titular",CAM),
 "16AyNL-KvnZM_DebQPCz3rrqP4_kcZjzJ":("Boca Juniors titular",CAM),
 "1bzkCxAJZWZWjKLMhRWvpMvTgdiqWifT0":("Roma titular",CAM),
 "1qT7LKAE4utTU3vdwOnpKs3LAkh1vdeEP":("Boca suplente estandar",CAM),
 "1IRneLA-wYVfVnMv0co7J58UHLRgWQaYi":("Portugal Ronaldo estandar",CAM),
 "1OBDvse-6QaaPBFGtcTP92N6pVyaw4bDm":("Liverpool suplente",CAM),
 "1Mo0BWqX3Ivzi-6zAKyhy4RstU54ZbZWC":("Brasil titular",CAM),
 "1bIxViVtYmSehqYIHi5uQYjtyv2Hu2ZBF":("Espana titular",CAM),
 "1ntdyDc5mDd3EEgcI7u4P42TS5bc3SmMU":("Real Madrid titular",CAM),
 "12fhxiaTfyfIm0JqHfdGDEKGbUZlntcsc":("United Retro blanca",CAM),
 "11U3RBTqIdL1ec9c8c-TmbVpLkSYTTTlH":("Milan titular",CAM),
 "1nzwBIcKUYuYlVRxxWBNAURD8Fv2tVbuH":("River titular estandar",CAM),
 "1mIuQj2iFUsT66oSRCvGm6lFKjjc0bPNQ":("Juventus titular",CAM),
 "1Z88R0aDQ_I0PmKMuVJIsE6cU52fB4Yjg":("Manchester City Enzo estandar",CAM),
 "11s6wsv-AKRjx5NGwD99vCRhKGnIoTEPM":("Inter suplente",CAM),
 "14oJ5j-F6oXN83W_t3n0bLiqXHRZdBOM2":("Barcelona titular",CAM),
 "1aGF3n4BFrVOvm4-QB3UUCmveg4G_AivJ":("Portugal titular",CAM),
 "1WgQE3OOjZCKpvPHKHAlBIo846DHTf2G-":("Chelsea suplente estandar",CAM),
 "1DJ3nTSeWmHdZY1zxrMAHaUycvGzNb4_S":("Inter titular",CAM),
 "1dhVkm3q5_hCpPcIG_3gAp7A7sc15jGBD":("Chelsea titular",CAM),
 "1PSUNZk4fP-ayqP-dkJimE-_q_MdvIFXR":("Boca Juniors titular estandar",CAM),
 "122mi2Ova0FwvblqAcYgjRNuzfC3ZkFfi":("Portugal",SHO),
 "1sSTOAoqwjz6FEbm3wMehTF8o1Ih6lZwh":("Totenham",SHO),
 "11jzjkJbhX53RmepHewrTf_JD_du6qVc1":("United blanco",SHO),
 "1kICVwGhko5tfyvjOzKuJiU7RVmiFmnst":("PSG",SHO),
 "1F_tRjcvDR8HxOIHRX1HzQ8MnofkeoqrA":("Real Madrid",SHO),
 "1pn4E0lH5lEaCiAdXwFUvASyjnCAKIkwX":("Espana 19",SHO),
}
# carpeta -> fila de la planilla (club, modelo, tipo, calidad)
M={
 "River titular estandar":        ("River Plate","Titular","Camiseta","Estándar"),
 "Boca Juniors titular estandar": ("Boca Juniors","Titular","Camiseta","Estándar"),
 "Boca suplente estandar":        ("Boca Juniors","Suplente","Camiseta","Estándar"),
 "Racing titular estandar":       ("Racing","Titular","Camiseta","Estándar"),
 "Manchester City Enzo estandar": ("Manchester City","Titular (Enzo)","Camiseta","Estándar"),
 "Boca Juniors titular":          ("Boca Juniors","Titular","Camiseta","Premium"),
 "Juventus titular":              ("Juventus","Titular","Camiseta","Premium"),
 "Liverpool suplente":            ("Liverpool","Suplente","Camiseta","Premium"),
 "Barcelona titular":             ("Barcelona","Titular","Camiseta","Premium"),
 "Real Madrid titular":           ("Real Madrid","Titular","Camiseta","Premium"),
 "Arsenal titular":               ("Arsenal","Titular","Camiseta","Premium"),
 "United Retro blanca":           ("Manchester United","Retro blanca","Camiseta","Retro"),
 "United retro rojo":             ("Manchester United","Retro roja","Camiseta","Retro"),
 "United titular":                ("Manchester United","Titular","Camiseta","Premium"),
 "Atletico Madrid titular":       ("Atlético Madrid","Titular","Camiseta","Premium"),
 "PSG suplente":                  ("PSG","Suplente","Camiseta","Premium"),
 "Espana titular":                ("España","Titular","Camiseta","Premium"),
 "Inter suplente":                ("Inter","Suplente","Camiseta","Premium"),
 "Inter titular":                 ("Inter","Titular","Camiseta","Premium"),
 "Milan titular":                 ("Milan","Titular","Camiseta","Premium"),
 "Portugal titular":              ("Portugal","Titular","Camiseta","Premium"),
 "Chelsea titular":               ("Chelsea","Titular","Camiseta","Premium"),
 "Brasil titular":                ("Brasil","Titular","Camiseta","Premium"),
 "Roma titular":                  ("Roma","Titular","Camiseta","Premium"),
 # shorts (todos Premium)
 "Portugal":      ("Portugal","Titular","Short","Premium"),
 "United blanco": ("Manchester United","Titular blanco","Short","Premium"),
 "PSG":           ("PSG","Titular","Short","Premium"),
 "Totenham":      ("Tottenham","Titular","Short","Premium"),
 "Espana 19":     ("España","Titular","Short","Premium"),
 "Real Madrid":   ("Real Madrid","Titular","Short","Premium"),
 "Chelsea suplente estandar":      ("Chelsea","Suplente","Camiseta","Est\u00e1ndar"),
 "River suplente estandar":        ("River Plate","Suplente","Camiseta","Est\u00e1ndar"),
 "Barcelona titular Yamal estandar":("Barcelona","Titular (Yamal)","Camiseta","Est\u00e1ndar"),
 "Real Madrid suplente Valverde estandar":("Real Madrid","Suplente","Camiseta","Est\u00e1ndar"),
 "Portugal Ronaldo estandar":      ("Portugal","Titular (Ronaldo)","Camiseta","Est\u00e1ndar"),
 # pendientes de confirmar: Chelsea suplente estandar, Barcelona titular Yamal estandar,
 # Real Madrid suplente Valverde estandar, River suplente estandar, Portugal Ronaldo estandar
}
def slug(c,m,t,q):
    s=unicodedata.normalize("NFD",(c+"-"+m+"-"+t+"-"+q).lower())
    s="".join(x for x in s if unicodedata.category(x)!="Mn")
    return re.sub(r"[^a-z0-9]+","-",s).strip("-")

por=collections.defaultdict(list)
for f in files: por[f["parentId"]].append(f)
out={}; pend=[]
for fid,(nom,sec) in F.items():
    fs=sorted(por.get(fid,[]),key=lambda f:f["title"])
    if not fs: pend.append((nom,"sin fotos")); continue
    if nom not in M: pend.append((nom,"%d fotos, falta confirmar"%len(fs))); continue
    out[slug(*M[nom])]=[f["id"] for f in fs]
io.open("fotos.json","w",encoding="utf-8").write(json.dumps(out,indent=0,sort_keys=True))
print("\nproductos con fotos:",len(out))
for k in sorted(out): print("   %-50s %2d"%(k,len(out[k])))
print("\npendientes:")
for n,m in pend: print("   %-42s %s"%(n,m))
