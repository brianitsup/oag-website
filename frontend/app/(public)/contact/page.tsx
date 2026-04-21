import { getContactSettings } from "@/lib/strapi";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Office of the Auditor General.",
};

export const revalidate = 60;

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const success = resolvedParams.success === 'true';
  const error = resolvedParams.error === 'true';
  
  const contactData = await getContactSettings();

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-4">Contact Us</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          We welcome your inquiries, feedback, and reports. Please use the form below or contact us directly using the provided details.
        </p>
      </div>

      {success && (
        <div className="mb-8 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-r-md">
          <p className="font-bold">Thank you for contacting us!</p>
          <p>Your message has been successfully sent. We will get back to you shortly.</p>
        </div>
      )}

      {error && (
        <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-md">
          <p className="font-bold">Message failed to send.</p>
          <p>There was an error processing your request. Please try again or email us directly.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Contact Form */}
        <div className="lg:col-span-3 bg-card border rounded-xl p-6 md:p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
          <form action="/api/contact" method="POST" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                <input required type="text" id="name" name="name" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                <input required type="email" id="email" name="email" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="john@example.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">Subject</label>
              <input required type="text" id="subject" name="subject" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="How can we help?" />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">Message</label>
              <textarea required id="message" name="message" rows={5} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Your message here..."></textarea>
            </div>
            <Button type="submit" size="lg" className="w-full md:w-auto">Send Message</Button>
          </form>
        </div>

        {/* Contact Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-primary/5 border rounded-xl p-6 md:p-8">
            <h3 className="text-xl font-bold mb-6">Office Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Address</p>
                <p className="font-medium">{contactData?.address || "123 Government Way, Capital City, 10001"}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Phone</p>
                <p className="font-medium">{contactData?.phone || "+1 (555) 123-4567"}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Email</p>
                <p className="font-medium text-primary hover:underline"><a href={`mailto:${contactData?.email || "info@oag.gov"}`}>{contactData?.email || "info@oag.gov"}</a></p>
              </div>
            </div>
          </div>

          {contactData?.googleMapsEmbedUrl && (
            <div className="rounded-xl overflow-hidden border h-64 bg-muted">
              <iframe 
                src={contactData.googleMapsEmbedUrl} 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
