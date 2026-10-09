import AdminComentarios from "@/components/AdminComentarios";

export const metadata = {
  title: "Administração — Diário Lúdico da Realidade Paralela",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminComentarios />;
}
