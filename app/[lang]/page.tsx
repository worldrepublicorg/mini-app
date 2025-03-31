import { redirect } from "next/navigation";

export default function Home({
  params: { lang },
}: {
  params: { lang: string };
}) {
  redirect(`/${lang}/earn`);
}
