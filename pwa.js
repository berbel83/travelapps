(() => {
  if (!("serviceWorker" in navigator)) return;

  navigator.serviceWorker
    .register("/sw.js", { scope: "/", updateViaCache: "none" })
    .then(registration => registration.update())
    .catch(error => console.warn("No se pudo registrar la PWA de TravelApps", error));
})();
