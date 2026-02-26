import { supabase } from "@/lib/supabase";
import LaunchpadDetail from "./LaunchpadDetail";

export async function generateStaticParams() {
  const { data } = await supabase
    .from("launchpad_listings")
    .select("id");

  return (data || []).map((row: { id: string }) => ({ id: row.id }));
}

export default async function LaunchpadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <LaunchpadDetail id={id} />;
}
