import LaunchpadDetail from "./LaunchpadDetail";

/**
 * Launchpad detail is fully client-rendered (fetches via useEffect).
 * We provide a placeholder param so the static export generates the shell page;
 * any real ID is resolved client-side.
 */
export async function generateStaticParams() {
  return [{ id: "placeholder" }];
}

export default async function LaunchpadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <LaunchpadDetail id={id} />;
}
