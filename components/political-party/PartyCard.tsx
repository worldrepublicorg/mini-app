import Link from "next/link";
import {
  PiLinkSimpleBold,
  PiUsersBold,
  PiGearBold,
  PiInfoFill,
} from "react-icons/pi";
import type { Party } from "@/lib/types";
import { useTranslations } from "@/hooks/useTranslations";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";

type PartyCardProps = {
  party: Party;
  lang: string;
  userPartyId?: number;
  isMyParty?: boolean; // To distinguish the "My Party" card
  onJoin: (partyId: number) => void;
  onLeave: (partyId: number) => void;
  onManage: (party: Party) => void;
  onDelete: (party: Party) => void;
  isProcessing: boolean;
};

// Helper functions moved from PoliticalPartyList
const shortenUrl = (url: string, maxLength = 64) => {
  if (!url) return "";
  try {
    let cleanUrl = url
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .replace(/\/$/, "");
    if (cleanUrl.length <= maxLength) return cleanUrl;
    return cleanUrl.substring(0, maxLength - 3) + "...";
  } catch (e) {
    return url;
  }
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) return (Math.round(num / 10000) / 100).toFixed(1) + "M";
  if (num >= 1000) return (Math.round(num / 10) / 100).toFixed(1) + "K";
  return num.toString();
};

export function PartyCard({
  party,
  lang,
  userPartyId,
  isMyParty = false,
  onJoin,
  onLeave,
  onManage,
  onDelete,
  isProcessing,
}: PartyCardProps) {
  const dictionary = useTranslations(lang);

  const t = dictionary?.components?.politicalPartyList?.partyCard;

  return (
    <>
      {isMyParty && party.status === 0 && (
        <div className="mb-4 rounded-xl border border-gray-200 bg-gray-50 p-4 text-gray-700">
          <div className="flex items-start gap-2">
            <PiInfoFill className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500" />
            <Typography
              variant={{ variant: "body", level: 3 }}
              className="text-gray-600"
            >
              {dictionary?.components?.politicalPartyList?.approvalNote}
            </Typography>
          </div>
        </div>
      )}

      <div
        key={party.id}
        className="mb-4 rounded-xl border border-gray-200 p-4"
      >
        <div className="flex items-center justify-between">
          <Link href={`/${lang}/govern/party/${party.id}`} className="flex-1">
            <Typography
              as="h3"
              variant={{ variant: "subtitle", level: 1 }}
              className="text-[19px] font-semibold"
            >
              {party.name}
            </Typography>
          </Link>
          <div className="flex items-center gap-2">
            {party.status === 0 && (
              <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                {t?.pending}
              </span>
            )}
            {party.status === 2 && (
              <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                {t?.deleted}
              </span>
            )}
            {party.isUserLeader && party.status !== 2 && (
              <Dropdown
                trigger={
                  <button
                    className="text-gray-600 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 transition-colors"
                    title={t?.management?.title}
                  >
                    <PiGearBold size={16} />
                  </button>
                }
                menuItems={[
                  {
                    label: t?.management?.manageMembers,
                    onClick: () => onManage(party),
                  },
                  // {
                  //   label: t?.management?.updateInfo,
                  //   onClick: () => onUpdate(party),
                  // },
                  // {
                  //   label: t?.management?.transferLeadership,
                  //   onClick: () => onTransfer(party),
                  // },
                  {
                    label: t?.management?.deleteParty,
                    onClick: () => onDelete(party),
                    className: "text-error-600",
                  },
                ]}
                align="right"
              />
            )}
          </div>
        </div>

        <Link href={`/${lang}/govern/party/${party.id}`}>
          <Typography
            as="p"
            variant={{ variant: "body", level: 2 }}
            className="mt-3 text-[15px] text-gray-700"
          >
            {party.description}
          </Typography>
        </Link>

        <div className="mt-2 flex justify-between gap-1">
          <div className="flex items-center gap-1">
            <PiLinkSimpleBold className="text-gray-500" size={15} />
            <a
              href={
                party.officialLink.startsWith("http")
                  ? party.officialLink
                  : `https://${party.officialLink}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="-m-1 flex rounded-md px-1 py-1 transition-colors"
              title={party.officialLink}
            >
              <Typography
                variant={{ variant: "caption", level: 1 }}
                className="max-w-[calc(100dvw/2-56px)] truncate text-[15px] text-[#0A66C2]"
              >
                {shortenUrl(party.officialLink)}
              </Typography>
            </a>
          </div>
          <div className="flex items-center gap-1">
            <PiUsersBold className="text-gray-500" size={15} />
            <Typography
              as="span"
              variant={{ variant: "caption", level: 1 }}
              className="text-[15px] font-semibold"
              title={party.memberCount.toString()}
            >
              {formatNumber(party.memberCount)}
            </Typography>
            <Typography
              as="span"
              variant={{ variant: "caption", level: 1 }}
              className="text-[15px] text-gray-500"
            >
              {t?.members}
            </Typography>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {party.id === userPartyId ? (
            <Button
              className="px-6"
              variant="secondary"
              size="sm"
              fullWidth
              onClick={() => onLeave(party.id)}
              disabled={isProcessing}
            >
              {t?.actions?.leaveParty}
            </Button>
          ) : (
            <Button
              className="px-6"
              variant={party.status === 1 ? "primary" : "secondary"}
              size="sm"
              fullWidth
              onClick={() => onJoin(party.id)}
              disabled={isProcessing}
            >
              {party.status === 0
                ? t?.actions?.joinPendingParty
                : t?.actions?.joinParty}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
