export default function HeroSection() {
  return (
    <header className="relative w-full overflow-hidden bg-black h-[100svh] max-h-screen">
      <video
        src="/videos/hero-landing-page.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-contain object-top block"
      />
    </header>
  );
}
