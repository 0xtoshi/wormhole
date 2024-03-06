import LandingNavbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Wormhole EVM Batch Airdrop Checker</title>
      </Head>
      <LandingNavbar />

      <Hero />
    </>
  );
}
