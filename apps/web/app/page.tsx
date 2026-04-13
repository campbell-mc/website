import { redirect } from "next/navigation";

export default function Home() {
  // Demo mode: go straight to DON dashboard (Sarah Mitchell)
  redirect("/dashboard");
}
