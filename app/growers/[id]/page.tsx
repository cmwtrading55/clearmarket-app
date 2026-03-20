import GrowerDetail from "./GrowerDetail";

/**
 * Grower profile is fully client-rendered (fetches via useEffect).
 * We provide a placeholder param so the static export generates the shell page;
 * any real wallet ID is resolved client-side.
 */
export async function generateStaticParams() {
  return [{ id: "placeholder" }];
}

export default async function GrowerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <GrowerDetail params={params} />;
}
