import React from "react";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { PiInfoFill } from "react-icons/pi";

export interface SavingsTabProps {
  lang: string;
  dictionary: any;
  stakedBalance: string;
  displayAvailableReward: string | null;
  amount: string;
  setAmount: (value: string) => void;
  selectedAction: "deposit" | "withdraw";
  setSelectedAction: (action: "deposit" | "withdraw") => void;
  isDepositing: boolean;
  isWithdrawing: boolean;
  isCollecting: boolean;
  handleStake: () => void;
  handleWithdraw: () => void;
  handleCollect: () => void;
  tokenBalance: string;
}

export const SavingsTab: React.FC<SavingsTabProps> = ({
  dictionary,
  stakedBalance,
  displayAvailableReward,
  amount,
  setAmount,
  selectedAction,
  setSelectedAction,
  isDepositing,
  isWithdrawing,
  isCollecting,
  handleStake,
  handleWithdraw,
  handleCollect,
  tokenBalance,
}) => {
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
      <div className="w-full">
        <div className="mb-2 flex gap-1">
          <button
            type="button"
            onClick={() => {
              setSelectedAction("deposit");
              setAmount("");
            }}
            className={`h-9 items-center rounded-full px-4 font-sans text-sm font-medium leading-narrow tracking-normal text-gray-900 transition-all duration-200 ${
              selectedAction === "deposit" ? "bg-gray-100" : ""
            }`}
          >
            {dictionary?.components?.stakeForm?.deposit}
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedAction("withdraw");
              setAmount("");
            }}
            className={`h-9 items-center rounded-full px-4 font-sans text-sm font-medium leading-narrow tracking-normal text-gray-900 transition-all duration-200 ${
              selectedAction === "withdraw" ? "bg-gray-100" : ""
            }`}
          >
            {dictionary?.components?.stakeForm?.withdraw}
          </button>
        </div>
        <div className="mb-4 rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <Typography
              as="p"
              variant={{ variant: "body", level: 2 }}
              className="mb-4 text-[17px] font-medium text-gray-900"
            >
              {dictionary?.components?.stakeForm?.balance}
            </Typography>
            <Typography
              variant={{ variant: "number", level: 6 }}
              className="mb-4 font-['Rubik'] text-base"
            >
              {Number(stakedBalance).toFixed(2)} WDD
            </Typography>
          </div>
          <div className="flex items-center justify-between">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={
                selectedAction === "deposit"
                  ? dictionary?.components?.stakeForm?.depositPlaceholder
                  : dictionary?.components?.stakeForm?.withdrawPlaceholder
              }
              className={`-ml-2 mr-2 h-9 w-full rounded-xl pl-2 ${
                amount ? "font-['Rubik'] text-[17px]" : "font-sans"
              }`}
            />
            <button
              type="button"
              onClick={() => {
                setAmount(
                  selectedAction === "deposit"
                    ? (Math.floor(Number(tokenBalance) * 1e9) / 1e9).toFixed(
                        9
                      ) || "0"
                    : (Math.floor(Number(stakedBalance) * 1e9) / 1e9).toFixed(
                        9
                      ) || "0"
                );
              }}
              className={`flex h-9 items-center justify-center whitespace-nowrap rounded-full bg-gray-100 px-4 font-sans text-sm font-medium leading-narrow tracking-normal ${
                amount ===
                  (selectedAction === "deposit"
                    ? (Math.floor(Number(tokenBalance) * 1e9) / 1e9).toFixed(
                        9
                      ) || "0"
                    : (Math.floor(Number(stakedBalance) * 1e9) / 1e9).toFixed(
                        9
                      ) || "0") ||
                (selectedAction === "deposit"
                  ? Number(tokenBalance) <= 0
                  : Number(stakedBalance) <= 0)
                  ? "text-gray-400"
                  : "text-gray-900"
              }`}
            >
              {dictionary?.components?.stakeForm?.max}
            </button>
          </div>
        </div>
        <div className="mb-6 mt-4 flex items-center justify-between gap-2 px-2">
          <Typography
            as="p"
            variant={{ variant: "body", level: 2 }}
            className="text-[17px] font-medium text-gray-900"
          >
            {dictionary?.components?.stakeForm?.interest}
          </Typography>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleCollect}
              isLoading={isCollecting}
              variant="primary"
              size="sm"
              className="mr-2 h-9 min-w-20 rounded-full px-4 font-sans"
            >
              {dictionary?.components?.stakeForm?.collect}
            </Button>
            <Typography
              variant={{ variant: "number", level: 6 }}
              className="font-['Rubik'] text-base"
              data-testid="reward-value"
            >
              {displayAvailableReward}
            </Typography>
          </div>
        </div>
        {selectedAction === "deposit" ? (
          <Button onClick={handleStake} isLoading={isDepositing} fullWidth>
            {dictionary?.components?.stakeForm?.depositButton}
          </Button>
        ) : (
          <Button onClick={handleWithdraw} isLoading={isWithdrawing} fullWidth>
            {dictionary?.components?.stakeForm?.withdrawButton}
          </Button>
        )}
      </div>
    </div>
  );
};
