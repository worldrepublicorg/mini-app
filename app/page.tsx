import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/"); // The middleware will handle language detection
}
