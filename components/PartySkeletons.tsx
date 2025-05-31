"use client";

import React from "react";
import { Typography } from "@/components/ui/Typography";
import { FaPlus } from "react-icons/fa";
import { PiInfoFill } from "react-icons/pi";
import { useParties } from "./contexts/PartiesContext";
import { Input } from "@worldcoin/mini-apps-ui-kit-react";
import type { PartySkeletonCardProps } from "@/lib/types";

export function PartySkeletonCard({
  showPendingNote = false,
  dictionary,
}: PartySkeletonCardProps) {
  const { userPartyData, userPartyId } = useParties();

  // If we have an optimistic party in state or we're transitioning from optimistic to real ID,
  // don't show the skeleton
  if (userPartyData && (userPartyId === -1 || userPartyData.id === -1)) {
    return null;
  }

  // Only show pending note when the user is a leader and has a pending party
  const shouldShowPendingNote =
    showPendingNote &&
    userPartyData &&
    userPartyData.isUserLeader &&
    userPartyData.status === 0;

  return (
    <>
      {shouldShowPendingNote && (
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

      {/* The skeleton card UI */}
      <div className="mb-4 rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="h-5 w-40 animate-pulse rounded bg-gray-200"></div>
        </div>
        <div className="mt-3 h-4 w-full animate-pulse rounded bg-gray-200"></div>
        <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
        <div className="mt-4 flex justify-between">
          <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
          <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
        </div>
        <div className="mt-4 h-10 w-full animate-pulse rounded bg-gray-200"></div>
      </div>
    </>
  );
}

export const LoadingSkeleton = ({ dictionary }: { dictionary: any }) => (
  <div className="w-full">
    {/* My Party Section Skeleton with Create Button */}
    <div className="mb-6">
      <div className="mb-3 flex items-center justify-between">
        <Typography
          as="h2"
          variant={{ variant: "subtitle", level: 1 }}
          className="text-[19px] font-semibold"
        >
          {dictionary?.components?.politicalPartyList?.myParty}
        </Typography>
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-900"
          title={dictionary?.components?.politicalPartyList?.createParty}
        >
          <FaPlus className="text-gray-500" size={12} />
        </button>
      </div>
      <PartySkeletonCard />
    </div>

    {/* Discover Section Title */}
    <Typography
      as="h2"
      variant={{ variant: "subtitle", level: 1 }}
      className="mb-3 text-[19px] font-semibold"
    >
      {dictionary?.components?.politicalPartyList?.discover}
    </Typography>

    {/* Search Input Skeleton */}
    <div className="mb-3">
      <div className="relative h-[3.125rem]">
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
          label="Search parties..."
        />
      </div>
    </div>

    {/* Tabs Skeleton */}
    <div className="flex items-center gap-1 py-2">
      <div className="flex gap-1">
        <button className="h-9 items-center rounded-full bg-gray-100 px-4 font-sans text-sm font-medium leading-narrow tracking-normal text-gray-900 transition-all duration-200">
          {dictionary?.components?.politicalPartyList?.tabs?.new}
        </button>
        <button className="h-9 items-center rounded-full px-4 font-sans text-sm font-medium leading-narrow tracking-normal text-gray-900 transition-all duration-200">
          {dictionary?.components?.politicalPartyList?.tabs?.trending}
        </button>
        <button className="h-9 items-center rounded-full px-4 font-sans text-sm font-medium leading-narrow tracking-normal text-gray-900 transition-all duration-200">
          {dictionary?.components?.politicalPartyList?.tabs?.top}
        </button>
        <button className="h-9 items-center rounded-full px-4 font-sans text-sm font-medium leading-narrow tracking-normal text-gray-900 transition-all duration-200">
          {dictionary?.components?.politicalPartyList?.tabs?.pending}
        </button>
      </div>
    </div>

    {/* Generate skeleton party cards */}
    {Array.from({ length: 20 }).map((_, index) => (
      <PartySkeletonCard key={index} />
    ))}
  </div>
);
