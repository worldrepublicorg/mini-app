"use client";

import { use, useCallback, useEffect, useState } from "react";
import { PiInfoFill, PiWalletFill } from "react-icons/pi";
import { parseAbi } from "viem";
import { useWallet } from "@/components/contexts/WalletContext";
import { StakeWithPermitForm } from "@/components/StakeWithPermitForm";
import { Typography } from "@/components/ui/Typography";
import { useTranslations } from "@/hooks/useTranslations";
import { viemClient } from "@/lib/viemClient";

export default function EarnPage({
	params,
}: {
	params: Promise<{ lang: string }>;
}) {
	const { lang } = use(params);
	const { walletAddress, tokenBalance } = useWallet();
	const dictionary = useTranslations(lang);

	const [stakedBalance, setStakedBalance] = useState<string>("0");
	const [availableReward, setAvailableReward] = useState<string>("0");
	const [displayAvailableReward, setDisplayAvailableReward] = useState<
		string | null
	>(null);
	// Per-second reward rate read from the contract, not assumed. Starts at 0 so
	// the display never animates interest the contract is not actually paying:
	// the rate is an owner-settable parameter and has been set to 0.
	const [rewardRatePerSecond, setRewardRatePerSecond] = useState<number>(0);

	const fromWei = useCallback((value: bigint) => {
		return (Number(value) / 1e18).toString();
	}, []);

	const fetchRewardRate = useCallback(async () => {
		try {
			const rateAbi = parseAbi([
				"function rewardPerTokenPerPeriod() external view returns (uint256)",
				"function daysPerPeriod() external view returns (uint256)",
			]);
			const [perToken, days] = await Promise.all([
				viemClient.readContract({
					address:
						"0x234302Db10A54BDc11094A8Ef816B0Eaa5FCE3f7" as `0x${string}`,
					abi: rateAbi,
					functionName: "rewardPerTokenPerPeriod",
				}) as Promise<bigint>,
				viemClient.readContract({
					address:
						"0x234302Db10A54BDc11094A8Ef816B0Eaa5FCE3f7" as `0x${string}`,
					abi: rateAbi,
					functionName: "daysPerPeriod",
				}) as Promise<bigint>,
			]);
			setRewardRatePerSecond(
				days > 0n ? Number(perToken) / (86400 * Number(days)) : 0,
			);
		} catch (error) {
			console.error("Error fetching reward rate", error);
			setRewardRatePerSecond(0);
		}
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

		const interestRate = rewardRatePerSecond;
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
	}, [stakedBalance, availableReward, rewardRatePerSecond]);

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

		fetchRewardRate();
		fetchAvailableReward();
		fetchStakedBalance();

		const fetchInterval = setInterval(
			() => {
				fetchRewardRate();
				fetchAvailableReward();
				fetchStakedBalance();
			},
			5 * 60 * 1000,
		);

		return () => clearInterval(fetchInterval);
	}, [
		walletAddress,
		fetchRewardRate,
		fetchAvailableReward,
		fetchStakedBalance,
	]);

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

	return (
		<div className="pb-safe flex min-h-dvh flex-col px-6">
			<div className="fixed left-0 right-0 top-0 z-10 bg-gray-0 px-6 py-5">
				<div className="flex items-center justify-between">
					<div className="flex h-10 items-center">
						<Typography as="h2" variant={{ variant: "heading", level: 2 }}>
							{dictionary?.pages?.earn?.title}
						</Typography>
					</div>
					{walletAddress && (
						<div className="flex h-10 items-center gap-2 rounded-full bg-gray-100 px-4">
							<PiWalletFill className="h-5 w-5" />
							<Typography
								variant={{ variant: "number", level: 6 }}
								className="font-['Rubik'] text-base"
							>
								{tokenBalance
									? `${Number(tokenBalance).toFixed(2)} WDD`
									: "0.00 WDD"}
							</Typography>
						</div>
					)}
				</div>
			</div>

			<div className="mt-[80px] flex flex-1 items-center">
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
						availableReward={availableReward}
						fetchStakedBalance={fetchStakedBalance}
						fetchAvailableReward={fetchAvailableReward}
					/>
				</div>
			</div>
		</div>
	);
}
