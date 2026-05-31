import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" data-scroll-behavior="smooth">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#05070d" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}