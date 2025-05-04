import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Paintbrush, Users2, Cloud, Download, Palette, Zap } from "lucide-react";

const features = [
  {
    icon: <Paintbrush className="w-10 h-10 text-primary" />,
    title: "Professional Tools",
    description: "Advanced brushes and tools for digital art creation"
  },
  {
    icon: <Users2 className="w-10 h-10 text-primary" />,
    title: "Real-time Collaboration",
    description: "Work together with artists in real-time"
  },
  {
    icon: <Cloud className="w-10 h-10 text-primary" />,
    title: "Cloud Storage",
    description: "Auto-save and sync across all your devices"
  },
  {
    icon: <Download className="w-10 h-10 text-primary" />,
    title: "Easy Export",
    description: "Export in multiple formats and resolutions"
  },
  {
    icon: <Palette className="w-10 h-10 text-primary" />,
    title: "Custom Brushes",
    description: "Create and share custom brush presets"
  },
  {
    icon: <Zap className="w-10 h-10 text-primary" />,
    title: "Fast Performance",
    description: "Optimized for smooth drawing experience"
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-slate-50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to Create
          </h2>
          <p className="text-xl text-muted-foreground">
            Powerful features to bring your artistic vision to life
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-2">
              <CardHeader>
                <div className="mb-4">{feature.icon}</div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
