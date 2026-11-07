import { setRequestLocale } from "next-intl/server";
import { Navbar } from "@/components/landing/navbar";
import { HeroSequence } from "@/components/landing/hero-sequence";
import { TrustStrip } from "@/components/landing/trust-strip";
import { MeetSir } from "@/components/landing/meet-sir";
import { FeatureBento } from "@/components/landing/feature-bento";
import { HowItWorks } from "@/components/landing/how-it-works";
import { AnalysisPreview } from "@/components/landing/analysis-preview";
import { GradesSection } from "@/components/landing/grades-section";
import { TestimonialsMarquee } from "@/components/landing/testimonials-marquee";
import { FAQAccordion } from "@/components/landing/faq-accordion";
import { CTAFooter } from "@/components/landing/cta-footer";
import { LandingJsonLd } from "@/components/landing/json-ld";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <LandingJsonLd />
      <Navbar />
      <main className="flex min-h-screen flex-col overflow-x-hidden">
        {/* Section 1: Hero Sequence with Morphing Monogram & Slogan */}
        <HeroSequence />

        {/* Section 2: Trust Strip & Metrics */}
        <TrustStrip />

        {/* Section 3: Meet Sir (Malinga C Dissanayake) */}
        <MeetSir />

        {/* Section 4: Bento Feature Grid */}
        <FeatureBento />

        {/* Section 5: How It Works (3-Step Timeline) */}
        <HowItWorks />

        {/* Section 6: Live Analysis Diagnostic Preview */}
        <AnalysisPreview />

        {/* Section 7: Classes by Academic Grade (6–13) */}
        <GradesSection />

        {/* Section 8: Testimonials Marquee */}
        <TestimonialsMarquee />

        {/* Section 9: FAQ Accordion */}
        <FAQAccordion />

        {/* Section 10: Final CTA Band & Footer */}
        <CTAFooter />
      </main>
    </>
  );
}
