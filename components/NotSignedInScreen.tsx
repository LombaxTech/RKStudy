import { useEffect, useRef, useState } from "react";

// @ts-ignore
// import BIRDS from "vanta/dist/vanta.birds.min";
import GLOBE from "vanta/dist/vanta.globe.min";
import * as THREE from "three";

import Link from "next/link";

export default function NotSignedInScreen() {
  const [vantaEffect, setVantaEffect] = useState<any>(0);
  const vantaRef = useRef(null);

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        GLOBE({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          // minHeight: 200.0,
          // minWidth: 200.0,'
          scale: 1.0,
          scaleMobile: 1.0,
          //   backgroundColor: "#FFC0CB",
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div
      className={`flex flex-col min-h-screen items-center justify-center gap-6  ${
        vantaEffect ? "text-white" : ""
      }`}
      ref={vantaRef}
    >
      <h1 className="text-6xl font-bold">RKStudy</h1>
      <h3 className="text-2xl font-normal text-center">
        Boost Your Studies With AI
      </h3>
      <Link href={`/signin`}>
        <button className="btn btn-secondary btn-lg">Get Started</button>
      </Link>
    </div>
  );
}
