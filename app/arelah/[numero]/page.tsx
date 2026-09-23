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
  return <ArelahExperience numero={Number(numero) || 1} />;
}
