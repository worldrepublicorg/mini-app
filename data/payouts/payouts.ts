import { PartyPayout } from "./types";

// Helper function to calculate the total from weekly payouts
const calculateTotal = (weeklyPayouts: any[], key: string): string => {
  const total = weeklyPayouts.reduce((sum, week) => {
    const amount = week[key].amount;
    return sum + (amount ? parseFloat(amount) : 0);
  }, 0);

  return key === "wld" ? total.toFixed(2) : Math.round(total).toString();
};

export const latestPayouts: PartyPayout[] = [
  {
    id: 18,
    name: "Pengen kaya",
    leaderAddress: "0x9F8a429ED947a98B3EC1EC316196178512B6d044",
    leaderUsername: "arif07.7465",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "18978",
          transactionHash:
            "0x9432ad99ff442e4aec6425ccf12a4317afb23e6ed901f96460e2f0cb1669e3d1",
        },
        wld: {
          amount: "61.00",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "17512",
          transactionHash:
            "0xb498626d35b1e14dd7b68dce46480c1e752684642d0ddfe59431c1ce0f86a803",
        },
        wld: {
          amount: "49.79",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 5,
    name: "ONE UNITED GLOBE 🌍",
    leaderAddress: "0x8fA57020E5296aC3E806cFda024aeC7CBd93a1AE",
    leaderUsername: "gmusyoki95",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "4803",
          transactionHash:
            "0x923dabada0cbe0627e02ea247c2e3312e825faf54c15a0555b0c5299bc55caba",
        },
        wld: {
          amount: "15.44",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "4215",
          transactionHash:
            "0x4c59ab267a48ffd4be6c178ba153ee2c1dd119b5b829f547ae7a1187dae16513",
        },
        wld: {
          amount: "11.98",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 829,
    name: "World coin",
    leaderAddress: "0x8A4850de2694882736C3Ffa09A22B171575020B6",
    leaderUsername: "rijal_123.9991",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "2591",
          transactionHash:
            "0xf2d52fd38fba232070f3c227c61bcf3c34b5a3018db58fe645fe2bd700bf4043",
        },
        wld: {
          amount: "8.33",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "2275",
          transactionHash:
            "0x4b3476cbae48787cae8ee72f4f9be831e0d1ca9441c15f29c01716fff3d1e278",
        },
        wld: {
          amount: "6.47",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 1294,
    name: "26is",
    leaderAddress: "0x311f3a8Fe9d5e8927d5C24426de7ee83F2AFF279",
    leaderUsername: "mate_orc.9403",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "2418",
          transactionHash:
            "0x2764873cf46bed710f363b127eb3c2edaa81eabe082d35a5e3d827ec92946a8b",
        },
        wld: {
          amount: "7.77",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "2137",
          transactionHash:
            "0x6b91c05afc94b06c4ecc1a3e778b9867831dae12ee0ba031aa006fa9079a0149",
        },
        wld: {
          amount: "6.08",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 9,
    name: "WorldChain Indonesia",
    leaderAddress: "0x3981C3B713e4A7e4C4Cb58b72F2096bBD7979084",
    leaderUsername: "ariesh",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "2196",
          transactionHash:
            "0x6eeb523b5570f50700d278f42b95bb3bf47d6465acf3e2e778187445d4c20073",
        },
        wld: {
          amount: "7.06",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "2143",
          transactionHash:
            "0xc0122330b93f085f450320ab8dfd90dfca5409aec92d734cab16e690062da8da",
        },
        wld: {
          amount: "6.09",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 11,
    name: "Gobernanza Hispana",
    leaderAddress: "0x6Bb3c0c2b607623C206f6FF162cf0C513cb204ad",
    leaderUsername: "nico1",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "2174",
          transactionHash:
            "0x91c63c564a36fed7097c058575787abf0012d623e6d4195e5c4c704f38335a5f",
        },
        wld: {
          amount: "6.99",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "2080",
          transactionHash:
            "0x34bac40a9e1d61c15498b242703c210f1cb5f7b165b2eeb11eda9cce8218f1ba",
        },
        wld: {
          amount: "5.91",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 979,
    name: "Wld, Wdd, Cash, puf, Dna, orb, todos unidos para todo el mundo",
    leaderAddress: "0x54011B70227e8161E4A5E4303D5c19DC76432832",
    leaderUsername: "paolove",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "2059",
          transactionHash:
            "0x343291a4d077a946c25f9d5f07f1dc902da38acba16a21c26bf42dc5d9b6a1ad",
        },
        wld: {
          amount: "6.62",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "1905",
          transactionHash:
            "0xfaeb4ec6c26e40c36e923a75dc34bd565a099a3c64d0d950937539d035da9dce",
        },
        wld: {
          amount: "5.42",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 1090,
    name: "WORLD OWNER INDONESIA",
    leaderAddress: "0x4e63A0E60B55A90b09F298d7b608A2871e46F79a",
    leaderUsername: "maraz06.6754",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "2038",
          transactionHash:
            "0x061120be9690735f53f9fe43e966459243adbff13d54609515a5b0babe6dc024",
        },
        wld: {
          amount: "6.55",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "1803",
          transactionHash:
            "0x9c970bc9339b75936ee13179f0c789612c438bee3d1332d8735c1195319dc15f",
        },
        wld: {
          amount: "5.13",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 2175,
    name: "Union Trabajadores Virtuales",
    leaderAddress: "0xeADce18D3fc3F6955aac611B22a0e9bc0BA87901",
    leaderUsername: "nevski",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "2034",
          transactionHash:
            "0x87706925665405427db06e717fc0111162f9304424ae432c00ed0b1e2ef07efd",
        },
        wld: {
          amount: "6.54",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "1803",
          transactionHash:
            "0xf41359c486dc918dee408d44a00927708d3bc970c9687a4bb0ba48727355e00b",
        },
        wld: {
          amount: "5.13",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 1824,
    name: "WORLD DEMOCRATIC MOVEMENT",
    leaderAddress: "0x328a61De01f49b21Fd9e459e1aff3b14a9379468",
    leaderUsername: "fayzal",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "1966",
          transactionHash:
            "0x078c9d1d00127b68b43517be72ee6b41b24e40216708288b3e9a6c0c589b7dd5",
        },
        wld: {
          amount: "6.32",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "1776",
          transactionHash:
            "0xdbc24fe2f312eb295effe4c5c96a5c6ef7658f1527ac43aabf93356df206bf4a",
        },
        wld: {
          amount: "5.05",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 2797,
    name: "Latinos -spañol",
    leaderAddress: "0x618f5ccc7f5A367f9eAAD74198A08362C84ba807",
    leaderUsername: "rivas77502.6277",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "1941",
          transactionHash:
            "0xbd58d0907004534f6cad0b4acf1b39d76ca4525748c5b6c07d3625c6ee22441e",
        },
        wld: {
          amount: "6.24",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "1743",
          transactionHash:
            "0xf0f463c405b44905bc5677f2343d3ec64b48410a91a3f17e7e4a2761cdd5784e",
        },
        wld: {
          amount: "4.96",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 2805,
    name: "FREE WORLD",
    leaderAddress: "0x29Ad9CAe9e36873E4e3670a0A43493eEf5E2d100",
    leaderUsername: "faqih.5838",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "1758",
          transactionHash:
            "0x62ec462f0ceb134ec75d1c3c4b154bafa9185a3de30e406f47cee84cd6d3a28b",
        },
        wld: {
          amount: "5.65",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "1668",
          transactionHash:
            "0xea95c008e78da06f8c8bf1e6de28687bb26a81133b951cdb5a04128f4f40bf52",
        },
        wld: {
          amount: "4.74",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 2111,
    name: "GERAKAN WDD INDONESIA PENGEN KAYA",
    leaderAddress: "0xAc3fd2Dfc5F5e13C189b7A70F03a6eC67555CF2E",
    leaderUsername: "endriyan.5758",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "1725",
          transactionHash:
            "0xb4a6484e9f9c4dfa773ae40d0a41bd02fb93318fb8a0a3514302ac68b15e0fb6",
        },
        wld: {
          amount: "5.54",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "1538",
          transactionHash:
            "0x79bf005949947f23c05d55306db2e8b6aeef6680e3edbfe571e12c9f14be9f2a",
        },
        wld: {
          amount: "4.37",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 2157,
    name: "WorldHunterCoin",
    leaderAddress: "0x115B4F62A2016155Ab638E88Ca5Aa0F8403b29Dd",
    leaderUsername: "irfan7373",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "1722",
          transactionHash:
            "0xc590b16ee197563fadc2d42ca6ca262968d83fbe4f300f58baf41e4046c0af67",
        },
        wld: {
          amount: "5.53",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "1547",
          transactionHash:
            "0xae8c969b3e137a6321793c231044e28a84799e46e6e212e94d1557df16e16e08",
        },
        wld: {
          amount: "4.40",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 2546,
    name: "Pengen kaya 2",
    leaderAddress: "0xE3E5aed2260f64a3a2A7C3453b5eAec704730F48",
    leaderUsername: "sultan00",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "1686",
          transactionHash:
            "0x6cd6de38b1b6f26b98ab05f797361e2372caecdf3b3771b1d0d6d170443255ab",
        },
        wld: {
          amount: "5.42",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "1568",
          transactionHash:
            "0x109163c63d0a19533a43b889a82a8d7c961edf1ee8b006403efae15c6d1021da",
        },
        wld: {
          amount: "4.46",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 2320,
    name: "LATINOS UNIDOS AL MUNDO CRIPTO",
    leaderAddress: "0xaE7613A9f38d9c36F102068a2aF7BC6AE77c7BdE",
    leaderUsername: "zlepy.8527",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "1661",
          transactionHash:
            "0x1dd79444d5a8fb6f125baec35fac71aabb9f51eaf088077738c74cf3de948cd7",
        },
        wld: {
          amount: "5.34",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "1532",
          transactionHash:
            "0x80759f2fc299236617655985ba36b88cf3b7177537c883ff002c70b4a126c207",
        },
        wld: {
          amount: "4.36",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 240,
    name: "ONE AMERICA",
    leaderAddress: "0x8fFAC857CE7c1A7C0f2007Ed0B8d9Fee40698a1c",
    leaderUsername: "broda.6969",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "1654",
          transactionHash:
            "0x5821d4122e11d58fe82b74ed53f57e3dd728b833706e7e7f8289d867d927af40",
        },
        wld: {
          amount: "5.32",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "1520",
          transactionHash:
            "0x8f97e62e094e43d1757b1e0e5f4b3c4e9f51174f05c2e773468fbc5196e71375",
        },
        wld: {
          amount: "4.32",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 1526,
    name: "Partido México",
    leaderAddress: "0xAb72D1e27923bCDde84eb5bAF774Ad784F5c0C02",
    leaderUsername: "elgranpelon",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "1654",
          transactionHash:
            "0x7366067e47450f0be7957bc9c6c537481b5d3dd40b5550a5f2d818bb7aa32f11",
        },
        wld: {
          amount: "5.32",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "1508",
          transactionHash:
            "0x7d0c07ce9e3037ee7596935e648453035987d7d3dfbb0ba3c858ef7eda125c5b",
        },
        wld: {
          amount: "4.29",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 1479,
    name: "World Republic Indonesia",
    leaderAddress: "0x2fF16fe756d79F026d99c18e5Ee47D54beB229e2",
    leaderUsername: "ardiansh.2384",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "1643",
          transactionHash:
            "0xe70cfabe5337afc7eb01e13e716d889a75f208a32e67d1d5fefab1300e96fc5a",
        },
        wld: {
          amount: "5.28",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "1511",
          transactionHash:
            "0x50458b35ee5870f60b5e1474c9f8f196d6e57987587e95f24bba62f7e306508a",
        },
        wld: {
          amount: "4.30",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 1418,
    name: "Wldwdd Indonesian",
    leaderAddress: "0x695Af4B3f0FdcA882eF0Db9622385AB656a582F3",
    leaderUsername: "koh_alung.3411",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "1632",
          transactionHash:
            "0xf8e2d46e3565f4ac3d9cf603710e93b4d78544b14e5a112591067c3989d94bcb",
        },
        wld: {
          amount: "5.25",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "1490",
          transactionHash:
            "0x1a610b344827dd073dfec995a95fb219b6eb52d34fa05ce1546d8796480ccb69",
        },
        wld: {
          amount: "4.24",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 1978,
    name: "Nexus Global",
    leaderAddress: "0x356B251754887C91F0716F0435958017a0bDc3f3",
    leaderUsername: "bifosy",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "1600",
          transactionHash:
            "0xc812a09d8304425bd4bbdf0a5a929c37f7f35d2ff25aacd788e58947fb0f61b2",
        },
        wld: {
          amount: "5.14",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "1469",
          transactionHash:
            "0x96f05125150b623d1b9278c41bbf33dc69b91bcccaef430ff7afd30ef45bb70b",
        },
        wld: {
          amount: "4.18",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 2463,
    name: "Movimiento Anarco Popular",
    leaderAddress: "0x5d48951117ABDAA19A5177A26Ab8A4073aDDf911",
    leaderUsername: "eskizorock_92.5626",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "1567",
          transactionHash:
            "0xb93c8d948a2f85f802ee467ddc42445781a60a94ac7ef6a47a7df444d97ddd16",
        },
        wld: {
          amount: "5.04",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "1445",
          transactionHash:
            "0x26124ba389f6f28ba738dff6034d26eb42b6b5bdab26bb2cbd489c0db2a337bf",
        },
        wld: {
          amount: "4.11",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 1077,
    name: "Latinos Crypto World",
    leaderAddress: "0x8D4E206e77e1454E0F352Acc216278dd55FF82Ad",
    leaderUsername: "andresg34",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "1542",
          transactionHash:
            "0xde3da2e56b0e952677dee57fd330c5df9b750872d3335523d053472cf7d5210c",
        },
        wld: {
          amount: "4.96",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "1439",
          transactionHash:
            "0x772ff6eade44c576f3e7ec11c72e310412dde716a28741c26d93ffd6b1a05b0f",
        },
        wld: {
          amount: "4.09",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 993,
    name: "Unión de Realidades (UR)",
    leaderAddress: "0x1d720625FFF15ba3732663D6257F59A9Dfe74562",
    leaderUsername: "yosoymingo",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "1521",
          transactionHash:
            "0x367cfb4cce71ede220261740615ea7aa4064034d3be2d1ab727a451b95630655",
        },
        wld: {
          amount: "4.89",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "1412",
          transactionHash:
            "0x7c46951f2b6019c257a6b524d474dc1efc6f47c42de5f6b5446ad9d44b2a6e6b",
        },
        wld: {
          amount: "4.01",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 1768,
    name: "WLD survivor Indo",
    leaderAddress: "0xa7Efb5cbf59Dc9eD32CA40B8699971018B2E6Bb7",
    leaderUsername: "adijepe.8881",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "1499",
          transactionHash:
            "0xd1352a820dc3bb3cf362ee62c2adb31aeeaeaa6d5b4465f0d72c348b7e934cf5",
        },
        wld: {
          amount: "4.82",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "1388",
          transactionHash:
            "0x82bbbbd5470a07f25bd5fce8e382d67d0ec561226b5c039cb63b920f26d4ca15",
        },
        wld: {
          amount: "3.95",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 1684,
    name: "Indonesia maju bersama",
    leaderAddress: "0x3536833A0544576711847f79AF30e2FcD7d89FD3",
    leaderUsername: "uziii.7614",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "1481",
          transactionHash:
            "0x16219e59aca19b1bba80094656aea99a34123ad9a6d922c7f98dc01fdac5883a",
        },
        wld: {
          amount: "4.76",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "1382",
          transactionHash:
            "0x088e10fe6c5ecb59150a1a93464cd9b28052813af9ca5dc359156af95bdfbea9",
        },
        wld: {
          amount: "3.93",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 2575,
    name: "WINGS OF FREEDOM",
    leaderAddress: "0xA0e257be47D18C1101418ecc67E85FA2963FC30d",
    leaderUsername: "jaganjash",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "1463",
          transactionHash:
            "0xbaf67c4fabcedffb54219801c9b15a560e4eabc26309d5c07d73a7ddc92290b2",
        },
        wld: {
          amount: "4.70",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "1370",
          transactionHash:
            "0x96ac8e3e538d2ded2de8688291457c9ed81642537385a3afa7eb183aafde745d",
        },
        wld: {
          amount: "3.89",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 2415,
    name: "Digital Nomad Party",
    leaderAddress: "0x593a263ff2C7D3F231A7d30FE598535772A6ed87",
    leaderUsername: "wahyu.2312",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "1452",
          transactionHash:
            "0x54e97ce06dd9fb9b51e865c3ca215506647700a5410d384fc40b43119a4f79b5",
        },
        wld: {
          amount: "4.67",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "1349",
          transactionHash:
            "0x2b41cd717f1bed9ac51972b169e773be2e74d4e37ec92c5deb450660b1512734",
        },
        wld: {
          amount: "3.84",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 1215,
    name: "World Community Indonesia",
    leaderAddress: "0x413E33e1172e2184ab4d6084360fA562b47b26a6",
    leaderUsername: "panjirama.1811",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "1427",
          transactionHash:
            "0x1ff1162dc1a3790fe71efcbd7439a7bb058f65240cd02b5e0c4ee968f20f0985",
        },
        wld: {
          amount: "4.59",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "",
          transactionHash: "",
        },
        wld: {
          amount: "",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 2383,
    name: "KNTL👅",
    leaderAddress: "0x4602322cec1857D703f85bcF72CAC0BCf1fEac5c",
    leaderUsername: "aisakbar.6740",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "1417",
          transactionHash:
            "0x3ac7e8c9dc336c885c10be96cfc7bcaa0e0f886930915e27fa4cab33c596961a",
        },
        wld: {
          amount: "4.55",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "",
          transactionHash: "",
        },
        wld: {
          amount: "",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 2662,
    name: "Latino America 💰💰 unidos podemos hacer más 💲💰",
    leaderAddress: "0x70C1d07F87b19eE0b61e108e7634a99d5d7Cd851",
    leaderUsername: "andresg26",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "1413",
          transactionHash:
            "0xda49b7435db7d9b6c129fe65fc6673a6f3144e9eed29435c4470fec779d77c78",
        },
        wld: {
          amount: "4.54",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "",
          transactionHash: "",
        },
        wld: {
          amount: "",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 1815,
    name: "Flow",
    leaderAddress: "0xcE6F05454649dF0068bD85c24344Bdc248D692D8",
    leaderUsername: "imkillua1945.2290",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "1406",
          transactionHash:
            "0xc4b8c9f1c993103595100f19a86a4628b439f112b61543e53035c980d1d1d76e",
        },
        wld: {
          amount: "4.52",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "",
          transactionHash: "",
        },
        wld: {
          amount: "",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 1880,
    name: "Partido de la renta común",
    leaderAddress: "0xfdb586487ee78Ad1584c35E907cCD7769909c13E",
    leaderUsername: "nazareth37",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "1399",
          transactionHash:
            "0xcf87d51a2829117be02a05baf6a47e6ef5719c2ff20e9922f5b52068cc286805",
        },
        wld: {
          amount: "4.50",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "",
          transactionHash: "",
        },
        wld: {
          amount: "",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 2822,
    name: "Amigos de todo el mundo",
    leaderAddress: "0x3919164D00419b23E85d0bDf69f102F7bB32dc46",
    leaderUsername: "juanescalante.8849",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "1370",
          transactionHash:
            "0xf437e373db523ca6c7dcc0807ec1e1df9ad6907058494468e469ad1c50b39aee",
        },
        wld: {
          amount: "4.40",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "",
          transactionHash: "",
        },
        wld: {
          amount: "",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 2626,
    name: "Partido real Tierra Plana Flat Earth",
    leaderAddress: "0xe76f58f8b81eca1d15499c7b98d9059de0635620",
    leaderUsername: "0xe76f...5620",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "1366",
          transactionHash:
            "0xa50a216b55b084e8a592877fc2ce0927f9e0cfd4463374a1988f092e1f55420d",
        },
        wld: {
          amount: "4.39",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "",
          transactionHash: "",
        },
        wld: {
          amount: "",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 2788,
    name: "CLAIM WLD DISINI 🪙",
    leaderAddress: "0x6F9789196b8cA70f503A2d762ac6ED7645E85663",
    leaderUsername: "galang.9999",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "1359",
          transactionHash:
            "0xc4fd905b3abbc7d844b61689e9a880daa5438b9253181bdf34024ba3693745cc",
        },
        wld: {
          amount: "4.37",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "",
          transactionHash: "",
        },
        wld: {
          amount: "",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 1963,
    name: "WLD ID Signals",
    leaderAddress: "0xB0915c235Cdb4E4CF9cC25EF064CD0cebb33BA3F",
    leaderUsername: "jikays.7687",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "1352",
          transactionHash:
            "0xe3c9d60e4c78b94f190465347fe4db3138a5b11665c7c7398e3465f0fdc8fd5f",
        },
        wld: {
          amount: "4.35",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "",
          transactionHash: "",
        },
        wld: {
          amount: "",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 10,
    name: "World Republic European Union",
    leaderAddress: "0xA3d18C664936Cac3513ADd499bbE2409A85286A4",
    leaderUsername: "gawronek.9191",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "1352",
          transactionHash:
            "0xa3215b92d4faf49c5081ed102f5c6802260982e3bb1a2eca3960708ae66083cb",
        },
        wld: {
          amount: "4.35",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "",
          transactionHash: "",
        },
        wld: {
          amount: "",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 975,
    name: "PAGUYUBAN WLD SAWAH BESAR",
    leaderAddress: "0x9CAC774e3D22A9838D164B06BB54E5c11a9B475C",
    leaderUsername: "rickjordy.6669",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "1341",
          transactionHash:
            "0xae7cc4f752ead22ea1f3373c2f9e8bb4e1516c861370ae40e0687148f5d73749",
        },
        wld: {
          amount: "4.31",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "1328",
          transactionHash:
            "0x8eb986c4fbd4782c12981311905d05ee4cdf59994981c72c0b914f1120b57d64",
        },
        wld: {
          amount: "3.78",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 2760,
    name: "BITCOIN MUNDIAL",
    leaderAddress: "0xfD1D9CE6BbD3f6F2Fa656A04E7abfC5cB8CA2C3F",
    leaderUsername: "criptobisnes",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "1338",
          transactionHash:
            "0x06fb500ad406699bf6b550789cf053b038189ef765e01d4627499517c21d5594",
        },
        wld: {
          amount: "4.30",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "",
          transactionHash: "",
        },
        wld: {
          amount: "",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 2062,
    name: "Malaysia WLD/WDD",
    leaderAddress: "0xbB406Cf6AE368A8F03640d0aE1A5061473f1f1b7",
    leaderUsername: "abgcik.1033",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "1338",
          transactionHash:
            "0x05f257926fd432898433d42177b931b0176dfbad39522539806f460a2fe4bd0e",
        },
        wld: {
          amount: "4.30",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "",
          transactionHash: "",
        },
        wld: {
          amount: "",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 1995,
    name: "Republic of Kemayoran",
    leaderAddress: "0x5103A59150d0B987C68a286Ee7477a69AC37E994",
    leaderUsername: "crews",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "1338",
          transactionHash:
            "0xfd60da2088ef1cc8bcab087f69fc6b23324b171810f53f51f13ef7d5c0cf7bfc",
        },
        wld: {
          amount: "4.30",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "",
          transactionHash: "",
        },
        wld: {
          amount: "",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 1403,
    name: "Latinos Unidos 🇵🇾",
    leaderAddress: "0x6E008C16f1e752e1252bfA3B01571f47a883b4F9",
    leaderUsername: "rockijo.5495",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "1334",
          transactionHash:
            "0x28896b6ea1364fa11f32db364070c0b113b7638d616c8519828819c647d53ca7",
        },
        wld: {
          amount: "4.29",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "",
          transactionHash: "",
        },
        wld: {
          amount: "",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 1795,
    name: "Minning all crypto",
    leaderAddress: "0x44514b36F4b6cC116609706ca47fd24d64e39180",
    leaderUsername: "moh0404.9225",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "1330",
          transactionHash:
            "0xe09b08ff79030721aeab156a75a10d4e222fef507530dee005d242f4923615d8",
        },
        wld: {
          amount: "4.27",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "",
          transactionHash: "",
        },
        wld: {
          amount: "",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 2845,
    name: "INDONESIA MAJU DIGITAL",
    leaderAddress: "0x790F247Ea247Ee590daC5641bB428Ff43283499A",
    leaderUsername: "alfino.7912",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "1323",
          transactionHash:
            "0xb38232fe501475dd36d349626dc156464318f4e2d3f9d9c0b6585ce9cd86eaaa",
        },
        wld: {
          amount: "4.25",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "",
          transactionHash: "",
        },
        wld: {
          amount: "",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 2491,
    name: "Kenyan people's party",
    leaderAddress: "0xD88AAA445cf0BD805020d43e1426c8c5257c0146",
    leaderUsername: "twenty3stores",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "1316",
          transactionHash:
            "0x8f2e8143f32d91cd96e091c5885608aa2e34347ce60b84487bae99595c25857c",
        },
        wld: {
          amount: "4.23",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "",
          transactionHash: "",
        },
        wld: {
          amount: "",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 2810,
    name: "Partai Taekanjing",
    leaderAddress: "0xdf7982DBe280E83e1eD0Be2761504b01B29BC0c2",
    leaderUsername: "salma.9906",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "1266",
          transactionHash:
            "0x83af562c9bbc7321744a971ed005290c4479f27a8f375e0a5c92f0b004f354af",
        },
        wld: {
          amount: "4.07",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "",
          transactionHash: "",
        },
        wld: {
          amount: "",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 2562,
    name: "World Republic id 🇮🇩",
    leaderAddress: "0x178Cb86e67233fe965469970a004dA00DD8f6bC6",
    leaderUsername: "nr1awr.3601",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "1262",
          transactionHash:
            "0x4426d07da21c8bc2957d4251eefded84beab1267093eadffbbbacfd3cdcf2cfb",
        },
        wld: {
          amount: "4.06",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "",
          transactionHash: "",
        },
        wld: {
          amount: "",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 547,
    name: "🇵🇪ARRIBA PERU GRANDE🇵🇪",
    leaderAddress: "0x3A1D4A57f1A590BA739B0DF4692Ec750AcE759Ef",
    leaderUsername: "yummi1111",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "1259",
          transactionHash:
            "0xe11bfc31984ae14dbdb95d820722d20bcdc947f2bfa1233514885073497fd1ea",
        },
        wld: {
          amount: "4.05",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "",
          transactionHash: "",
        },
        wld: {
          amount: "",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 1568,
    name: "Arcadia Party",
    leaderAddress: "0xe544a81b273f3107b09CD75F4EBD4f6970C65453",
    leaderUsername: "wldchan",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "1241",
          transactionHash:
            "0xb1dcee35856f136b310fd3cc455a11236a2b7a46c2825d3f8fb47161bae36553",
        },
        wld: {
          amount: "3.99",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "",
          transactionHash: "",
        },
        wld: {
          amount: "",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 3979,
    name: "100.000 World Coin",
    leaderAddress: "0x72218bbd0cc41469154ded707a96226a67ba6b0b",
    leaderUsername: "rahmattaufik.5405",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "",
          transactionHash: "",
        },
        wld: {
          amount: "",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "2967",
          transactionHash:
            "0x8a4693653e0235678392dfc0ce84364662f5249bd6d3c70e91b2004bb532703a",
        },
        wld: {
          amount: "8.44",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 3149,
    name: "FREE WORLD COINS",
    leaderAddress: "0xf25abcfbf2cad2fed5f0f8e47e193d235ac0b7f3",
    leaderUsername: "onlinebanking",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "",
          transactionHash: "",
        },
        wld: {
          amount: "",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "2513",
          transactionHash:
            "0x093fb6e88c6b6a6b4975ae8ed380368ba4c218fdb113a6e1e2f091fa6cca0f01",
        },
        wld: {
          amount: "7.14",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 3381,
    name: "Humildemente somos pocos",
    leaderAddress: "0x63877a19611d310d6bece8de69033692cb1f0b45",
    leaderUsername: "ferrr98",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "",
          transactionHash: "",
        },
        wld: {
          amount: "",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "1782",
          transactionHash:
            "0x00b40e8e66eb362c1be143250b94a7114ae0abcf7d95588f770ea4608648289f",
        },
        wld: {
          amount: "5.07",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 1304,
    name: "TPulseFi",
    leaderAddress: "0xf04a78df4cc3017c0c23f37528d7b6cbbeea6677",
    leaderUsername: "tpulsefi",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "",
          transactionHash: "",
        },
        wld: {
          amount: "",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "1872",
          transactionHash:
            "0xa1edd97cec227212653e9421a866bf72db9b8f48e6f8f66eba8e0e78f0792c94",
        },
        wld: {
          amount: "5.32",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 3673,
    name: "WDD REPUBLIK",
    leaderAddress: "0x697227fdb0611737b9080762092876f6092e504b",
    leaderUsername: "brew.5910",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "",
          transactionHash: "",
        },
        wld: {
          amount: "",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "1632",
          transactionHash:
            "0x517a752efc5e0c1de4845d92b200478720b3f30aec38e4072ccb636d8917f7d6",
        },
        wld: {
          amount: "4.64",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 4109,
    name: "Get FREE WLD, join sekarang!!!",
    leaderAddress: "0x6c8506d6e95854c99f1e4e54f68e2099d0e4fcb9",
    leaderUsername: "yugolaksono.5121",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "",
          transactionHash: "",
        },
        wld: {
          amount: "",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "1622",
          transactionHash:
            "0x24251de90cca135481816e23d73cb401c1d04166ce3b67a4de8b128888eda2e1",
        },
        wld: {
          amount: "4.61",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 3721,
    name: "GABUNG DAN DAPATKAN FREE Rp.50.000,- SETELAH JOIN",
    leaderAddress: "0x9491ddf6892a1f14d3bd996b6481cf47bef863b9",
    leaderUsername: "0x9491...63b9",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "",
          transactionHash: "",
        },
        wld: {
          amount: "",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "1613",
          transactionHash:
            "0x2b1e423dec95c6212f18d3c9c4fe8a0cb28a94025edc1a80ac800ec431d35314",
        },
        wld: {
          amount: "4.59",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 4137,
    name: "GRATIS WLD",
    leaderAddress: "0xf788355d36278b734dd0d9e7f54317b8e46acfad",
    leaderUsername: "imaferik.6784",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "",
          transactionHash: "",
        },
        wld: {
          amount: "",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "1580",
          transactionHash:
            "0xf30bd4b02cdd3c29f74e51e42b6eac6c6461b17ad0072cbe4af6710537c60669",
        },
        wld: {
          amount: "4.49",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 3415,
    name: "Partai Republic Coin",
    leaderAddress: "0xa11928d9a92a2e1ca5877d32a2f70b7dabd51b0c",
    leaderUsername: "ondel.8888",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "",
          transactionHash: "",
        },
        wld: {
          amount: "",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "1529",
          transactionHash:
            "0x27b9d794fd56a86fc096725f9cdfb4489992ef3dcfeeabdfa6040cd478f2f23c",
        },
        wld: {
          amount: "4.35",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 3039,
    name: "🔘 United New Humanity Party - UNHP",
    leaderAddress: "0xf52adbe72dc532e4564e1c0256e45ca0d0d012ab",
    leaderUsername: "elias.6600",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "",
          transactionHash: "",
        },
        wld: {
          amount: "",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "1523",
          transactionHash:
            "0x33c408634cc421d836e2c7f6c05aabf9c4bb3be2f5d76f9298d18c87bc32b483",
        },
        wld: {
          amount: "4.33",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 3556,
    name: "CLAIM 250 WLD ✔️",
    leaderAddress: "0x4e05a1a7f6b44850e4fc380ddcc21a07afc27049",
    leaderUsername: "ceo999",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "",
          transactionHash: "",
        },
        wld: {
          amount: "",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "1499",
          transactionHash:
            "0x4e403e2d61dc46a45cccfd65d212f7e4a3a464412ea4ebe1d1c4152e12d6ab2b",
        },
        wld: {
          amount: "4.26",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 3167,
    name: "World Indonesia bersatu",
    leaderAddress: "0xdef877654ec503afa09a227f954a231617ec5e57",
    leaderUsername: "asepyusup.7975",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "",
          transactionHash: "",
        },
        wld: {
          amount: "",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "1499",
          transactionHash:
            "0x20f8144a1ab17b862ab6a6ecd5325f926dacb5718ce1d8ffc44280913d0fc757",
        },
        wld: {
          amount: "4.26",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 3526,
    name: "Gabung dengan saya Get Free your world coin ditiap 100.000 wld",
    leaderAddress: "0xa457f57d16b51145788a3cc89e65851a679e5e45",
    leaderUsername: "firmansyah.8293",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "",
          transactionHash: "",
        },
        wld: {
          amount: "",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "1481",
          transactionHash:
            "0x655e73e66a80e69d75dae275a1e290327f10ca1ad53f386ab7f4194da0533c16",
        },
        wld: {
          amount: "4.21",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 3825,
    name: "Dapat koin gratis 999++",
    leaderAddress: "0xd9d5c85fc1776621428091f108c36ec450f4e3ac",
    leaderUsername: "0xd9d5...e3ac",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "",
          transactionHash: "",
        },
        wld: {
          amount: "",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "1409",
          transactionHash:
            "0xd5078c2a2afc5bbe97c10b7c5c8dcf24ce9ed8a5849c17c6d65ffcf2170a7be8",
        },
        wld: {
          amount: "4.01",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 3006,
    name: "Bgolden",
    leaderAddress: "0xae31b7566b4765cda92e0f0cf33a5d185b55e674",
    leaderUsername: "andres.4837",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "",
          transactionHash: "",
        },
        wld: {
          amount: "",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "1400",
          transactionHash:
            "0xe0b2a6a05adecdef9c5b946ec2ce17a832bbc6261be4dd8caf7b15c79ff319b2",
        },
        wld: {
          amount: "3.98",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 3159,
    name: "Argentina Republic",
    leaderAddress: "0x4c34857bbf51b584b36c4db4e4591da990c022b7",
    leaderUsername: "tordoya13",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "",
          transactionHash: "",
        },
        wld: {
          amount: "",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "1397",
          transactionHash:
            "0xf930218cc14aa6570a3590c503bd8ac21fd20b35c2f40ae3c23706210367ed1c",
        },
        wld: {
          amount: "3.97",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 3490,
    name: "Maju Jaya Sejahtera",
    leaderAddress: "0x71197e5bb924298c92dcdf618f6be16bce1dd064",
    leaderUsername: "sapoetra.3907",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "",
          transactionHash: "",
        },
        wld: {
          amount: "",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "1376",
          transactionHash:
            "0x35343c8b832ab9a252fcaa75193c96031f985e0461466e1e5b95f3266995ceb1",
        },
        wld: {
          amount: "3.91",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 4372,
    name: "World Coin Indonesia",
    leaderAddress: "0x4d68b23c251640d8fbf9981b98b8811689c1b75d",
    leaderUsername: "rangs_09",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "",
          transactionHash: "",
        },
        wld: {
          amount: "",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "1373",
          transactionHash:
            "0x80659f0c66637fa4461f5161cd349522d2454e1c3b3cb1175caddefa1070c86c",
        },
        wld: {
          amount: "3.90",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 3402,
    name: "INDONESIAN DEMOCRATIC WDD🇮🇩🇮🇩🇮🇩",
    leaderAddress: "0xd79d7f957a95b53a7508799b00341979d903a360",
    leaderUsername: "reincarnate.1801",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "",
          transactionHash: "",
        },
        wld: {
          amount: "",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "1373",
          transactionHash:
            "0x5e07ee40e4e0bac9c5040c90f81367b34afe9f8a0f1d495dee3898e7e1bacf05",
        },
        wld: {
          amount: "3.90",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 3262,
    name: "DAGET SETIAP HARI",
    leaderAddress: "0xdf25e94d41bd00c47dc7e6529208ac18cb00a78c",
    leaderUsername: "whalebtc",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "",
          transactionHash: "",
        },
        wld: {
          amount: "",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "1358",
          transactionHash:
            "0xfcdcf68e252454f657f8b8428a233356f7eee5bba790988e2c149c1c654fe4e2",
        },
        wld: {
          amount: "3.86",
          transactionHash: "",
        },
      },
    ],
  },
  {
    id: 3207,
    name: "Partido Indígena Colombiano",
    leaderAddress: "0x30ef3e3f56c67bc59428e98f70aeff1de92bf8c1",
    leaderUsername: "admJulioCesar",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 1,
        wdd: {
          amount: "",
          transactionHash: "",
        },
        wld: {
          amount: "",
          transactionHash: "",
        },
      },
      {
        weekNumber: 2,
        wdd: {
          amount: "1346",
          transactionHash:
            "0x14c254721f716007f7eb395e4569c2a94b122e92ba35cfa4f92ef9d0d5318bfc",
        },
        wld: {
          amount: "3.83",
          transactionHash: "",
        },
      },
    ],
  },
];
