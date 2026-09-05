(() => {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js", { scope: "/" })
        .catch(error => console.warn("No se pudo registrar la PWA de TravelApps", error));
    });
  }
})();
