import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import PlausibleProvider from "next-plausible";

const domain = `rkstudy.co.uk`;

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PlausibleProvider domain={domain}>
      <AuthProvider>
        <div data-theme="light">
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </div>
      </AuthProvider>
    </PlausibleProvider>
  );
}
