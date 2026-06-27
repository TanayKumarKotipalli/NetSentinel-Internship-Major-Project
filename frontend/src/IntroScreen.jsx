import { useEffect, useRef, useState } from "react";
import Typed from "typed.js";
import logo from "./assets/netsentinel_logo.png";
import "./IntroScreen.css";

export default function IntroScreen({ onFinish }) {

  const [phase, setPhase] = useState(0);
  const typedTarget = useRef(null);
  useEffect(() => {

   if (!typedTarget.current) return;
   const typed = new Typed(typedTarget.current, {
      strings: [

        "NETSENTINEL AI"

      ],

      typeSpeed: 95,

      startDelay: 400,

      backSpeed: 0,

      smartBackspace: false,

      loop: false,

      showCursor: true,

      cursorChar: "▋",

      onComplete: () => {

        setTimeout(() => {

          setPhase(1);

        }, 400);

        setTimeout(() => {

          setPhase(2);

        }, 1500);

        setTimeout(() => {

          setPhase(3);

        }, 2600);

        setTimeout(() => {

          setPhase(4);

        }, 4300);

        setTimeout(() => {

          setPhase(5);

        }, 6000);

        setTimeout(() => {

          if ("speechSynthesis" in window) {

            speechSynthesis.cancel();

            const msg = new SpeechSynthesisUtterance(

              "Welcome to NetSentinel. Initializing intelligent network defense. System online."

            );

            msg.rate = 0.85;

            msg.pitch = 0.75;

            msg.volume = 1;

            const voices = speechSynthesis.getVoices();

            const maleVoice =

              voices.find(v =>

                v.name.toLowerCase().includes("david")

              ) ||

              voices.find(v =>

                v.name.toLowerCase().includes("mark")

              ) ||

              voices.find(v =>

                v.name.toLowerCase().includes("english")

              );

            if (maleVoice) {

              msg.voice = maleVoice;

            }

            speechSynthesis.speak(msg);

          }

        }, 2700);

        setTimeout(() => {

          document.querySelector(".intro")?.classList.add("fadeOut");

        }, 8200);

        setTimeout(() => {

          onFinish();

        }, 9000);

      }

    });

    return () => {

      typed.destroy();

      speechSynthesis.cancel();

    };

  }, [onFinish]);

  return (

    <div className="intro">

      <div className="grid"></div>

      <div className="scanline"></div>

      <div className="ambientGlow"></div>

      <div className="introContent">

        <div className="titleContainer">

          <h1 className="title">

            <span ref={typedTarget}></span>

          </h1>

        </div>

        {
          phase >= 1 &&
          (
    <div className="tagline">

        Traffic. Threats. Intelligence.

    </div>
)

}

{

phase >= 2 && (

<div className="logoContainer">

    <img
        src={logo}
        alt="NetSentinel"
        className="logo"
    />

</div>

)

}

{

phase >= 3 && (

<div className="bootPanel">

    <div className="bootTitle">

        SYSTEM INITIALIZATION

    </div>

    <div className="bootItem">

        <span>Initializing AI Core</span>

        <span className="success">✓</span>

    </div>

    <div className="bootItem">

        <span>Loading Threat Intelligence</span>

        <span className="success">✓</span>

    </div>

    <div className="bootItem">

        <span>Packet Analyzer Online</span>

        <span className="success">✓</span>

    </div>

    <div className="bootItem">

        <span>Machine Learning Engine</span>

        <span className="success">✓</span>

    </div>

    <div className="bootItem">

        <span>Firewall Integration</span>

        <span className="success">✓</span>

    </div>

    <div className="bootItem">

        <span>Live Traffic Monitoring</span>

        <span className="success">✓</span>

    </div>

    <div className="bootItem">

        <span>Threat Intelligence Feed</span>

        <span className="success">✓</span>

    </div>

    <div className="bootItem">

        <span>Security Dashboard Ready</span>

        <span className="success">✓</span>

    </div>

</div>

)

}

{

phase >= 4 && (

<div className="onlineBox">

    <div className="pulseDot"></div>

    SYSTEM ONLINE

</div>

)

}

{

phase >= 5 && (

<div className="launchText">

    Launching Dashboard...

</div>

)

}

        </div>
            </div>

  );

}