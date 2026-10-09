import ArelahExperience from "@/components/arelah/ArelahExperience";

export const metadata = {
  title: "O Livro de Arelah — Diário Lúdico da Realidade Paralela",
};

export default async function ArelahPage({
  params,
}: {
  params: Promise<{ numero: string }>;
}) {
  const { numero } = await params;
  const n = Number(numero);
  return <ArelahExperience numero={Number.isFinite(n) ? n : 1} />;
}
