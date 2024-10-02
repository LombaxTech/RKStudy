import { useEffect, useRef, useState } from "react";

// @ts-ignore
// import BIRDS from "vanta/dist/vanta.birds.min";
import GLOBE from "vanta/dist/vanta.globe.min";
import * as THREE from "three";

import Link from "next/link";

type Mode = "home" | "privacy policy" | "terms and conditions";

export default function NotSignedInScreen() {
  const [vantaEffect, setVantaEffect] = useState<any>(0);
  const vantaRef = useRef(null);

  const [mode, setMode] = useState<Mode>("home");

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
      className={`flex flex-col min-h-screen max-h-screen overflow-hidden ${
        vantaEffect ? "text-white" : ""
      }`}
      ref={vantaRef}
    >
      {mode === "home" && <Home />}
      {mode === "terms and conditions" && <Terms setMode={setMode} />}
      {mode === "privacy policy" && <PrivacyPolicy setMode={setMode} />}
      {/* PRIVACY POLICY AND TERMS OF CONDITIONS */}
      <div className="py-8 flex justify-center gap-8 z-10">
        <span
          onClick={() => setMode("privacy policy")}
          className="text-lg cursor-pointer"
        >
          Privacy Policy
        </span>
        <span
          onClick={() => setMode("terms and conditions")}
          className="text-lg cursor-pointer"
        >
          Terms And Conditions
        </span>
      </div>
    </div>
  );
}

const Home = () => {
  return (
    <div className="flex-1 flex flex-col justify-center items-center gap-6 z-10">
      <h1 className="text-6xl font-bold">RKStudy</h1>
      <h3 className="text-2xl font-normal text-center">
        Generate Quizzes From PDF Notes
        {/* Boost Your Studies With AI Quizzes, Notes And More! */}
      </h3>
      <div className="flex flex-col gap-4">
        <Link href={`/demo`}>
          <button className="btn btn-primary btn-lg">
            Try The Demo (No Account Required)
          </button>
        </Link>
        <Link href={`/signin`}>
          <button className="w-full btn btn-secondary btn-lg">
            Sign In / Create Account
          </button>
        </Link>
      </div>
    </div>
  );
};

const PrivacyPolicy = ({ setMode }: { setMode: any }) => {
  return (
    <div className="flex-1 flex flex-col pt-10 items-center gap-6 z-10 overflow-y-auto px-10">
      <span
        className="text-lg underline cursor-pointer"
        onClick={() => setMode("home")}
      >
        Go Back
      </span>
      <h1 className="text-6xl font-bold">Privacy Policy</h1>
      <p className="overflow-y-auto py-10 prose prose-lg text-white prose-h2:text-white prose-h3:text-white">
        <h2>Privacy Policy</h2>

        <p>
          At RKStudy, we are committed to protecting your privacy. This policy
          outlines how we handle your information.
        </p>

        <h3>1. Information We Collect</h3>
        <p>
          We do not collect any personal information beyond what is necessary
          for account creation. Users may sign up with an email address, but no
          other personal details are required.
        </p>

        <h3>2. Use of Information</h3>
        <p>
          Your email is only used for account access and communication purposes.
          We do not share or sell your information to third parties.
        </p>

        <h3>3. Data Security</h3>
        <p>
          We take steps to protect your data from unauthorized access. However,
          no online service can be completely secure, so you use the app at your
          own risk.
        </p>

        <h3>4. Analytics</h3>
        <p>We do not track or collect any analytics data from user activity.</p>

        <h3>5. Your Rights</h3>
        <p>
          As a UK-based app, we comply with GDPR regulations. You have the right
          to request, correct, or delete any personal data we may hold.
        </p>

        <h3>6. Contact Us</h3>
        <p>
          If you have any questions about this privacy policy, please reach out
          to us at:
        </p>
        <ul>
          <li>
            <strong className="text-white">Email:</strong> rakib@rkstudy.co.uk
          </li>
        </ul>
      </p>
    </div>
  );
};

const Terms = ({ setMode }: { setMode: any }) => {
  return (
    <div className="flex-1 flex flex-col pt-10 items-center gap-6 z-10 overflow-y-auto px-10">
      <span
        className="text-lg underline cursor-pointer"
        onClick={() => setMode("home")}
      >
        Go Back
      </span>
      <h1 className="text-6xl font-bold">Terms And Conditions</h1>
      <p className="overflow-y-auto py-10 prose prose-lg text-white prose-h2:text-white prose-h3:text-white">
        <h2 className="text-white">Terms and Conditions</h2>

        <p>By using RKStudy, you agree to the following terms:</p>

        <h3 className="text-white">1. Services</h3>
        <p>
          RKStudy allows users to generate quizzes for study purposes from their
          notes. The service is provided "as is" without any warranties or
          guarantees.
        </p>

        <h3 className="text-white">2. User Accounts</h3>
        <p>
          Users may sign up using their email to access the full features of the
          app. You are responsible for maintaining the confidentiality of your
          account and password.
        </p>

        <h3 className="text-white">3. Use of Service</h3>
        <p>
          You agree to use RKStudy only for personal, educational purposes.
          Misuse of the platform, such as uploading offensive content or
          violating laws, is prohibited.
        </p>

        <h3 className="text-white">4. Intellectual Property</h3>
        <p>
          The content generated on RKStudy (such as quizzes) is owned by the
          user. However, the platform and its underlying technology remain the
          intellectual property of RKStudy.
        </p>

        <h3 className="text-white">5. Liability</h3>
        <p>
          RKStudy is not responsible for any damages or losses resulting from
          the use of the app.
        </p>

        <h3 className="text-white">6. Changes to the Terms</h3>
        <p>
          We reserve the right to update these terms at any time. Continued use
          of the app implies acceptance of the updated terms.
        </p>

        <h3 className="text-white">7. Governing Law</h3>
        <p>These terms are governed by the laws of the United Kingdom.</p>
      </p>
    </div>
  );
};
