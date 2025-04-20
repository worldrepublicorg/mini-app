"use client";

import React from "react";
import { Typography } from "@/components/ui/Typography";
import { FaPlus } from "react-icons/fa";

export const PartySkeletonCard = () => (
  <div className="mb-4 animate-pulse rounded-xl border border-gray-200 p-4">
    {/* Party name skeleton */}
    <div className="h-[19px] w-48 rounded bg-gray-100"></div>

    {/* Description skeleton - 3 lines */}
    <div className="mt-3 space-y-2">
      <div className="h-[15px] w-full rounded bg-gray-100"></div>
      <div className="h-[15px] w-11/12 rounded bg-gray-100"></div>
      <div className="h-[15px] w-4/5 rounded bg-gray-100"></div>
    </div>

    {/* Links and members count skeletons */}
    <div className="mt-2 flex justify-between gap-1">
      <div className="flex items-center gap-1">
        <div className="h-[15px] w-[15px] rounded-full bg-gray-100"></div>
        <div className="h-[15px] w-24 rounded bg-gray-100"></div>
      </div>
      <div className="flex items-center gap-1">
        <div className="h-[15px] w-[15px] rounded-full bg-gray-100"></div>
        <div className="h-[15px] w-8 rounded bg-gray-100"></div>
        <div className="h-[15px] w-16 rounded bg-gray-100"></div>
      </div>
    </div>

    {/* Button skeleton */}
    <div className="mt-4 h-9 w-full rounded bg-gray-100"></div>
  </div>
);

export const LoadingSkeleton = () => (
  <div className="w-full">
    {/* My Party Section Skeleton with Create Button */}
    <div className="mb-6">
      <div className="mb-3 flex items-center justify-between">
        <Typography
          as="h2"
          variant={{ variant: "subtitle", level: 1 }}
          className="text-[19px] font-semibold"
        >
          My party
        </Typography>
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-900"
          title="Create New Party"
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
      Discover
    </Typography>

    {/* Tabs Skeleton */}
    <div className="mb-2 flex items-center gap-1">
      <div className="flex gap-1">
        <button className="h-9 items-center rounded-full bg-gray-100 px-4 font-sans text-sm font-medium leading-narrow tracking-normal text-gray-900 transition-all duration-200">
          Top
        </button>
        <button className="h-9 items-center rounded-full px-4 font-sans text-sm font-medium leading-narrow tracking-normal text-gray-900 transition-all duration-200">
          Trending
        </button>
        <button className="h-9 items-center rounded-full px-4 font-sans text-sm font-medium leading-narrow tracking-normal text-gray-900 transition-all duration-200">
          New
        </button>
        <button className="h-9 items-center rounded-full px-4 font-sans text-sm font-medium leading-narrow tracking-normal text-gray-900 transition-all duration-200">
          Pending
        </button>
      </div>
    </div>

    {/* Generate skeleton party cards */}
    {Array.from({ length: 3 }).map((_, index) => (
      <PartySkeletonCard key={index} />
    ))}
  </div>
);
