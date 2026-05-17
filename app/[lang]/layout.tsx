/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata } from "next";
import "../globals.css";
import BottomNav from "@/components/BottomNav";
import { WalletProvider } from "@/components/contexts/WalletContext";
import MiniKitProvider from "@/components/providers/minikit-provider";
import NextAuthProvider from "@/components/providers/next-auth-provider";
import "@worldcoin/mini-apps-ui-kit-react/styles.css";
import { ClientErudaProvider } from "@/components/providers/ClientErudaProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";

export const metadata: Metadata = {
	title: "World Republic",
	description: "Basic income and global democracy",
};

interface RootLayoutProps {
	children: React.ReactNode;
	params: Promise<{
		lang: string;
	}>;
}

export default async function RootLayout({
	children,
	params,
}: RootLayoutProps) {
	const { lang } = await params;

	return (
		<html lang={lang}>
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="anonymous"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=DM+Mono:ital@0;1&family=Rubik:ital,wght@0,300..900;1,300..900&family=Sora:wght@100..800&display=swap"
					rel="stylesheet"
				/>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, viewport-fit=cover"
				/>
			</head>
			<body>
				<ToastProvider>
					<NextAuthProvider>
						<ClientErudaProvider>
							<MiniKitProvider>
								<WalletProvider>
									{children}
									<BottomNav />
								</WalletProvider>
							</MiniKitProvider>
						</ClientErudaProvider>
					</NextAuthProvider>
				</ToastProvider>
			</body>
		</html>
	);
}

// Generate static params for supported locales
export async function generateStaticParams() {
	return [{ lang: "en" }, { lang: "es" }];
}
