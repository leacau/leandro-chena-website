import Hero from "@/components/hero"
import AboutPreview from "@/components/about-preview"
import Services from "@/components/services"
import Testimonials from "@/components/testimonials"
import ContactForm from "@/components/contact-form"
import CallToAction from "@/components/call-to-action"

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      <Hero />
      <AboutPreview />
      <Services />
      <Testimonials />
      <ContactForm />
      <CallToAction />
    </div>
  )
}

