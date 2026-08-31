let airlines=[],verified="";
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
async function init(){
 const r=await fetch("airlines.json"); const data=await r.json(); airlines=data.airlines; verified=data.verified; $("#coverage").textContent=`${airlines.length} aerolíneas · ${airlines.reduce((n,a)=>n+a.options.length,0)} opciones de equipaje`;
 $("#airline").innerHTML=airlines.map(a=>`<option value="${a.id}">${esc(a.name)}</option>`).join("");
 fillOptions(); $("#airline").addEventListener("change",fillOptions); $("#bagForm").addEventListener("submit",calculate);
}
function currentAirline(){return airlines.find(a=>a.id===$("#airline").value)}
function currentOption(){return currentAirline()?.options.find(o=>o.id===$("#allowance").value)}
function fillOptions(){
 const a=currentAirline(); $("#allowance").innerHTML=a.options.map(o=>`<option value="${o.id}">${esc(o.label)}</option>`).join(""); updateNote();
}
function updateNote(){const o=currentOption();$("#allowanceNote").textContent=o?.note||""}
$("#allowance").addEventListener("change",updateNote);
function fmtDate(v){const [y,m,d]=v.split("-");return `${d}/${m}/${y}`}
function amazon(q){return "https://www.amazon.es/s?k="+encodeURIComponent(q)+"&tag=travelapps-21"}
function calculate(e){
 e.preventDefault(); const a=currentAirline(),o=currentOption();
 const entered=[$("#height").valueAsNumber,$("#width").valueAsNumber,$("#depth").valueAsNumber].sort((x,y)=>y-x);
 const allowed=[...o.dims].sort((x,y)=>y-x); const weight=$("#weight").valueAsNumber;
 const diffs=entered.map((n,i)=>+(n-allowed[i]).toFixed(1)); const sizeOk=diffs.every(x=>x<=0);
 const weightKnown=Number.isFinite(weight), weightOk=!weightKnown||o.weight==null||weight<=o.weight;
 const ok=sizeOk&&weightOk, exact=o.dims.join(" × ");
 let detail="";
 if(!sizeOk){const excess=Math.max(...diffs);detail=`La dimensión más problemática supera el límite equivalente en <strong>${excess} cm</strong>.`}
 else if(!weightOk){detail=`El peso indicado supera el máximo en <strong>${(weight-o.weight).toFixed(1)} kg</strong>.`}
 else {detail="Por las medidas"+(weightKnown&&o.weight!=null?" y el peso indicados":" indicadas")+", tu equipaje encaja en este límite."}
 const query=ok?`organizador compresion equipaje cabina viaje`:`equipaje cabina ${exact} ${a.name}`;
 $("#result").className=`result ${ok?"pass":"fail"}`;
 $("#result").innerHTML=`<div class="result-status"><span>${ok?"✓":"!"}</span><div><p>${ok?"COMPATIBLE POR MEDIDAS":"NO ENCAJA EN EL LÍMITE"}</p><h2>${ok?"Tu equipaje debería caber":"Tu equipaje supera el límite"}</h2></div></div>
 <p class="result-detail">${detail}</p>
 <div class="comparison"><div><small>Tu equipaje</small><strong>${entered.join(" × ")} cm${weightKnown?` · ${weight} kg`:""}</strong></div><span>→</span><div><small>Límite seleccionado</small><strong>${exact} cm${o.weight!=null?` · ${o.weight} kg`:""}</strong></div></div>
 <div class="result-note"><strong>${esc(a.name)} · ${esc(o.label)}</strong><p>${esc(o.note)}</p></div>
 <div class="result-actions"><a class="official" target="_blank" rel="noopener" href="${a.source}">Consultar norma oficial ↗</a><a class="amazon-cta" data-amazon-source="cabin_calculator_${ok?"compatible":"oversize"}" target="_blank" rel="nofollow sponsored" href="${amazon(query)}">${ok?"Ver organizadores para aprovechar el espacio":"Ver equipaje compatible en Amazon"}<small>Enlace pagado</small></a></div>
 <p class="verified">Información revisada el ${fmtDate(verified)}. El resultado es orientativo: comprueba la tarifa y reserva concretas antes de volar.</p>
 <a class="packing-link" href="../antes-de-volar/">💧 Revisar también líquidos y baterías</a>\n <a class="packing-link" href="../que-me-llevo/?trip=${encodeURIComponent("Viajo en avión con "+a.name+" y llevaré equipaje de cabina.")}&ref=cabin_calculator">🎒 Ahora prepara tu lista completa</a>`;
 $("#result").scrollIntoView({behavior:"smooth",block:"start"});
 if(typeof trackTravelApps==="function")trackTravelApps("cabin_check",{airline:a.id,allowance:o.id,result:ok?"compatible":"oversize",weight_entered:weightKnown});
}
init().catch(()=>{$("#bagForm").innerHTML="<p>No se han podido cargar las aerolíneas. Inténtalo de nuevo en unos minutos.</p>"});
