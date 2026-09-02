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

document.addEventListener("DOMContentLoaded",()=>{
  normalizeAmazonTrackingLinks();

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
