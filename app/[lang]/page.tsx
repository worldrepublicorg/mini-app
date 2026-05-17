import { redirect } from "next/navigation";

export default async function Home({
	params,
}: {
	params: Promise<{ lang: string }>;
}) {
	const { lang } = await params;
	redirect(`/${lang}/earn`);
}
