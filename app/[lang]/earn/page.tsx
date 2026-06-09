"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";
import { BiLinkExternal } from "react-icons/bi";
import { FaFlask } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { PiInfoFill, PiWalletFill } from "react-icons/pi";
import { parseAbi } from "viem";
import { useWallet } from "@/components/contexts/WalletContext";
import { StakeWithPermitForm } from "@/components/StakeWithPermitForm";
import { TabSwiper } from "@/components/TabSwiper";
import { Typography } from "@/components/ui/Typography";
import { useTranslations } from "@/hooks/useTranslations";
import type { EarnTabKey } from "@/lib/types";
import { viemClient } from "@/lib/viemClient";

const VALID_TABS: EarnTabKey[] = ["Savings", "Contribute"];

export default function EarnPage({
	params,
}: {
	params: Promise<{ lang: string }>;
}) {
	const { lang } = use(params);
	const { walletAddress, tokenBalance } = useWallet();
	const dictionary = useTranslations(lang);
	const searchParams = useSearchParams();

	const [activeTab, setActiveTab] = useState<EarnTabKey>("Savings");
	const [stakedBalance, setStakedBalance] = useState<string>("0");
	const [availableReward, setAvailableReward] = useState<string>("0");
	const [displayAvailableReward, setDisplayAvailableReward] = useState<
		string | null
	>(null);

	const fromWei = useCallback((value: bigint) => {
		return (Number(value) / 1e18).toString();
	}, []);

	const fetchAvailableReward = useCallback(async () => {
		if (!walletAddress) return;

		try {
			const availableAbi = parseAbi([
				"function available(address account) external view returns (uint256)",
			]);
			const result: bigint = await viemClient.readContract({
				address: "0x234302Db10A54BDc11094A8Ef816B0Eaa5FCE3f7" as `0x${string}`,
				abi: availableAbi,
				functionName: "available",
				args: [walletAddress],
			});

			const resultAsString = fromWei(result);
			setAvailableReward(resultAsString);

			localStorage.setItem("savingsRewardBase", resultAsString);
			localStorage.setItem("savingsRewardStartTime", Date.now().toString());
		} catch (error) {
			console.error("Error fetching available reward", error);
		}
	}, [walletAddress, fromWei]);

	useEffect(() => {
		if (!stakedBalance || !availableReward) return;

		const interestRate = 1 / (86400 * 529);
		const stakedBalanceNum = Number(stakedBalance);
		const baseReward = Number(availableReward);

		let baseValue = baseReward;
		let startTime = Date.now();

		const storedBase = localStorage.getItem("savingsRewardBase");
		const storedStartTime = localStorage.getItem("savingsRewardStartTime");

		if (storedBase && storedStartTime) {
			baseValue = parseFloat(storedBase);
			startTime = parseInt(storedStartTime, 10);

			if (Math.abs(baseReward - baseValue) > 0.000001) {
				baseValue = baseReward;
				startTime = Date.now();
				localStorage.setItem("savingsRewardBase", baseValue.toString());
				localStorage.setItem("savingsRewardStartTime", startTime.toString());
			}
		}

		const updateDisplay = () => {
			const elapsedSeconds = (Date.now() - startTime) / 1000;
			const interestEarned = stakedBalanceNum * interestRate * elapsedSeconds;
			const totalReward = baseValue + interestEarned;

			let decimalPlaces = 11;
			if (stakedBalanceNum >= 1000000) {
				decimalPlaces = 3;
			} else if (stakedBalanceNum >= 100000) {
				decimalPlaces = 4;
			} else if (stakedBalanceNum >= 10000) {
				decimalPlaces = 5;
			} else if (stakedBalanceNum >= 1000) {
				decimalPlaces = 6;
			} else if (stakedBalanceNum >= 100) {
				decimalPlaces = 7;
			} else if (stakedBalanceNum >= 10) {
				decimalPlaces = 8;
			} else if (stakedBalanceNum >= 1) {
				decimalPlaces = 9;
			} else if (stakedBalanceNum >= 0.1) {
				decimalPlaces = 10;
			}

			setDisplayAvailableReward(totalReward.toFixed(decimalPlaces));
		};

		updateDisplay();
		const interval = setInterval(updateDisplay, 1000);

		return () => clearInterval(interval);
	}, [stakedBalance, availableReward]);

	const fetchStakedBalance = useCallback(async () => {
		if (!walletAddress) return;
		try {
			const balanceAbi = parseAbi([
				"function balanceOf(address account) external view returns (uint256)",
			]);
			const result: bigint = await viemClient.readContract({
				address: "0x234302Db10A54BDc11094A8Ef816B0Eaa5FCE3f7" as `0x${string}`,
				abi: balanceAbi,
				functionName: "balanceOf",
				args: [walletAddress],
			});
			const balance = fromWei(result);
			setStakedBalance(balance);
			localStorage.setItem("stakedBalance", balance);
		} catch (error) {
			console.error("Error fetching staked balance", error);
			setTimeout(fetchStakedBalance, 1000);
		}
	}, [walletAddress, fromWei]);

	useEffect(() => {
		if (!walletAddress) {
			setDisplayAvailableReward(null);
			return;
		}

		fetchAvailableReward();
		fetchStakedBalance();

		const fetchInterval = setInterval(() => {
			fetchAvailableReward();
			fetchStakedBalance();
		}, 5 * 60 * 1000);

		return () => clearInterval(fetchInterval);
	}, [walletAddress, fetchAvailableReward, fetchStakedBalance]);

	const handleTabChange = (tab: EarnTabKey) => {
		setActiveTab(tab);

		const params = new URLSearchParams(searchParams.toString());
		params.set("tab", tab);

		const newUrl = `/${lang}/earn?${params.toString()}`;
		window.history.pushState({ path: newUrl }, "", newUrl);
	};

	useEffect(() => {
		if (typeof window !== "undefined") {
			const urlParams = new URLSearchParams(window.location.search);
			const tabParam = urlParams.get("tab");
			if (tabParam && VALID_TABS.includes(tabParam as EarnTabKey)) {
				setActiveTab(tabParam as EarnTabKey);
			}
		}
	}, []);

	useEffect(() => {
		const handlePopState = () => {
			const urlParams = new URLSearchParams(window.location.search);
			const tabParam = urlParams.get("tab");
			if (tabParam && VALID_TABS.includes(tabParam as EarnTabKey)) {
				setActiveTab(tabParam as EarnTabKey);
			} else {
				setActiveTab("Savings");
			}
		};

		window.addEventListener("popstate", handlePopState);
		return () => window.removeEventListener("popstate", handlePopState);
	}, []);

	useEffect(() => {
		const handleInputFocus = (e: FocusEvent) => {
			if (
				e.target &&
				(e.target instanceof HTMLInputElement ||
					e.target instanceof HTMLTextAreaElement ||
					e.target instanceof HTMLSelectElement)
			) {
				setTimeout(() => {
					(e.target as HTMLElement).scrollIntoView({
						behavior: "smooth",
						block: "center",
					});
				}, 300);
			}
		};

		document.addEventListener("focusin", handleInputFocus);

		return () => {
			document.removeEventListener("focusin", handleInputFocus);
		};
	}, []);

	useEffect(() => {
		if (activeTab === "Contribute" && typeof window !== "undefined") {
			localStorage.setItem("hasSeenNewBuybackProgram", "true");
		}
	}, [activeTab]);

	const renderContent = () => {
		switch (activeTab) {
			case "Savings":
				return (
					<div className="flex w-full flex-col items-center py-8">
						<Typography
							as="h2"
							variant={{ variant: "heading", level: 1 }}
							className="text-center"
						>
							{dictionary?.pages?.earn?.tabs?.savings?.title}
						</Typography>
						<Typography
							variant={{ variant: "subtitle", level: 1 }}
							className="mx-auto mb-6 mt-4 text-center text-gray-500"
						>
							{dictionary?.pages?.earn?.tabs?.savings?.subtitle}
							<span className="group relative inline-flex items-center align-baseline">
								<PiInfoFill className="ml-1 h-4 w-4 translate-y-[2px] cursor-help text-gray-400" />
								<div className="absolute -right-4 bottom-full mb-2 hidden w-[calc(100dvw/2+24px)] max-w-sm transform rounded-lg border border-gray-200 bg-gray-0 p-3 text-xs shadow-lg group-hover:block">
									<p className="text-left text-gray-700">
										{dictionary?.pages?.earn?.tabs?.savings?.tooltip}
									</p>
								</div>
							</span>
						</Typography>
						<StakeWithPermitForm
							lang={lang}
							stakedBalance={stakedBalance}
							displayAvailableReward={displayAvailableReward}
							fetchStakedBalance={fetchStakedBalance}
							fetchAvailableReward={fetchAvailableReward}
						/>
					</div>
				);
			case "Contribute":
				return (
					<div className="flex w-full flex-col items-center py-8">
						<Typography
							as="h2"
							variant={{ variant: "heading", level: 1 }}
							className="text-center"
						>
							{dictionary?.pages?.earn?.tabs?.contribute?.title}
						</Typography>
						<Typography
							variant={{ variant: "subtitle", level: 1 }}
							className="mx-auto mb-8 mt-4 text-center text-gray-500"
						>
							{dictionary?.pages?.earn?.tabs?.contribute?.subtitle}
						</Typography>

						<Link
							href={`/${lang}/earn/contribute/buyback-program`}
							className="group mb-4 flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-gray-200 p-4"
						>
							<div className="flex items-center gap-3">
								<div>
									<div className="mb-1.5 flex items-center">
										<Typography
											as="h3"
											variant={{ variant: "subtitle", level: 2 }}
											className="line-clamp-1"
										>
											{
												dictionary?.pages?.earn?.tabs?.contribute
													?.buybackProgram?.title
											}
										</Typography>
									</div>
									<Typography
										as="p"
										variant={{ variant: "body", level: 3 }}
										className="text-gray-500"
									>
										{
											dictionary?.pages?.earn?.tabs?.contribute?.buybackProgram
												?.subtitle
										}
									</Typography>
								</div>
							</div>
							<div className="flex items-center justify-center rounded-full bg-gray-100 p-1.5">
								<IoIosArrowForward className="size-[14px] text-gray-400" />
							</div>
						</Link>

						<a
							href="https://www.worldrepublic.org/parties?tab=subsidies"
							target="_blank"
							rel="noopener noreferrer"
							className="group mb-4 flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-gray-200 p-4"
						>
							<div className="flex items-center gap-3">
								<div>
									<div className="mb-1.5 flex items-center">
										<Typography
											as="h3"
											variant={{ variant: "subtitle", level: 2 }}
											className="line-clamp-1"
										>
											{
												dictionary?.pages?.earn?.tabs?.contribute?.partySubsidy
													?.title
											}
										</Typography>
										<FaFlask
											className="ml-1 h-[15px] w-[15px] text-gray-400"
											title="Experimental"
										/>
									</div>
									<Typography
										as="p"
										variant={{ variant: "body", level: 3 }}
										className="text-gray-500"
									>
										{
											dictionary?.pages?.earn?.tabs?.contribute?.partySubsidy
												?.subtitle
										}
									</Typography>
								</div>
							</div>
							<div className="flex items-center justify-center rounded-full bg-gray-100 p-1.5">
								<BiLinkExternal className="size-[14px] text-gray-400" />
							</div>
						</a>
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<div className="pb-safe flex min-h-dvh flex-col px-6">
			<div className="fixed left-0 right-0 top-0 z-10 bg-gray-0 px-6 pt-5">
				<div className="flex items-center justify-between">
					<div className="flex h-10 items-center">
						<Typography as="h2" variant={{ variant: "heading", level: 2 }}>
							{dictionary?.pages?.earn?.title}
						</Typography>
					</div>
					{walletAddress && (
						<a
							href="https://world.org/mini-app?app_id=app_0d4b759921490adc1f2bd569fda9b53a&path=/ref/a7DgwV"
							className="flex h-10 items-center gap-2 rounded-full bg-gray-100 px-4"
						>
							<PiWalletFill className="h-5 w-5" />
							<Typography
								variant={{ variant: "number", level: 6 }}
								className="font-['Rubik'] text-base"
							>
								{tokenBalance
									? `${Number(tokenBalance).toFixed(2)} WDD`
									: "0.00 WDD"}
							</Typography>
						</a>
					)}
				</div>

				<TabSwiper<EarnTabKey>
					tabs={[
						{
							key: "Savings",
							label: dictionary?.pages?.earn?.tabs?.savings?.tabTitle,
						},
						{
							key: "Contribute",
							label: dictionary?.pages?.earn?.tabs?.contribute?.title,
						},
					]}
					activeTab={activeTab}
					onTabChange={handleTabChange}
				/>
			</div>

			<div className="mt-[112px] flex flex-1 items-center">
				{renderContent()}
			</div>
		</div>
	);
}
