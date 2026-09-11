import { redirect } from "next/navigation";

export default function SchemesPage() {
  redirect("/opportunities?category=Schemes");
}