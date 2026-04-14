import Link from "next/link";

export function TechNav() {
  return (
    <nav className="border-b border-[#1B4332]/10 bg-[#F5F2EB]">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 lg:px-16 py-5">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-[#1B4332] rounded-lg flex items-center justify-center text-white text-sm font-medium tracking-tight group-hover:bg-[#1B4332]/90 transition-colors">C</div>
          <span className="text-[#1B4332] text-[15px] font-medium tracking-tight">CHRIS-OS</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/newsroom" className="text-[13px] text-stone-400 hover:text-[#1B4332] transition-colors hidden sm:block">Newsroom</Link>
          <span className="text-[13px] font-medium text-[#1B4332] border-b border-[#1B4332]/40 pb-0.5">Technology</span>
          <Link href="/#roi-calculator" className="text-[13px] text-stone-400 hover:text-[#1B4332] transition-colors hidden sm:block">ROI</Link>
          <Link href="/" className="text-[13px] text-stone-400 hover:text-[#1B4332] transition-colors hidden md:block">chris-os.io</Link>
        </div>
      </div>
    </nav>
  );
}
