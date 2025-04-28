"use client";

import Link from "next/link";
import { BiChevronLeft } from "react-icons/bi";
import { Typography } from "@/components/ui/Typography";
import { PollCard } from "@/components/PollCard";
import { useTranslations } from "@/hooks/useTranslations";

const pollKeys = [
  "heatAdaptation",
  "criticalMineralsExport",
  "wildlifeTrafficking",
  "sovereignDebtRestructuring",
  "globalMilitaryExerciseProtocol",
  "globalMaritimeSecurity",
  "globalNuclearDialogue",
  "globalMiningStandards",
  "globalDigitalServicesTax",
  "globalIMFQuotaReform",
  "globalEnergyTransition",
  "globalVaccineEquity",
  "globalTradeArbitration",
  "globalClimateFinance",
  "globalFoodWaste",
  "fairTechCompetition",
  "geoengineeringRegulation",
  "globalEduEquity",
  "oilTariffImpact",
  "agiExistentialRisk",
  "supplyChainResilience",
  "biodiversityFinance",
  "digitalInclusion",
  "oceanHealth",
  "eWasteRegulation",
  "foodSecurity",
  "quakeCodes",
  "techTransparency",
  "disasterRelief",
  "aiWatermarking",
  "spaceMilitarization",
  "biotech",
  "dataSovereignty",
  "fourDayWeek",
  "nuclearSecurity",
  "aviationResilience",
  "waterResources",
  "maternalHealth",
  "marsMission",
  "globalRecession",
  "aidCorridors",
  "nationalSovereignty",
  "climateDisasters",
  "aiSafety",
  "corporateTax",
  "spaceDebris",
  "digitalPrivacy",
  "nuclearProliferation",
  "cybersecurity",
  "globalAlliances",
  "climateResilience",
  "tradeTariffs",
  "diseaseManagement",
  "aiRegulation",
  "spaceRegulation",
  "diplomaticDialogue",
  "migration",
  "rareEarths",
  "cryptocurrency",
  "disinformation",
  "diseaseOutbreaks",
  "militaryIntervention",
  "aiDevelopment",
  "asteroidDefense",
  "peaceNegotiations",
  "taiwanPolicy",
];

const pollUrls = {
  heatAdaptation: "https://vote.one/lYGmfQI7",
  criticalMineralsExport: "https://vote.one/GTN2bfzr",
  wildlifeTrafficking: "https://vote.one/eWitQrSp",
  sovereignDebtRestructuring: "https://vote.one/8veO6EHF",
  globalMilitaryExerciseProtocol: "https://vote.one/IDqHp7v7",
  globalMaritimeSecurity: "https://vote.one/D9m1kqNi",
  globalNuclearDialogue: "https://vote.one/VwgWUVBl",
  globalMiningStandards: "https://vote.one/ntxWgSCA",
  globalDigitalServicesTax: "https://vote.one/qcY0cooZ",
  globalIMFQuotaReform: "https://vote.one/ZI2ILiHT",
  globalEnergyTransition: "https://vote.one/BTrzBwRq",
  globalVaccineEquity: "https://vote.one/QKYOUdPT",
  globalTradeArbitration: "https://vote.one/hRXbudC6",
  globalClimateFinance: "https://vote.one/JtJPmBRZ",
  globalFoodWaste: "https://vote.one/kD3dywCV",
  fairTechCompetition: "https://vote.one/W7goTrLH",
  geoengineeringRegulation: "https://vote.one/kgjdFdFB",
  globalEduEquity: "https://vote.one/ygOQkFbG",
  oilTariffImpact: "https://vote.one/ba09FAZu",
  agiExistentialRisk: "https://vote.one/Nz1CbUYe",
  supplyChainResilience: "https://vote.one/zDEnnNbe",
  biodiversityFinance: "https://vote.one/dceSJPNm",
  digitalInclusion: "https://vote.one/YXOAzpOO",
  oceanHealth: "https://vote.one/pCmbA7kH",
  eWasteRegulation: "https://vote.one/Iud64Gpc",
  foodSecurity: "https://vote.one/GRi1NYOX",
  quakeCodes: "https://vote.one/soAE4aHn",
  techTransparency: "https://vote.one/aOXsaVpq",
  disasterRelief: "https://vote.one/kKlY77pD",
  aiWatermarking: "https://vote.one/Jbra7uUp",
  spaceMilitarization: "https://vote.one/vBztzW2P",
  biotech: "https://vote.one/pNqgoSmf",
  dataSovereignty: "https://vote.one/r4VmX0XN",
  fourDayWeek: "https://vote.one/ht6lGdcr",
  nuclearSecurity: "https://vote.one/aW6o5p2u",
  aviationResilience: "https://vote.one/32Nn7JaS",
  waterResources: "https://vote.one/onq2P57s",
  maternalHealth: "https://vote.one/eTKCLYEa",
  marsMission: "https://vote.one/KP9pMsfy",
  globalRecession: "https://vote.one/VvJjBSkY",
  aidCorridors: "https://vote.one/l3Yu6hMi",
  nationalSovereignty: "https://vote.one/67a0Lnei",
  climateDisasters: "https://vote.one/MTHSApYb",
  aiSafety: "https://vote.one/HUuPPFOS",
  corporateTax: "https://vote.one/3FhzXHRG",
  spaceDebris: "https://vote.one/4pPCTP6p",
  digitalPrivacy: "https://vote.one/adRv9hK6",
  nuclearProliferation: "https://vote.one/TKV1ow4O",
  cybersecurity: "https://vote.one/trFBHaNi",
  globalAlliances: "https://vote.one/yhYoEjF3",
  climateResilience: "https://vote.one/cg9zZaKR",
  tradeTariffs: "https://vote.one/HitgAQBM",
  diseaseManagement: "https://vote.one/tbCLGUgE",
  aiRegulation: "https://vote.one/4PjcWqwV",
  spaceRegulation: "https://vote.one/Eh0iIrW5",
  diplomaticDialogue: "https://vote.one/179i7c78",
  migration: "https://vote.one/SJSETLZp",
  rareEarths: "https://vote.one/5StpP7UU",
  cryptocurrency: "https://vote.one/0bTVLGAB",
  disinformation: "https://vote.one/rw4L36NM",
  diseaseOutbreaks: "https://vote.one/OZ2T4A53",
  militaryIntervention: "https://vote.one/GrS25I8Y",
  aiDevelopment: "https://vote.one/6xsTYiEV",
  asteroidDefense: "https://vote.one/IS9azLpr",
  peaceNegotiations: "https://vote.one/1mK1Ko1v",
  taiwanPolicy: "https://vote.one/ZbuHndkQ",
};

export default function PreviousPollsPage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const dictionary = useTranslations(lang);

  return (
    <div className="flex min-h-screen flex-col px-6 pb-20">
      <div className="fixed left-0 right-0 top-0 z-10 bg-gray-0 px-6">
        <div className="relative flex items-center justify-center py-6">
          <Link
            href={`/${lang}/govern`}
            className="absolute left-0 flex size-10 items-center justify-center rounded-full bg-gray-100"
          >
            <BiChevronLeft className="size-6 text-gray-500" />
          </Link>
          <Typography as="h2" variant={{ variant: "heading", level: 3 }}>
            {dictionary?.pages?.govern?.sections?.polls?.previous?.title}
          </Typography>
        </div>
      </div>

      <div className="mt-24">
        <div>
          {pollKeys.map((key) => (
            <PollCard
              key={key}
              lang={lang}
              description={
                dictionary?.pages?.govern?.sections?.polls?.previous?.polls?.[
                  key
                ]
              }
              voteUrl={pollUrls[key as keyof typeof pollUrls]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
