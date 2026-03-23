import { useEffect } from "react";

export function PlayPage() {
  useEffect(() => {
    const existingLink = document.getElementById("play-page-css");
    const existingScript = document.getElementById("play-page-js");

    if (!existingLink) {
      const link = document.createElement("link");
      link.id = "play-page-css";
      link.rel = "stylesheet";
      link.href = "https://h5-static.aoneroom.com/spa/videoPlayPage/assets/index.8a899ae7.css";
      document.head.appendChild(link);
    }

    if (!(window as any).ENV) {
      if (/(localhost|10\.|h5-test)/i.test(location.origin)) {
        (window as any).ENV = "test";
      } else {
        (window as any).ENV = "prod";
      }
    }

    if (!(window as any).onResumeWebView) {
      (window as any).onResumeWebView = function () {};
    }

    if (!(window as any).ath_send) {
      const evt = "ath_send";
      (window as any).sendTrackerName = evt;
      (window as any)[evt] =
        (window as any)[evt] ||
        function () {
          ((window as any)[evt].queue = (window as any)[evt].queue || []).push(arguments);
        };
      (window as any)[evt].start = +new Date();
      (window as any)["ath_elpv"] =
        (window as any)["ath_elpv"] ||
        function () {
          ((window as any)["ath_elpv"].queue =
            (window as any)["ath_elpv"].queue || []).push(arguments);
        };

      const elem = document.createElement("script");
      elem.async = true;
      elem.src = "https://h5-static.aoneroom.com/sdk/athena-unify.js";
      (document.body || document.documentElement).appendChild(elem);
    }

    if (!(window as any).etm_setting) {
      (window as any).etm_setting = {
        openEtm: "open",
        appid: 2570,
        app_vn: "1.0.0",
        env: (window as any).ENV,
        comParam: {
          os: /iphone|ipad|ipod|macintosh/.test(navigator.userAgent.toLowerCase())
            ? "apple"
            : "android",
          projectId: "spa-mb-videoplay",
        },
        loc: "ali-eur",
        web_click: "close",
        web_leave: "close",
        web_stay: "close",
        js_bridge: true,
      };
    }

    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "play-page-js";
      script.type = "module";
      script.crossOrigin = "anonymous";
      script.src =
        "https://h5-static.aoneroom.com/spa/videoPlayPage/assets/index.f9ce42ed.js";
      document.head.appendChild(script);
    }

    return () => {
      const link = document.getElementById("play-page-css");
      const script = document.getElementById("play-page-js");
      if (link) link.remove();
      if (script) script.remove();
    };
  }, []);

  return (
    <div
      id="app"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        margin: 0,
        padding: 0,
        zIndex: 9999,
        background: "#000",
      }}
    />
  );
}
