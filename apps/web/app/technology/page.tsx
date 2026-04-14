import { TechNav } from "@/components/technology/TechNav";
import { TechHero } from "@/components/technology/TechHero";
import { ArchitectureDiagram } from "@/components/technology/ArchitectureDiagram";
import { HowItWorks } from "@/components/technology/HowItWorks";
import { AgentLayer } from "@/components/technology/AgentLayer";
import { ExecutionLayer } from "@/components/technology/ExecutionLayer";
import { StackDetail } from "@/components/technology/StackDetail";
import { SecurityPrivacy } from "@/components/technology/SecurityPrivacy";
import { TechFooter } from "@/components/technology/TechFooter";

export default function TechnologyPage() {
  return (
    <div className="bg-[#F5F2EB] min-h-screen" style={{ fontFamily: "var(--font-dm-sans, 'DM Sans'), system-ui, sans-serif" }}>
      <TechNav />
      <TechHero />
      <ArchitectureDiagram />
      <HowItWorks />
      <AgentLayer />
      <ExecutionLayer />
      <StackDetail />
      <SecurityPrivacy />
      <TechFooter />
    </div>
  );
}
