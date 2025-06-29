"use client";

import Link from "next/link";
import { BiChevronLeft } from "react-icons/bi";
import { Typography } from "@/components/ui/Typography";
import { PollCard } from "@/components/PollCard";
import { useTranslations } from "@/hooks/useTranslations";

const pollKeys = [
  "nuclearEscalationRisk",
  "middleEastEscalation",
  "cyberResilienceProtocol",
  "nuclearDisarmamentTalks",
  "pandemicPreparednessFund",
  "globalAidCuts",
  "coralCrisisAction",
  "aiSafetyTreaty",
  "polarIceProtocol",
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
  nuclearEscalationRisk:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/jRxpCulS",
  middleEastEscalation:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/RKrASNCV",
  cyberResilienceProtocol:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/2QOSYgip",
  nuclearDisarmamentTalks:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/gV4RQAsj",
  pandemicPreparednessFund:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/n0Zl8mul",
  globalAidCuts:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/t1zvwYDI",
  coralCrisisAction:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/jNqEO9XV",
  aiSafetyTreaty:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/b6be3PF1",
  polarIceProtocol:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/afA1jsIQ",
  heatAdaptation:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/lYGmfQI7",
  criticalMineralsExport:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/GTN2bfzr",
  wildlifeTrafficking:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/eWitQrSp",
  sovereignDebtRestructuring:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/8veO6EHF",
  globalMilitaryExerciseProtocol:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/IDqHp7v7",
  globalMaritimeSecurity:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/D9m1kqNi",
  globalNuclearDialogue:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/VwgWUVBl",
  globalMiningStandards:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/ntxWgSCA",
  globalDigitalServicesTax:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/qcY0cooZ",
  globalIMFQuotaReform:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/ZI2ILiHT",
  globalEnergyTransition:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/BTrzBwRq",
  globalVaccineEquity:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/QKYOUdPT",
  globalTradeArbitration:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/hRXbudC6",
  globalClimateFinance:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/JtJPmBRZ",
  globalFoodWaste:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/kD3dywCV",
  fairTechCompetition:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/W7goTrLH",
  geoengineeringRegulation:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/kgjdFdFB",
  globalEduEquity:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/ygOQkFbG",
  oilTariffImpact:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/ba09FAZu",
  agiExistentialRisk:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/Nz1CbUYe",
  supplyChainResilience:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/zDEnnNbe",
  biodiversityFinance:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/dceSJPNm",
  digitalInclusion:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/YXOAzpOO",
  oceanHealth:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/pCmbA7kH",
  eWasteRegulation:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/Iud64Gpc",
  foodSecurity:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/GRi1NYOX",
  quakeCodes:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/soAE4aHn",
  techTransparency:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/aOXsaVpq",
  disasterRelief:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/kKlY77pD",
  aiWatermarking:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/Jbra7uUp",
  spaceMilitarization:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/vBztzW2P",
  biotech:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/pNqgoSmf",
  dataSovereignty:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/r4VmX0XN",
  fourDayWeek:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/ht6lGdcr",
  nuclearSecurity:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/aW6o5p2u",
  aviationResilience:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/32Nn7JaS",
  waterResources:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/onq2P57s",
  maternalHealth:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/eTKCLYEa",
  marsMission:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/KP9pMsfy",
  globalRecession:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/VvJjBSkY",
  aidCorridors:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/l3Yu6hMi",
  nationalSovereignty:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/67a0Lnei",
  climateDisasters:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/MTHSApYb",
  aiSafety:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/HUuPPFOS",
  corporateTax:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/3FhzXHRG",
  spaceDebris:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/4pPCTP6p",
  digitalPrivacy:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/adRv9hK6",
  nuclearProliferation:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/TKV1ow4O",
  cybersecurity:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/trFBHaNi",
  globalAlliances:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/yhYoEjF3",
  climateResilience:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/cg9zZaKR",
  tradeTariffs:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/HitgAQBM",
  diseaseManagement:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/tbCLGUgE",
  aiRegulation:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/4PjcWqwV",
  spaceRegulation:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/Eh0iIrW5",
  diplomaticDialogue:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/179i7c78",
  migration:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/SJSETLZp",
  rareEarths:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/5StpP7UU",
  cryptocurrency:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/0bTVLGAB",
  disinformation:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/rw4L36NM",
  diseaseOutbreaks:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/OZ2T4A53",
  militaryIntervention:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/GrS25I8Y",
  aiDevelopment:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/6xsTYiEV",
  asteroidDefense:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/IS9azLpr",
  peaceNegotiations:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/1mK1Ko1v",
  taiwanPolicy:
    "https://world.org/mini-app?app_id=app_86794ef02e4fdd6579a937e4a0d858fb&app_mode=mini-app&path=/ZbuHndkQ",
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
          <Typography
            as="h2"
            variant={{ variant: "heading", level: 3 }}
            className="mx-12 text-center"
          >
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
