import Link from "next/link";
import { getContactSettings } from "@/lib/strapi";

export async function Footer() {
  const contactData = await getContactSettings();

  const address = contactData?.address || "1st Floor, Chrysalis Building, Mud Alley, Honiara, Solomon Islands";
  const phone = contactData?.phone || "(+677) 21461 / 21462";
  const email = contactData?.email || "auditorgeneral@oag.gov.sb";

  return (
    <footer className="bg-secondary text-secondary-foreground py-16">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Office of the Auditor General</h3>
          <p className="text-sm text-secondary-foreground/80 leading-relaxed max-w-xs">
            Ensuring transparency, accountability, and integrity in public administration for the benefit of all Solomon Islanders.
          </p>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-bold">Quick Links</h3>
          <ul className="space-y-2 text-sm text-secondary-foreground/70">
            <li>
              <Link href="/reports" className="hover:text-accent transition-colors">
                Audit Reports
              </Link>
            </li>
            <li>
              <Link href="/news" className="hover:text-accent transition-colors">
                News & Updates
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-accent transition-colors">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-bold">Contact Information</h3>
          <address className="text-sm text-secondary-foreground/70 not-italic space-y-3">
            <p className="flex items-start gap-2">{address}</p>
            <p>Phone: {phone}</p>
            <p>Email: <a href={`mailto:${email}`} className="hover:text-accent transition-colors">{email}</a></p>
          </address>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-secondary-foreground/10 flex flex-col md:flex-row justify-between items-center text-xs text-secondary-foreground/50 gap-4">
        <p>&copy; {new Date().getFullYear()} Office of the Auditor General. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <a href={process.env.NEXT_PUBLIC_STRAPI_URL ? `${process.env.NEXT_PUBLIC_STRAPI_URL}/admin` : "http://localhost:1337/admin"} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
            Admin Portal
          </a>
        </div>
      </div>
    </footer>
  );
}
