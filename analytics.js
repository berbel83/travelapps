const GA_ID="G-T1MEJND383";
const CONSENT_KEY="travelapps_analytics_consent";
const AMAZON_TRACKING_ID="travelapps0b-21";

function loadAnalytics(){
  if(window.__travelAppsAnalyticsLoaded)return;
  window.__travelAppsAnalyticsLoaded=true;
  window.dataLayer=window.dataLayer||[];
  window.gtag=function(){dataLayer.push(arguments);};
  gtag("js",new Date());
  gtag("config",GA_ID,{anonymize_ip:true});

  const script=document.createElement("script");
  script.async=true;
  script.src="https://www.googletagmanager.com/gtag/js?id="+GA_ID;
  document.head.appendChild(script);
}

function trackTravelApps(eventName,params={}){
  if(localStorage.getItem(CONSENT_KEY)!=="accepted")return;
  loadAnalytics();
  gtag("event",eventName,params);
}

function setAnalyticsConsent(value){
  localStorage.setItem(CONSENT_KEY,value);
  document.getElementById("analyticsConsent")?.remove();
  if(value==="accepted")loadAnalytics();
}

function showConsent(){
  if(localStorage.getItem(CONSENT_KEY))return;

  const banner=document.createElement("aside");
  banner.id="analyticsConsent";
  banner.className="consent-banner";
  banner.setAttribute("aria-label","Preferencias de privacidad");
  banner.innerHTML=`
    <div>
      <strong>Tu privacidad</strong>
      <p>Usamos Google Analytics para conocer qué páginas y herramientas se utilizan. Solo se activará si aceptas y nunca enviaremos la descripción de tus viajes.</p>
      <a href="/privacidad/">Más información</a>
    </div>
    <div class="consent-actions">
      <button id="rejectAnalytics">Rechazar</button>
      <button id="acceptAnalytics">Aceptar</button>
    </div>
  `;
  document.body.appendChild(banner);
  document.getElementById("acceptAnalytics").onclick=()=>setAnalyticsConsent("accepted");
  document.getElementById("rejectAnalytics").onclick=()=>setAnalyticsConsent("rejected");
}

function normalizeAmazonTrackingLinks(){
  document.querySelectorAll('a[href*="amazon.es"]').forEach(link=>{
    try{
      const url=new URL(link.href);
      url.searchParams.set("tag",AMAZON_TRACKING_ID);
      link.href=url.toString();
    }catch(error){
      console.warn("No se pudo normalizar un enlace de Amazon",error);
    }
  });
}

function improveGuideNavigation(){
  if(!location.pathname.includes("/guias/"))return;

  const guideSlug=location.pathname.replace(/\/+$/,"").split("/").pop();
  const relatedGuides={
    "lista-equipaje-3-dias":[
      ["que-llevar-avion","✈️","Viaje en avión"],
      ["que-llevar-road-trip","🚗","Road trip"],
      ["que-llevar-boda","💒","Boda fuera de tu ciudad"],
      ["que-llevar-interrail","🚆","Interrail"]
    ],
    "que-llevar-autocaravana":[
      ["que-llevar-road-trip","🚗","Road trip"],
      ["que-llevar-camping-con-ninos","⛺","Camping con niños"],
      ["que-llevar-viaje-con-perro","🐕","Viajar con perro"],
      ["que-llevar-viaje-con-bebe","👶","Viajar con bebé"]
    ],
    "que-llevar-avion":[
      ["que-llevar-vuelo-largo","🛫","Vuelo largo"],
      ["accesorios-vuelo-largo","🎧","Accesorios para vuelo largo"],
      ["lista-equipaje-3-dias","🧳","Viaje de 3 días"],
      ["que-llevar-viaje-con-bebe","👶","Volar con bebé"]
    ],
    "que-llevar-boda":[
      ["lista-equipaje-3-dias","🧳","Viaje de 3 días"],
      ["que-llevar-avion","✈️","Viaje en avión"],
      ["que-llevar-road-trip","🚗","Road trip"],
      ["que-llevar-vuelo-largo","🛫","Vuelo largo"]
    ],
    "que-llevar-camino-santiago":[
      ["que-llevar-interrail","🚆","Equipaje ligero para Interrail"],
      ["que-llevar-camping-con-ninos","⛺","Camping"],
      ["que-llevar-esqui","⛷️","Viaje de esquí"],
      ["lista-equipaje-3-dias","🧳","Equipaje para pocos días"]
    ],
    "que-llevar-camping-con-ninos":[
      ["que-llevar-autocaravana","🚐","Autocaravana"],
      ["que-llevar-viaje-con-bebe","👶","Viajar con bebé"],
      ["que-llevar-viaje-con-perro","🐕","Viajar con perro"],
      ["accesorios-viajar-con-ninos","🧸","Accesorios para viajar con niños"]
    ],
    "que-llevar-crucero":[
      ["accesorios-para-crucero","🚢","Accesorios para crucero"],
      ["que-llevar-avion","✈️","Viaje en avión"],
      ["que-llevar-vuelo-largo","🛫","Vuelo largo"],
      ["que-llevar-viaje-tropical","🌴","Destino tropical"]
    ],
    "que-llevar-esqui":[
      ["que-llevar-avion","✈️","Viaje en avión"],
      ["que-llevar-road-trip","🚗","Road trip"],
      ["lista-equipaje-3-dias","🧳","Viaje de 3 días"],
      ["que-llevar-vuelo-largo","🛫","Vuelo largo"]
    ],
    "que-llevar-festival":[
      ["lista-equipaje-3-dias","🧳","Escapada de 3 días"],
      ["que-llevar-road-trip","🚗","Road trip"],
      ["que-llevar-avion","✈️","Viaje en avión"],
      ["que-llevar-interrail","🚆","Interrail"]
    ],
    "que-llevar-interrail":[
      ["que-llevar-avion","✈️","Viaje en avión"],
      ["lista-equipaje-3-dias","🧳","Equipaje ligero"],
      ["que-llevar-vuelo-largo","🛫","Vuelo largo"],
      ["que-llevar-road-trip","🚗","Road trip"]
    ],
    "que-llevar-madrid-con-ninos":[
      ["que-llevar-parque-tematico","🎢","Parque temático"],
      ["accesorios-viajar-con-ninos","🧸","Accesorios para viajar con niños"],
      ["que-llevar-avion","✈️","Viaje en avión"],
      ["lista-equipaje-3-dias","🧳","Viaje de 3 días"]
    ],
    "que-llevar-parque-tematico":[
      ["que-llevar-madrid-con-ninos","👨‍👩‍👦‍👦","Madrid con niños"],
      ["accesorios-viajar-con-ninos","🧸","Accesorios para viajar con niños"],
      ["que-llevar-playa-con-ninos","🏖️","Playa con niños"],
      ["lista-equipaje-3-dias","🧳","Escapada de 3 días"]
    ],
    "que-llevar-playa-con-ninos":[
      ["accesorios-viajar-con-ninos","🧸","Accesorios para viajar con niños"],
      ["que-llevar-viaje-con-bebe","👶","Viajar con bebé"],
      ["que-llevar-camping-con-ninos","⛺","Camping con niños"],
      ["que-llevar-viaje-tropical","🌴","Destino tropical"]
    ],
    "que-llevar-road-trip":[
      ["que-llevar-autocaravana","🚐","Autocaravana"],
      ["que-llevar-camping-con-ninos","⛺","Camping con niños"],
      ["que-llevar-viaje-con-perro","🐕","Viajar con perro"],
      ["lista-equipaje-3-dias","🧳","Escapada de 3 días"]
    ],
    "que-llevar-viaje-con-bebe":[
      ["que-llevar-avion","✈️","Viaje en avión"],
      ["que-llevar-road-trip","🚗","Road trip"],
      ["que-llevar-camping-con-ninos","⛺","Camping con niños"],
      ["accesorios-viajar-con-ninos","🧸","Accesorios para viajar con niños"]
    ],
    "que-llevar-viaje-con-perro":[
      ["que-llevar-road-trip","🚗","Road trip"],
      ["que-llevar-autocaravana","🚐","Autocaravana"],
      ["que-llevar-camping-con-ninos","⛺","Camping"],
      ["lista-equipaje-3-dias","🧳","Escapada de 3 días"]
    ],
    "que-llevar-viaje-tropical":[
      ["que-llevar-avion","✈️","Viaje en avión"],
      ["que-llevar-vuelo-largo","🛫","Vuelo largo"],
      ["que-llevar-crucero","🚢","Crucero"],
      ["que-llevar-playa-con-ninos","🏖️","Playa con niños"]
    ],
    "que-llevar-vuelo-largo":[
      ["accesorios-vuelo-largo","🎧","Accesorios para vuelo largo"],
      ["que-llevar-avion","✈️","Viaje en avión"],
      ["que-llevar-viaje-tropical","🌴","Destino tropical"],
      ["que-llevar-crucero","🚢","Crucero"]
    ]
  };

  const relatedContainer=document.querySelector(".related-guides div");
  const guideLinks=relatedGuides[guideSlug];
  if(relatedContainer&&guideLinks){
    relatedContainer.innerHTML=guideLinks.map(([slug,icon,label])=>
      `<a href="../${slug}/"><span>${icon}</span>${label}</a>`
    ).join("");
  }

  if(!document.querySelector(".guide-tools-cta")){
    const toolsCta=document.createElement("section");
    toolsCta.className="guide-cta guide-tools-cta";
    toolsCta.innerHTML=`
      <h2>Sigue preparando el viaje con TravelApps</h2>
      <p>Esta guía es una buena base. Si quieres adaptarla a tu viaje, tienes herramientas gratuitas para crear el itinerario, generar tu lista de equipaje, comprobar la maleta de cabina o revisar si necesitas adaptador.</p>
      <a class="primary-button" href="/herramientas/?ref=guide_footer_tools">Ver herramientas de TravelApps →</a>
    `;
    const relatedNav=document.querySelector(".related-guides");
    if(relatedNav)relatedNav.insertAdjacentElement("afterend",toolsCta);
    else document.querySelector(".guide-page")?.appendChild(toolsCta);
  }
}

document.addEventListener("DOMContentLoaded",()=>{
  normalizeAmazonTrackingLinks();
  improveGuideNavigation();

  if(localStorage.getItem(CONSENT_KEY)==="accepted")loadAnalytics();
  else showConsent();

  if(location.pathname.includes("/guias/")){
    trackTravelApps("guide_view",{guide_path:location.pathname});
  }

  document.addEventListener("click",event=>{
    const link=event.target.closest("a");
    const button=event.target.closest("button");

    if(link?.href.includes("amazon.es")){
      const productName=
        link.closest(".item")?.querySelector(".name")?.textContent?.trim() ||
        link.closest(".guide-product")?.querySelector("h3")?.textContent?.trim() ||
        link.closest(".discovery-item")?.querySelector("strong")?.textContent?.trim() ||
        "recomendacion";
      trackTravelApps("amazon_affiliate_click",{
        product_name:productName,
        link_source:link.dataset.amazonSource||"checklist",
        page_path:location.pathname
      });
    }

    if(link?.href.includes("elplanazo.lovable.app")){
      trackTravelApps("app_open",{app_name:"el_planazo"});
    }

    if(link?.href.includes("/que-me-llevo")){
      trackTravelApps("app_open",{app_name:"que_me_llevo"});
    }

    if(link?.closest(".guide-cta")){
      trackTravelApps("guide_cta",{guide_path:location.pathname});
    }

    if(button?.id==="shareWhatsApp"||link?.dataset.shareSource==="guide"){
      trackTravelApps("whatsapp_share",{
        page_path:location.pathname,
        share_source:link?.dataset.shareSource||"packing_list"
      });
    }

    if(button?.id==="analyze"||button?.id==="importedGenerate"){
      const ref=new URLSearchParams(location.search).get("ref");
      trackTravelApps("packing_started",{
        source:button.id==="importedGenerate"?"el_planazo":(ref||"manual")
      });
    }
  });
});

const BOOKING_AFFILIATE_BASE_URL="https://www.jdoqocy.com/click-101874493-12180791";

function bookingAffiliateUrl(sid){
  const url=new URL(BOOKING_AFFILIATE_BASE_URL);
  if(sid)url.searchParams.set("sid",sid);
  return url.toString();
}

function addBookingAffiliateOffers(){
  const path=location.pathname;

  if(path.includes("/guias/")){
    const guideSlug=path.replace(/\/+$/,"").split("/").pop();
    if(guideSlug&&guideSlug!=="guias"&&!document.querySelector(".booking-affiliate-cta")){
      const bookingCta=document.createElement("section");
      bookingCta.className="guide-cta booking-affiliate-cta";
      bookingCta.innerHTML=`
        <p class="eyebrow">🏨 Alojamiento</p>
        <h2>¿Todavía te falta dónde dormir?</h2>
        <p>Si aún no has reservado alojamiento, puedes comparar opciones en Booking.com antes de cerrar el viaje.</p>
        <a class="primary-button" data-booking-source="guide_${guideSlug}" href="${bookingAffiliateUrl(`guide_${guideSlug}`)}" target="_blank" rel="sponsored noopener noreferrer">Buscar alojamiento en Booking.com →</a>
        <p class="affiliate-note">Enlace de afiliado: si reservas desde aquí, TravelApps puede recibir una comisión, sin coste adicional para ti.</p>
      `;
      const relatedNav=document.querySelector(".related-guides");
      const toolsCta=document.querySelector(".guide-tools-cta");
      if(relatedNav)relatedNav.insertAdjacentElement("beforebegin",bookingCta);
      else if(toolsCta)toolsCta.insertAdjacentElement("beforebegin",bookingCta);
      else document.querySelector(".guide-page")?.appendChild(bookingCta);
    }
  }

  if(path.includes("/que-me-llevo/")){
    const result=document.querySelector("#result");
    if(result&&!result.querySelector(".booking-affiliate-card")){
      const bookingCard=document.createElement("div");
      bookingCard.className="card booking-affiliate-card";
      bookingCard.innerHTML=`
        <div class="pill">🏨 Alojamiento</div>
        <h3>¿Te falta reservar alojamiento?</h3>
        <p>Cuando tengas el equipaje claro, puedes comparar alojamientos para tu viaje en Booking.com.</p>
        <a class="main hero-action" data-booking-source="que_me_llevo_result" href="${bookingAffiliateUrl("que_me_llevo_result")}" target="_blank" rel="sponsored noopener noreferrer">Buscar alojamiento en Booking.com →</a>
        <p class="legal">Enlace de afiliado: si reservas desde aquí, TravelApps puede recibir una comisión, sin coste adicional para ti.</p>
      `;
      const actions=result.querySelector(".actions");
      if(actions)actions.insertAdjacentElement("beforebegin",bookingCard);
      else result.appendChild(bookingCard);
    }
  }
}

document.addEventListener("DOMContentLoaded",()=>{
  addBookingAffiliateOffers();

  document.addEventListener("click",event=>{
    const bookingLink=event.target.closest("[data-booking-source]");
    if(!bookingLink)return;
    trackTravelApps("booking_affiliate_click",{
      link_source:bookingLink.dataset.bookingSource||"unknown",
      page_path:location.pathname
    });
  });
});

// Booking: placement and deep-link enhancements.
const BOOKING_DEEP_LINK_BASE_URL="https://www.kqzyfj.com/click-101874493-12180791";
const BOOKING_GUIDE_DESTINATIONS={
  "que-llevar-madrid-con-ninos":"Madrid"
};
const BOOKING_REF_DESTINATIONS={
  "guide_que-llevar-madrid-con-ninos":"Madrid"
};

function cleanBookingDestination(value){
  if(typeof value!=="string")return null;
  const cleaned=value.replace(/\s+/g," ").trim();
  if(cleaned.length<2||cleaned.length>80)return null;
  return cleaned;
}

function escapeBookingText(value){
  return String(value||"").replace(/[&<>"']/g,char=>({
    "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"
  })[char]);
}

function bookingDeepLinkUrl(sid,destination){
  const cleanedDestination=cleanBookingDestination(destination);
  const url=new URL(cleanedDestination?BOOKING_DEEP_LINK_BASE_URL:BOOKING_AFFILIATE_BASE_URL);
  if(sid)url.searchParams.set("sid",sid);

  if(cleanedDestination){
    const bookingDestination=new URL("https://www.booking.com/searchresults.es.html");
    bookingDestination.searchParams.set("ss",cleanedDestination);
    url.searchParams.set("url",bookingDestination.toString());
  }

  return url.toString();
}

function readKnownPackingDestination(){
  const params=new URLSearchParams(location.search);

  const rawPlan=params.get("plan");
  if(rawPlan){
    try{
      const plan=JSON.parse(rawPlan);
      const destination=cleanBookingDestination(plan?.destination);
      if(plan?.source==="elplanazo"&&destination)return destination;
    }catch(error){
      console.warn("No se pudo leer el destino de El Planazo para Booking",error);
    }
  }

  const refDestination=BOOKING_REF_DESTINATIONS[params.get("ref")];
  if(refDestination)return refDestination;

  const labelledDestination=document.querySelector("#trip")?.value?.match(/(?:^|\n)\s*Destino:\s*([^\n.]{2,80})/i)?.[1];
  return cleanBookingDestination(labelledDestination);
}

function bookingOfferMarkup({source,destination,context}){
  const safeDestination=escapeBookingText(destination);
  const isGuide=context==="guide";
  const title=destination
    ? `Tu alojamiento en ${safeDestination}, a un clic`
    : "Tu alojamiento, sin salirte del plan";
  const copy=destination
    ? `Ya tienes el viaje en marcha. Compara alojamientos en ${safeDestination} y deja también esta parte cerrada.`
    : "Ya tienes el viaje en marcha. Compara alojamientos en Booking.com y deja también esta parte cerrada.";
  const button=destination
    ? `Ver alojamientos en ${safeDestination} →`
    : "Comparar alojamientos en Booking.com →";

  return `
    <div class="booking-affiliate-heading">
      <span class="booking-affiliate-icon" aria-hidden="true">🏨</span>
      <div>
        <span class="booking-affiliate-kicker">Completa tu viaje</span>
        <h2>${title}</h2>
      </div>
    </div>
    <p class="booking-affiliate-copy">${copy}</p>
    <a class="${isGuide?"primary-button ":""}booking-affiliate-button"
      data-booking-source="${source}"
      href="${bookingDeepLinkUrl(source,destination)}"
      target="_blank"
      rel="sponsored noopener noreferrer">${button}</a>
    <p class="booking-affiliate-disclosure">Enlace de afiliado · Si reservas desde aquí, TravelApps puede recibir una comisión sin coste adicional para ti.</p>
  `;
}

function upgradeBookingAffiliateOffers(){
  const path=location.pathname;

  if(path.includes("/guias/")){
    const guideSlug=path.replace(/\/+$/,"").split("/").pop();
    const bookingCta=document.querySelector(".booking-affiliate-cta");

    if(guideSlug&&bookingCta){
      const destination=BOOKING_GUIDE_DESTINATIONS[guideSlug]||null;
      const source=`guide_${guideSlug}`;
      bookingCta.innerHTML=bookingOfferMarkup({source,destination,context:"guide"});

      const firstUsefulBlock=document.querySelector(".guide-content .guide-block:first-child");
      const guideLead=document.querySelector(".guide-lead");
      if(firstUsefulBlock)firstUsefulBlock.insertAdjacentElement("afterend",bookingCta);
      else if(guideLead)guideLead.insertAdjacentElement("afterend",bookingCta);
    }
  }

  if(path.includes("/que-me-llevo/")){
    const bookingCard=document.querySelector(".booking-affiliate-card");
    if(bookingCard){
      const destination=readKnownPackingDestination();
      bookingCard.innerHTML=bookingOfferMarkup({
        source:"que_me_llevo_result",
        destination,
        context:"packing"
      });
    }
  }
}

document.addEventListener("DOMContentLoaded",()=>{
  requestAnimationFrame(upgradeBookingAffiliateOffers);
});
