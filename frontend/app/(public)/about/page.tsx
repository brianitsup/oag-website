import Image from "next/image";
import { getAboutUsData, getStrapiURL } from "@/lib/strapi";
import { ErrorState } from "@/components/ui/ErrorState";
import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ShieldCheck,
  Target,
  Eye,
  Scale,
  Landmark,
  Heart,
  Users,
  Globe,
  History,
  BookOpen,
  Star,
  CheckCircle2,
  Building2,
  Award,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about the mandate, mission, vision, and history of the Office of the Auditor General of Solomon Islands.",
};

export const revalidate = 60;

// ── Helpers ──────────────────────────────────────────────

/** Split a markdown body into { heading, content } sections on `## ` boundaries */
function parseSections(md: string) {
  const parts = md.split(/^## /m).filter(Boolean);
  return parts.map((part) => {
    const newline = part.indexOf("\n");
    const heading = part.slice(0, newline).trim();
    const content = part.slice(newline).trim();
    return { heading, content };
  });
}

/** Pull markdown list items (`- **bold** — rest`) into structured objects */
function parseListItems(content: string) {
  const lines = content.split("\n").filter((l) => /^[-*\d.]/.test(l.trim()));
  return lines.map((line) => {
    const cleaned = line.replace(/^[-*\d.]+\s*/, "").trim();
    const boldMatch = cleaned.match(/\*\*(.+?)\*\*\s*[—–-]\s*(.*)/);
    if (boldMatch) return { title: boldMatch[1], desc: boldMatch[2] };
    const boldOnly = cleaned.match(/\*\*(.+?)\*\*/);
    if (boldOnly) return { title: boldOnly[1], desc: cleaned.replace(/\*\*(.+?)\*\*\s*/, "") };
    return { title: cleaned, desc: "" };
  });
}

/** Extract plain paragraphs (non-list, non-heading lines) */
function parseParagraphs(content: string) {
  return content
    .split("\n\n")
    .map((p) => p.trim())
    .filter((p) => p && !p.startsWith("-") && !p.startsWith("*") && !p.startsWith("1."));
}

// ── Icon maps ────────────────────────────────────────────

const valueIcons: Record<string, React.ReactNode> = {
  Independence: <ShieldCheck className="size-5" />,
  Integrity: <Heart className="size-5" />,
  Professionalism: <Award className="size-5" />,
  Transparency: <Eye className="size-5" />,
  Excellence: <Star className="size-5" />,
};

const divisionIcons: Record<string, React.ReactNode> = {
  "Financial Audit Division": <BookOpen className="size-5" />,
  "Performance Audit Division": <Target className="size-5" />,
  "Compliance Audit Division": <Scale className="size-5" />,
  "Corporate Services Division": <Building2 className="size-5" />,
};

const affiliationIcons: Record<string, React.ReactNode> = {
  INTOSAI: <Globe className="size-5" />,
  PASAI: <Globe className="size-5" />,
  ASOSAI: <Globe className="size-5" />,
};

// ── Section renderers ────────────────────────────────────

function HeroSection({
  title,
  subtitle,
  imageUrl,
  imageAlt,
}: {
  title: string;
  subtitle: string;
  imageUrl: string | null;
  imageAlt: string;
}) {
  return (
    <section className="relative bg-primary/5 rounded-2xl overflow-hidden mb-12">
      <div className="flex flex-col lg:flex-row">
        <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <Badge variant="outline" className="w-fit mb-4 text-xs tracking-wider uppercase">
            Solomon Islands
          </Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            {title}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">{subtitle}</p>
        </div>
        {imageUrl && (
          <div className="relative w-full lg:w-[420px] h-64 lg:h-auto shrink-0">
            <Image src={imageUrl} alt={imageAlt} fill className="object-cover" unoptimized />
          </div>
        )}
      </div>
    </section>
  );
}

function MandateSection({ content }: { content: string }) {
  const paras = parseParagraphs(content);
  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <div className="flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary">
          <Landmark className="size-5" />
        </div>
        <CardTitle className="text-2xl">Our Mandate</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
        {paras.map((p, i) => (
          <p key={i} dangerouslySetInnerHTML={{ __html: inlineBold(p) }} />
        ))}
      </CardContent>
    </Card>
  );
}

function MissionVisionSection({
  mission,
  vision,
}: {
  mission: string;
  vision: string;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-secondary text-secondary-foreground border-none shadow-md overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
           <Target className="size-24" />
        </div>
        <CardHeader className="flex flex-row items-center gap-3 pb-2 relative z-10">
          <div className="flex items-center justify-center size-10 rounded-full bg-white/20">
            <Target className="size-5" />
          </div>
          <CardTitle className="text-xl text-secondary-foreground">Our Mission</CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <p className="leading-relaxed opacity-90">{stripMarkdown(mission)}</p>
        </CardContent>
      </Card>

      <Card className="bg-primary text-primary-foreground border-none shadow-md overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
           <Eye className="size-24" />
        </div>
        <CardHeader className="flex flex-row items-center gap-3 pb-2 relative z-10">
          <div className="flex items-center justify-center size-10 rounded-full bg-white/20 text-primary-foreground">
            <Eye className="size-5" />
          </div>
          <CardTitle className="text-xl text-primary-foreground">Our Vision</CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <p className="leading-relaxed opacity-90 text-primary-foreground">{stripMarkdown(vision)}</p>
        </CardContent>
      </Card>
    </div>
  );
}

function ConstitutionalRoleSection({ content }: { content: string }) {
  const items = parseListItems(content);
  const paras = parseParagraphs(content);
  const introPara = paras.find((p) => !p.startsWith("-"));
  const closingPara = paras.length > 1 ? paras[paras.length - 1] : null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <div className="flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary">
          <Scale className="size-5" />
        </div>
        <CardTitle className="text-2xl">Constitutional Role</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {introPara && (
          <p className="text-muted-foreground leading-relaxed">{stripMarkdown(introPara)}</p>
        )}
        <div className="space-y-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors"
            >
              <CheckCircle2 className="size-5 text-primary mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-foreground">{item.title}</span>
                {item.desc && (
                  <span className="text-muted-foreground"> — {item.desc}</span>
                )}
              </div>
            </div>
          ))}
        </div>
        {closingPara && (
          <p className="text-muted-foreground leading-relaxed text-sm italic border-l-2 border-primary/30 pl-4">
            {stripMarkdown(closingPara)}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function ValuesSection({ content }: { content: string }) {
  const items = parseListItems(content);
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary">
          <Heart className="size-5" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Our Values</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, i) => (
          <Card
            key={i}
            className="group hover:shadow-md hover:border-primary/30 transition-all"
          >
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center size-9 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {valueIcons[item.title] || <Star className="size-5" />}
                </div>
                <h3 className="font-bold text-lg">{item.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function StructureSection({ content }: { content: string }) {
  const items = parseListItems(content);
  const paras = parseParagraphs(content);
  const introPara = paras[0];

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary">
          <Users className="size-5" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Organisational Structure</h2>
      </div>
      {introPara && (
        <p className="text-muted-foreground leading-relaxed mb-6 max-w-3xl">
          {stripMarkdown(introPara)}
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item, i) => (
          <Card key={i} className="flex flex-row items-start gap-4 p-5">
            <div className="flex items-center justify-center size-11 rounded-xl bg-primary/10 text-primary shrink-0">
              {divisionIcons[item.title] || <Building2 className="size-5" />}
            </div>
            <div>
              <h3 className="font-bold mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AffiliationsSection({ content }: { content: string }) {
  const items = parseListItems(content);
  const paras = parseParagraphs(content);
  // Last paragraph is usually the closing description
  const closingPara = paras.length > 0 ? paras[paras.length - 1] : null;
  const isClosingList = closingPara?.startsWith("-") || closingPara?.startsWith("*");

  return (
    <Card className="bg-muted/30">
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <div className="flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary">
          <Globe className="size-5" />
        </div>
        <CardTitle className="text-2xl">International Affiliations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">The OAG is a proud member of:</p>
        <div className="flex flex-wrap gap-3">
          {items.map((item, i) => (
            <Badge
              key={i}
              variant="outline"
              className="px-4 py-2 text-sm font-semibold gap-2 bg-background"
            >
              {affiliationIcons[item.title] || <Globe className="size-4" />}
              <span>{item.title}</span>
              {item.desc && (
                <span className="text-muted-foreground font-normal hidden sm:inline">
                  — {item.desc}
                </span>
              )}
            </Badge>
          ))}
        </div>
        {closingPara && !isClosingList && (
          <p className="text-sm text-muted-foreground leading-relaxed">{stripMarkdown(closingPara)}</p>
        )}
      </CardContent>
    </Card>
  );
}

function HistorySection({ content }: { content: string }) {
  const paras = parseParagraphs(content);
  return (
    <Accordion defaultValue={["history"]}>
      <AccordionItem value="history" className="border rounded-xl px-6">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary">
              <History className="size-5" />
            </div>
            <span className="text-2xl font-bold tracking-tight">History</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-4 text-muted-foreground leading-relaxed pl-[52px] pb-6">
          {paras.map((p, i) => (
            <p key={i}>{stripMarkdown(p)}</p>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

// ── Inline helpers ───────────────────────────────────────

function stripMarkdown(text: string) {
  return text.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1");
}

function inlineBold(text: string) {
  return text.replace(/\*\*(.+?)\*\*/g, "<strong class='text-foreground font-semibold'>$1</strong>");
}

// ── Section router ───────────────────────────────────────

const sectionMap: Record<string, (content: string, allSections: ReturnType<typeof parseSections>) => React.ReactNode> = {
  "Our Mandate": (c) => <MandateSection content={c} />,
  "Constitutional Role": (c) => <ConstitutionalRoleSection content={c} />,
  "Our Values": (c) => <ValuesSection content={c} />,
  "Organisational Structure": (c) => <StructureSection content={c} />,
  "International Affiliations": (c) => <AffiliationsSection content={c} />,
  "History": (c) => <HistorySection content={c} />,
};

// ── Page component ───────────────────────────────────────

export default async function AboutPage() {
  let aboutData;
  try {
    aboutData = await getAboutUsData();
  } catch (error) {
    console.error('Error fetching About Us data:', error);
    return <ErrorState message="Content for the About Us page is currently unavailable." />;
  }

  if (!aboutData) {
    return <ErrorState message="Content for the About Us page is currently unavailable." />;
  }

  const imageUrl = aboutData.image?.url ? getStrapiURL(aboutData.image.url) : null;
  const sections = aboutData.body ? parseSections(aboutData.body) : [];

  // Extract mission & vision for the hero cards
  const missionSection = sections.find((s) => s.heading === "Our Mission");
  const visionSection = sections.find((s) => s.heading === "Our Vision");

  // First paragraph from mandate section for the hero subtitle
  const mandateSection = sections.find((s) => s.heading === "Our Mandate");
  const heroSubtitle = mandateSection
    ? parseParagraphs(mandateSection.content)[0]?.replace(/\*\*(.+?)\*\*/g, "$1") || ""
    : "";

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl space-y-10">
      {/* Hero banner */}
      <HeroSection
        title={aboutData.title || "About the Office of the Auditor General"}
        subtitle={heroSubtitle}
        imageUrl={imageUrl}
        imageAlt={aboutData.image?.alternativeText || "Office of the Auditor General"}
      />

      {/* Mission & Vision cards */}
      {missionSection && visionSection && (
        <MissionVisionSection
          mission={missionSection.content}
          vision={visionSection.content}
        />
      )}

      <Separator />

      {/* Remaining sections */}
      {sections
        .filter((s) => s.heading !== "Our Mission" && s.heading !== "Our Vision")
        .map((section, i) => {
          const renderer = sectionMap[section.heading];
          if (renderer) {
            return <div key={i}>{renderer(section.content, sections)}</div>;
          }
          // Fallback for unknown sections
          return (
            <Card key={i}>
              <CardHeader>
                <CardTitle className="text-2xl">{section.heading}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {stripMarkdown(section.content)}
              </CardContent>
            </Card>
          );
        })}
    </div>
  );
}
