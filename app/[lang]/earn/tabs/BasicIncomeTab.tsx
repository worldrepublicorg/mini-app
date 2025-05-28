import React from "react";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/Drawer";
import {
  PiHandCoinsFill,
  PiCoinsFill,
  PiTrendUpFill,
  PiUserCheckFill,
  PiInfoFill,
} from "react-icons/pi";
import Link from "next/link";
import { WalletAuth } from "@/components/WalletAuth";

export interface BasicIncomeTabProps {
  lang: string;
  dictionary: any;
  walletAddress: string | null;
  basicIncomeActivated: boolean;
  basicIncomePlusActivated: boolean;
  isClaimableLoading: boolean;
  displayClaimable: number;
  isSubmitting: boolean;
  isClaimingBasic: boolean;
  isClaimingPlus: boolean;
  sendSetup: () => void;
  sendSetupPlus: () => void;
  sendClaim: () => void;
  sendClaimPlus: () => void;
}

export const BasicIncomeTab: React.FC<BasicIncomeTabProps> = ({
  lang,
  dictionary,
  walletAddress,
  basicIncomeActivated,
  basicIncomePlusActivated,
  isClaimableLoading,
  displayClaimable,
  isSubmitting,
  isClaimingBasic,
  isClaimingPlus,
  sendSetup,
  sendSetupPlus,
  sendClaim,
  sendClaimPlus,
}) => {
  return (
    <div className="flex w-full flex-col items-center py-8">
      <div className="mb-10 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
        <PiHandCoinsFill className="h-10 w-10 text-gray-400" />
      </div>
      <Typography as="h2" variant="heading" level={1} className="text-center">
        {dictionary?.pages?.earn?.tabs?.basicIncome?.title}
      </Typography>

      {walletAddress === null ? (
        <>
          <Typography
            variant="subtitle"
            level={1}
            className="mx-auto mb-10 mt-4 text-center text-gray-500"
          >
            {dictionary?.pages?.earn?.tabs?.basicIncome?.subtitle}
          </Typography>
          <WalletAuth lang={lang} onError={(error) => console.error(error)} />
        </>
      ) : !basicIncomeActivated ? (
        <>
          <Typography
            variant="subtitle"
            level={1}
            className="mx-auto mb-10 mt-4 text-center text-gray-500"
          >
            {dictionary?.pages?.earn?.tabs?.basicIncome?.setupSubtitle}
          </Typography>
          <Button onClick={sendSetup} isLoading={isSubmitting} fullWidth>
            {dictionary?.pages?.earn?.tabs?.basicIncome?.activateButton}
          </Button>
        </>
      ) : (
        <>
          <Typography
            variant="subtitle"
            level={1}
            className="mx-auto mb-10 mt-4 text-center text-gray-500"
          >
            {dictionary?.pages?.earn?.tabs?.basicIncome?.claimableSubtitle}
            <span className="group relative inline-flex items-center align-baseline">
              <PiInfoFill className="ml-1 h-4 w-4 translate-y-[2px] cursor-help text-gray-400" />
              <div className="absolute -right-4 bottom-full mb-2 hidden w-[calc(100dvw/2+24px)] max-w-sm transform rounded-lg border border-gray-200 bg-gray-0 p-3 text-xs shadow-lg group-hover:block">
                <p className="text-left text-gray-700">
                  {
                    dictionary?.pages?.earn?.tabs?.basicIncome
                      ?.claimableTooltip1
                  }{" "}
                  <Link
                    href={`/${lang}/earn/contribute/buyback-program`}
                    className="text-gray-900 underline"
                  >
                    {
                      dictionary?.pages?.earn?.tabs?.basicIncome
                        ?.claimableTooltip2
                    }
                  </Link>
                  {
                    dictionary?.pages?.earn?.tabs?.basicIncome
                      ?.claimableTooltip3
                  }{" "}
                  <Link
                    href={`/${lang}/faq`}
                    className="text-gray-900 underline"
                  >
                    {
                      dictionary?.pages?.earn?.tabs?.basicIncome
                        ?.claimableTooltip4
                    }
                  </Link>{" "}
                  {
                    dictionary?.pages?.earn?.tabs?.basicIncome
                      ?.claimableTooltip5
                  }
                </p>
              </div>
            </span>
          </Typography>
          <div className="text-center">
            {isClaimableLoading ? (
              <div className="mx-auto mb-[57px] mt-[6px] h-[56px] w-64 animate-pulse rounded-xl bg-gray-100"></div>
            ) : (
              <p className="mx-auto mb-[52px] font-['Rubik'] text-[56px] font-semibold leading-narrow tracking-normal">
                {basicIncomePlusActivated
                  ? displayClaimable.toFixed(5)
                  : displayClaimable.toFixed(6)}
              </p>
            )}
          </div>
          {basicIncomePlusActivated ? (
            <div className="flex w-full flex-col gap-4">
              <Button
                onClick={sendClaimPlus}
                isLoading={isClaimingPlus}
                fullWidth
              >
                {
                  dictionary?.pages?.earn?.tabs?.basicIncome?.plus?.drawer
                    ?.claimButton
                }
              </Button>
              <Button
                onClick={sendClaim}
                isLoading={isClaimingBasic}
                variant="secondary"
                fullWidth
              >
                {
                  dictionary?.pages?.earn?.tabs?.basicIncome?.plus?.drawer
                    ?.claimBasicButton
                }
              </Button>
            </div>
          ) : (
            <>
              <Button onClick={sendClaim} isLoading={isClaimingBasic} fullWidth>
                {dictionary?.pages?.earn?.tabs?.basicIncome?.claimButton}
              </Button>
              {/* Plus activation drawer trigger and content */}
              {walletAddress && basicIncomeActivated && (
                <Drawer>
                  <DrawerTrigger asChild>
                    <div className="mt-4 flex w-full cursor-pointer rounded-xl border border-gray-200 bg-transparent py-2 pr-4">
                      <div className="flex w-full items-center overflow-hidden">
                        <div className="-ml-[2px] mr-[10px] h-[30px] w-[30px] flex-shrink-0 rounded-full border-[5px] border-gray-900"></div>
                        <Typography
                          as="h3"
                          variant={{ variant: "subtitle", level: 2 }}
                          className="font-display line-clamp-2 text-[15px] font-medium tracking-tight text-gray-900"
                        >
                          {
                            dictionary?.pages?.earn?.tabs?.basicIncome?.plus
                              ?.drawerTrigger
                          }
                        </Typography>
                        <div className="ml-1 rounded-full bg-gray-200 px-1.5 py-0.5">
                          <p className="font-sans text-[12px] font-medium leading-narrow tracking-normal text-gray-900">
                            {
                              dictionary?.pages?.earn?.tabs?.basicIncome?.plus
                                ?.newBadge
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </DrawerTrigger>
                  <DrawerContent>
                    <div className="flex flex-col items-center p-6 pt-10">
                      <div className="mb-10 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                        <PiCoinsFill className="h-10 w-10 text-gray-400" />
                      </div>
                      <Typography
                        as="h2"
                        variant={{ variant: "heading", level: 1 }}
                        className="text-center"
                      >
                        {
                          dictionary?.pages?.earn?.tabs?.basicIncome?.plus
                            ?.drawer?.title
                        }
                      </Typography>
                      <Typography
                        variant={{ variant: "subtitle", level: 1 }}
                        className="mx-auto mt-4 text-center text-gray-500"
                      >
                        {
                          dictionary?.pages?.earn?.tabs?.basicIncome?.plus
                            ?.drawer?.subtitle
                        }
                      </Typography>
                      <div className="mt-4 w-full px-3 py-4">
                        <ul className="space-y-3">
                          <li className="flex items-start">
                            <div className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                              <PiTrendUpFill className="h-3.5 w-3.5 text-gray-400" />
                            </div>
                            <Typography
                              variant={{ variant: "body", level: 3 }}
                              className="text-gray-600 mt-[3px]"
                            >
                              {
                                dictionary?.pages?.earn?.tabs?.basicIncome?.plus
                                  ?.drawer?.features?.rate?.title
                              }
                            </Typography>
                          </li>
                          <li className="flex items-start">
                            <div className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                              <PiUserCheckFill className="h-3.5 w-3.5 text-gray-400" />
                            </div>
                            <Typography
                              variant={{ variant: "body", level: 3 }}
                              className="text-gray-600 mt-[3px]"
                            >
                              {
                                dictionary?.pages?.earn?.tabs?.basicIncome?.plus
                                  ?.drawer?.features?.verification?.title
                              }
                            </Typography>
                          </li>
                        </ul>
                      </div>
                      <Button
                        onClick={sendSetupPlus}
                        isLoading={isSubmitting}
                        fullWidth
                        className="mt-6"
                      >
                        {
                          dictionary?.pages?.earn?.tabs?.basicIncome?.plus
                            ?.drawer?.activateButton
                        }
                      </Button>
                    </div>
                  </DrawerContent>
                </Drawer>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};
