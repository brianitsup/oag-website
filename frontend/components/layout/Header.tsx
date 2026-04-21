import Link from "next/link";
import Image from "next/image";
import { Navigation } from "./Navigation";
import { getContactSettings, getStrapiURL } from "@/lib/strapi";

export async function Header() {
  const contactData = await getContactSettings();
  const logoUrl = contactData?.logo?.url ? getStrapiURL(contactData.logo.url) : null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="h-1 w-full bg-accent" /> {/* Flag Yellow Accent Line */}
      <div className="container mx-auto px-4 flex h-20 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            {logoUrl ? (
              <div className="relative size-12 sm:size-14 transition-transform group-hover:scale-105">
                <Image
                  src={logoUrl}
                  alt="Solomon Islands Coat of Arms"
                  fill
                  className="object-contain"
                  priority
                  unoptimized
                />
              </div>
            ) : (
              <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                OAG
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-bold text-lg sm:text-xl tracking-tight text-primary leading-tight">
                Office of the Auditor General
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">
                Solomon Islands
              </span>
            </div>
          </Link>
        </div>
        <div className="hidden md:flex flex-1 justify-end">
          <Navigation />
        </div>
      </div>
    </header>
  );
}
