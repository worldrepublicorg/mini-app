"use client";

import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { elections } from "@/data/elections";
import { useMemo, useState, useEffect } from "react";
import type { FocusEvent as ReactFocusEvent } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { PiInfoFill } from "react-icons/pi";
import Link from "next/link";
import { BiChevronLeft, BiShareAlt } from "react-icons/bi";
import { useRouter } from "next/navigation";
import {
  Input,
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@worldcoin/mini-apps-ui-kit-react";
import { useWallet } from "@/components/contexts/WalletContext";
import { useToast } from "@/components/ui/Toast";
import { MiniKit } from "@worldcoin/minikit-js";
import { viemClient } from "@/lib/viemClient";
import { parseAbi } from "viem";

const ELECTIONS_CONTRACT_ADDRESS = "0xae1EBe19Fa1e9A2FaF48429e22516adcD05022cC";

const electionsAbi = parseAbi([
  "function vote(uint256 _partyId)",
  "function removeVote()",
  "function userVotes(uint256 electionId, address user) view returns (uint256)",
  "function currentElectionId() view returns (uint256)",
]);

export default function CurrentElectionPage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const dictionary = useTranslations(lang);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const { walletAddress } = useWallet();
  const { showToast } = useToast();
  const [votedForPartyId, setVotedForPartyId] = useState<number | null>(null);
  const [processingPartyId, setProcessingPartyId] = useState<number | null>(
    null
  );
  const [currentElectionId, setCurrentElectionId] = useState<bigint | null>(
    null
  );
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [isButtonReady, setIsButtonReady] = useState(true);
  const [confirmationDetails, setConfirmationDetails] = useState<{
    isOpen: boolean;
    party: { id: number; name: string } | null;
    action: "vote" | "change" | "remove" | null;
  }>({
    isOpen: false,
    party: null,
    action: null,
  });

  const currentElection = useMemo(
    () => elections.find((e) => e.status === "active"),
    []
  );

  const shuffledParties = useMemo(() => {
    if (!currentElection) {
      return [];
    }
    // Return a new shuffled array to ensure the order is randomized on each page load.
    return [...currentElection.eligibleParties].sort(() => Math.random() - 0.5);
  }, [currentElection]);

  const filteredParties = useMemo(() => {
    if (searchTerm.trim() === "") {
      return shuffledParties;
    }
    const searchLower = searchTerm.toLowerCase();
    return shuffledParties.filter((party) =>
      party.name.toLowerCase().includes(searchLower)
    );
  }, [shuffledParties, searchTerm]);

  useEffect(() => {
    const handleScroll = () => {
      const shouldShow = window.scrollY > 300;
      setShowScrollToTop(shouldShow);

      if (!shouldShow) {
        setIsButtonReady(true);
      } else if (shouldShow && !isButtonReady) {
        const readyTimer = setTimeout(() => {
          setIsButtonReady(true);
        }, 300);
        return () => clearTimeout(readyTimer);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isButtonReady]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const fetchVoterStatus = async () => {
      if (!walletAddress || !currentElection) return;

      try {
        const electionId = await viemClient.readContract({
          address: ELECTIONS_CONTRACT_ADDRESS as `0x${string}`,
          abi: electionsAbi,
          functionName: "currentElectionId",
        });
        setCurrentElectionId(electionId);

        if (electionId) {
          const userVote = await viemClient.readContract({
            address: ELECTIONS_CONTRACT_ADDRESS as `0x${string}`,
            abi: electionsAbi,
            functionName: "userVotes",
            args: [electionId, walletAddress as `0x${string}`],
          });
          const votedParty = Number(userVote);
          if (votedParty > 0) {
            setVotedForPartyId(votedParty);
          }
        }
      } catch (error) {
        console.error("Error fetching voter status:", error);
        showToast(
          dictionary?.pages?.govern?.sections?.elections?.currentElectionPage
            ?.toasts?.fetchStatusError,
          "error"
        );
      }
    };

    fetchVoterStatus();
  }, [walletAddress, currentElection, showToast, dictionary]);

  const getConfirmationText = () => {
    if (!confirmationDetails.action || !confirmationDetails.party) {
      return { title: "", description: "", confirmText: "" };
    }

    const partyName = confirmationDetails.party.name;
    const { confirmation } =
      dictionary?.pages?.govern?.sections?.elections?.currentElectionPage;

    switch (confirmationDetails.action) {
      case "vote":
        return {
          title: confirmation.vote?.title,
          description: confirmation.vote?.description.replace(
            "{{partyName}}",
            partyName
          ),
          confirmText: confirmation.vote?.confirmText,
        };
      case "change":
        const previousParty = currentElection?.eligibleParties.find(
          (p) => Number(p.id) === votedForPartyId
        );
        return {
          title: confirmation.change?.title,
          description: confirmation.change?.description
            .replace("{{previousPartyName}}", previousParty?.name ?? "")
            .replace("{{partyName}}", partyName),
          confirmText: confirmation.change?.confirmText,
        };
      case "remove":
        return {
          title: confirmation.remove?.title,
          description: confirmation.remove?.description.replace(
            "{{partyName}}",
            partyName
          ),
          confirmText: confirmation.remove?.confirmText,
        };
      default:
        return { title: "", description: "", confirmText: "" };
    }
  };

  const handleVoteClick = (party: { id: number; name: string }) => {
    if (processingPartyId) return;

    if (!MiniKit.isInstalled()) {
      showToast(
        dictionary?.pages?.govern?.sections?.elections?.currentElectionPage
          ?.toasts?.connectInWorldApp,
        "error"
      );
      return;
    }
    if (!walletAddress) {
      showToast(
        dictionary?.pages?.govern?.sections?.elections?.currentElectionPage
          ?.toasts?.connectWallet,
        "error"
      );
      return;
    }
    if (currentElectionId === null) {
      showToast(
        dictionary?.pages?.govern?.sections?.elections?.currentElectionPage
          ?.toasts?.noCurrentElection,
        "error"
      );
      return;
    }

    const partyId = party.id;
    let action: "vote" | "change" | "remove";

    if (votedForPartyId === partyId) {
      action = "remove";
    } else if (votedForPartyId !== null) {
      action = "change";
    } else {
      action = "vote";
    }

    setConfirmationDetails({
      isOpen: true,
      party: party,
      action: action,
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmationDetails.party || !confirmationDetails.action) return;

    const { id: partyId, name: partyName } = confirmationDetails.party;
    const isRemovingVote = confirmationDetails.action === "remove";

    // Close the dialog first
    setConfirmationDetails({ isOpen: false, party: null, action: null });
    setProcessingPartyId(partyId);

    const oldVotedPartyId = votedForPartyId;
    // Optimistic update
    setVotedForPartyId(isRemovingVote ? null : partyId);

    const { toasts } =
      dictionary?.pages?.govern?.sections?.elections?.currentElectionPage;

    try {
      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: ELECTIONS_CONTRACT_ADDRESS as `0x${string}`,
            abi: electionsAbi,
            functionName: isRemovingVote ? "removeVote" : "vote",
            args: isRemovingVote ? [] : [BigInt(partyId)],
          },
        ],
      });

      if (finalPayload.status === "error") {
        showToast(toasts.transactionFailed, "error");
        // Revert optimistic update
        setVotedForPartyId(oldVotedPartyId);
      } else {
        showToast(
          isRemovingVote
            ? toasts.voteRemovedSuccess
            : toasts.voteSuccess.replace("{{partyName}}", partyName),
          "success"
        );
      }
    } catch (error) {
      console.error("Error casting vote:", error);
      showToast(toasts.voteError, "error");
      // Revert optimistic update
      setVotedForPartyId(oldVotedPartyId);
    } finally {
      setProcessingPartyId(null);
    }
  };

  const handleInputFocus = (e: ReactFocusEvent) => {
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

  const confirmationContent = getConfirmationText();
  const electionDict =
    dictionary?.pages?.govern?.sections?.elections?.currentElectionPage;

  return (
    <div className="pb-safe flex min-h-dvh flex-col px-6">
      <AlertDialog
        open={confirmationDetails.isOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setConfirmationDetails({
              isOpen: false,
              party: null,
              action: null,
            });
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmationContent.title}</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            {confirmationContent.description}
          </AlertDialogDescription>
          <AlertDialogFooter>
            <Button
              variant="secondary"
              size="lg"
              onClick={() =>
                setConfirmationDetails({
                  isOpen: false,
                  party: null,
                  action: null,
                })
              }
              className="w-full"
              disabled={processingPartyId !== null}
            >
              {electionDict?.buttons?.cancel}
            </Button>
            <Button
              size="lg"
              onClick={handleConfirmAction}
              className="w-full"
              disabled={processingPartyId !== null}
            >
              {processingPartyId !== null
                ? electionDict?.buttons?.processing
                : confirmationContent.confirmText}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="fixed left-0 right-0 top-0 z-10 bg-gray-0 px-6">
        <div className="relative flex items-center justify-center py-6">
          <button
            onClick={() => router.back()}
            className="absolute left-0 flex size-10 items-center justify-center rounded-full bg-gray-100"
            aria-label="Back"
          >
            <BiChevronLeft className="size-6 text-gray-500" />
          </button>
          <Typography
            as="h2"
            variant={{ variant: "heading", level: 3 }}
            className="mx-12 truncate text-center"
          >
            {electionDict?.title}
          </Typography>
          {currentElection && (
            <button
              onClick={async () => {
                const shareUrl = `https://world.org/mini-app?app_id=app_66c83ab8c851fb1e54b1b1b62c6ce39d&path=%2Fgovern%2Felection`;
                const shareTitle =
                  electionDict?.testElectionTitle || "Current Election";
                const copiedMessage =
                  dictionary?.components?.politicalPartyList?.copied ||
                  "Link copied!";

                if (navigator.share) {
                  try {
                    await navigator.share({
                      title: shareTitle,
                      url: shareUrl,
                    });
                  } catch (error) {
                    if (error instanceof Error && error.name !== "AbortError") {
                      await navigator.clipboard.writeText(shareUrl);
                      showToast(copiedMessage, "success");
                    }
                  }
                } else {
                  await navigator.clipboard.writeText(shareUrl);
                  showToast(copiedMessage, "success");
                }
              }}
              className="absolute right-0 flex size-10 items-center justify-center rounded-full bg-gray-100"
              aria-label={
                dictionary?.components?.politicalPartyList?.shareParty ||
                "Share"
              }
            >
              <BiShareAlt className="size-5 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-24 flex flex-1 flex-col pb-8">
        {currentElection ? (
          <>
            <div className="mb-10 text-center">
              <Typography as="h1" variant={{ variant: "heading", level: 1 }}>
                {electionDict?.testElectionTitle}
              </Typography>
              <Typography
                variant={{ variant: "subtitle", level: 1 }}
                className="mt-2 text-gray-500"
              >
                {electionDict?.testElectionSubtitle}
              </Typography>
            </div>

            <div className="mb-3 flex items-center">
              <Typography
                as="h2"
                variant={{ variant: "subtitle", level: 1 }}
                className="text-[19px] font-semibold"
              >
                {electionDict?.politicalParties}
              </Typography>
            </div>

            <div className="relative mb-6 h-[3.125rem]">
              <Input
                type="text"
                startAdornment={
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                      clipRule="evenodd"
                    />
                  </svg>
                }
                label={electionDict?.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={handleInputFocus}
              />
            </div>

            <div className="space-y-4">
              {filteredParties.map((party) => (
                <div
                  key={party.id}
                  className="bg-white flex items-center justify-between rounded-xl border border-gray-200 p-4"
                >
                  <Link
                    href={`/${lang}/govern/party/${party.id}`}
                    className="flex-1 overflow-hidden"
                  >
                    <Typography
                      as="h3"
                      variant={{ variant: "subtitle", level: 1 }}
                      className="line-clamp-1"
                    >
                      {party.name}
                    </Typography>
                    <Typography
                      variant={{ variant: "body", level: 3 }}
                      className="mt-0.5 text-gray-500"
                    >
                      {electionDict?.leaderPrefix}
                      {party.leader}
                    </Typography>
                  </Link>
                  <Button
                    size="sm"
                    className="ml-2 shrink-0 px-4"
                    onClick={() =>
                      handleVoteClick({
                        id: Number(party.id),
                        name: party.name,
                      })
                    }
                    variant={
                      votedForPartyId === Number(party.id)
                        ? "secondary"
                        : "primary"
                    }
                    disabled={processingPartyId !== null}
                  >
                    {processingPartyId === Number(party.id)
                      ? electionDict?.buttons?.processing
                      : votedForPartyId === Number(party.id)
                        ? electionDict?.buttons?.voted
                        : electionDict?.buttons?.vote}
                  </Button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="mb-10 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
              <PiInfoFill className="h-10 w-10 text-gray-400" />
            </div>
            <Typography
              as="h2"
              variant={{ variant: "heading", level: 1 }}
              className="mb-4 text-center"
            >
              {electionDict?.noActiveElection}
            </Typography>
            <Typography
              variant={{ variant: "subtitle", level: 1 }}
              className="mb-10 text-center text-gray-500"
            >
              {electionDict?.noActiveElectionDescription}
            </Typography>
            <Link href={`/${lang}/govern`} className="w-full">
              <Button variant="secondary" fullWidth>
                {electionDict?.backToOverview}
              </Button>
            </Link>
          </div>
        )}
      </div>
      {/* Scroll to top button */}
      <div
        className="mb-safe fixed right-4 z-50 h-12 w-12"
        style={{ bottom: "16px" }}
      >
        <button
          onClick={scrollToTop}
          onTouchStart={() => {
            if (isButtonReady) {
              scrollToTop();
            }
          }}
          className={`flex h-full w-full items-center justify-center rounded-full bg-gray-100 shadow-lg transition-opacity duration-300 ${
            showScrollToTop && isButtonReady
              ? "opacity-100"
              : "pointer-events-none opacity-0"
          }`}
          aria-label={
            dictionary?.components?.politicalPartyList?.scrollToTop ||
            "Scroll to top"
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-500"
          >
            <path d="m18 15-6-6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
