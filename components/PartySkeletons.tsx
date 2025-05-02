"use client";

import React from "react";
import { Typography } from "@/components/ui/Typography";
import { FaPlus } from "react-icons/fa";
import { PiInfoFill } from "react-icons/pi";
import { useParties } from "./contexts/PartiesContext";

interface PartySkeletonCardProps {
  showPendingNote?: boolean;
  dictionary?: any;
}

export function PartySkeletonCard({
  showPendingNote = false,
  dictionary,
}: PartySkeletonCardProps) {
  const { userPartyData } = useParties();

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
      <div className="rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="h-5 w-40 animate-pulse rounded bg-gray-200"></div>
          <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200"></div>
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
      <div className="relative">
        <div className="h-[54px] animate-pulse rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"></div>
      </div>
    </div>

    {/* Tabs Skeleton */}
    <div className="mb-2 flex items-center gap-1">
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
