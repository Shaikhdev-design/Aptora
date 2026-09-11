import { redirect } from "next/navigation";

export default function ScholarshipsPage() {
  redirect("/opportunities?category=Scholarships");
}