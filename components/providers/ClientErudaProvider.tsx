"use client";

import dynamic from "next/dynamic";

const Eruda = dynamic(() => import("./Eruda").then((c) => c.ErudaProvider), {
	ssr: false,
});

export function ClientErudaProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return <Eruda>{children}</Eruda>;
}
