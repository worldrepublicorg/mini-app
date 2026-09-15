"use client";

import Link from "next/link";
import { use } from "react";
import { BiLinkExternal } from "react-icons/bi";
import { PiUsersThreeFill } from "react-icons/pi";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { useTranslations } from "@/hooks/useTranslations";

export default function GovernPage({
	params,
}: {
	params: Promise<{ lang: string }>;
}) {
	const { lang } = use(params);
	const dictionary = useTranslations(lang);

	if (!dictionary) {
		return null;
	}

	return (
		<div className="pb-safe flex min-h-dvh flex-col px-6">
			<div className="fixed left-0 right-0 top-0 z-10 bg-gray-0 py-6">
				<div className="px-6">
					<Typography
						as="h2"
						variant={{ variant: "heading", level: 2 }}
						className="h-9 items-center"
					>
						{dictionary?.pages?.govern?.title}
					</Typography>
				</div>
			</div>

			<div className="mt-[84px] flex flex-1 flex-col items-center justify-center pb-8">
				<div className="flex w-full flex-col items-center justify-center">
					<div className="mb-10 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
						<PiUsersThreeFill className="h-10 w-10 text-gray-400" />
					</div>
					<Typography
						as="h2"
						variant={{ variant: "heading", level: 1 }}
						className="mb-4 text-center"
					>
						{
							dictionary?.pages?.govern?.sections?.elections?.testElections
								?.title
						}
					</Typography>
					<Typography
						variant={{ variant: "subtitle", level: 1 }}
						className="mb-10 text-center text-gray-500"
					>
						{
							dictionary?.pages?.govern?.sections?.elections?.testElections
								?.description
						}
					</Typography>
					<Link
						href="https://www.worldrepublic.org"
						target="_blank"
						rel="noopener noreferrer"
						className="w-full"
					>
						<Button
							variant="secondary"
							className="inline-flex items-center gap-1.5"
							fullWidth
						>
							{
								dictionary?.pages?.govern?.sections?.elections?.testElections
									?.button
							}
							<BiLinkExternal className="inline-block size-4 translate-y-[-4px] ml-1.5 shrink-0 text-gray-400" />
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
