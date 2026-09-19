import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPoemaBySlug, poemas } from "@/lib/poemas";
import PoemaExperience from "@/components/poema/PoemaExperience";

export function generateStaticParams() {
  return poemas.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const poema = getPoemaBySlug(slug);
  if (!poema) return {};
  return {
    title: `${poema.titulo} — Diário Lúdico da Realidade Paralela`,
    description: poema.preview.join(" "),
    openGraph: {
      title: poema.titulo,
      description: poema.preview.join(" "),
      images: [poema.imagem],
    },
  };
}

export default async function PoemaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const poema = getPoemaBySlug(slug);
  if (!poema) notFound();
  return <PoemaExperience poema={poema} />;
}
