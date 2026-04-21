import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Design System | OAG",
};

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header Example */}
      <header className="bg-primary text-primary-foreground py-4 px-8 shadow-md">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">OAG Solomon Islands</h1>
          <nav className="space-x-6 text-sm font-medium hidden md:flex">
            <a href="#" className="hover:underline underline-offset-4">Home</a>
            <a href="#" className="hover:underline underline-offset-4">Audit Reports</a>
            <a href="#" className="hover:underline underline-offset-4">About Us</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-8 space-y-12">
        <section>
          <h2 className="text-3xl font-semibold mb-6 text-primary">Color Palette Showcase</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <Card className="border-border">
              <div className="h-32 bg-primary rounded-t-lg flex items-end p-4">
                <span className="text-primary-foreground font-semibold">Primary (Ocean Blue)</span>
              </div>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground">Used for headers, primary navigation, and main buttons. Conveys trust and authority.</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <div className="h-32 bg-secondary rounded-t-lg flex items-end p-4">
                <span className="text-secondary-foreground font-semibold">Secondary (Land Green)</span>
              </div>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground">Used for secondary actions, accents, and success states. Grounding and professional.</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <div className="h-32 bg-accent rounded-t-lg flex items-end p-4">
                <span className="text-accent-foreground font-semibold">Accent (Sun Yellow)</span>
              </div>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground">Used sparingly for call-to-actions, alerts, and highlighting important statistics.</p>
              </CardContent>
            </Card>

          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6 text-primary">Interactive Elements</h2>
          <div className="flex flex-wrap gap-4 items-center p-6 bg-muted rounded-lg border border-border">
            <Button variant="default" size="lg">Primary Action</Button>
            <Button variant="secondary" size="lg">Secondary Action</Button>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90" size="lg">Accent Action</Button>
            <Button variant="outline" size="lg">Outline Button</Button>
            <Button variant="ghost" size="lg">Ghost Button</Button>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-primary">Typography Context</h2>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-foreground">Heading 1: Building a Better Future</h1>
            <h2 className="text-3xl font-semibold text-primary">Heading 2: Promoting Transparency</h2>
            <h3 className="text-2xl font-medium text-secondary">Heading 3: Core Functions</h3>
            <p className="text-base text-muted-foreground max-w-3xl leading-relaxed">
              The Office of the Auditor General (OAG) plays a crucial role in promoting accountability, transparency, 
              and effective public administration in the Solomon Islands. Our independent audits provide assurance to 
              Parliament and the public regarding the use of public resources.
            </p>
          </div>
        </section>
      </main>

      {/* Footer Example */}
      <footer className="bg-secondary text-secondary-foreground py-8 mt-auto">
        <div className="max-w-5xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">&copy; {new Date().getFullYear()} Office of the Auditor General, Solomon Islands.</p>
          <div className="space-x-4 text-sm">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Use</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
