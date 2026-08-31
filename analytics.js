const GA_ID="G-T1MEJND383";
const CONSENT_KEY="travelapps_analytics_consent";

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

document.addEventListener("DOMContentLoaded",()=>{
  if(localStorage.getItem(CONSENT_KEY)==="accepted")loadAnalytics();
  else showConsent();

  document.addEventListener("click",event=>{
    const link=event.target.closest("a");
    const button=event.target.closest("button");

    if(link?.href.includes("amazon.es")){
      trackTravelApps("amazon_click",{
        product_name:link.closest(".item")?.querySelector(".name")?.textContent?.trim()||"recomendacion",
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

    if(button?.id==="shareWhatsApp"){
      trackTravelApps("whatsapp_share",{page_path:location.pathname});
    }

    if(button?.id==="analyze"||button?.id==="importedGenerate"){
      trackTravelApps("packing_started",{source:button.id==="importedGenerate"?"el_planazo":"manual"});
    }
  });
});
