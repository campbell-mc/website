"use client";

import { NewsroomNav } from "@/components/newsroom/NewsroomNav";
import { CuratorHero } from "@/components/newsroom/CuratorHero";
import { NewsroomFeed } from "@/components/newsroom/NewsroomFeed";
import { SourceRegistry } from "@/components/newsroom/SourceRegistry";
import { NewsroomFooter } from "@/components/newsroom/NewsroomFooter";
import { RoiCalculator } from "@/components/RoiCalculator";

export default function NewsroomPage() {
  return (
    <div className="bg-[#F5F2EB] min-h-screen" style={{ fontFamily: "var(--font-dm-sans, 'DM Sans'), system-ui, sans-serif" }}>
      <NewsroomNav />
      <CuratorHero />
      <NewsroomFeed />
      <SourceRegistry />
      <RoiCalculator />
      <NewsroomFooter />
    </div>
  );
}
