import { PartyPayout } from "@/lib/types";

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
          transactionHash:
            "0xfba70571a7b9cc8591d59ccf59cb36859f63e9ddaa3a2b39c952341037760825",
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
          transactionHash:
            "0x7ca41d09b0bd7a15cfde718b06f6660fa309a83064f711e00c69978f9f8e10ec",
        },
      },
      {
        weekNumber: 3,
        wdd: {
          amount: "44114",
          transactionHash:
            "0xae1cf8d45c621c23aaac3e608102762ff07a0f87ef6ee895b61acd00e231687a",
        },
        wld: {
          amount: "30.81",
          transactionHash:
            "0x4c1dd943ddd9611afcad09a36e98f92d783c78283236fea34c33be64a0e81ab1",
        },
      },
      {
        weekNumber: 4,
        wdd: {
          amount: "41641",
          transactionHash:
            "0xf68544e28545a1c2f8cc2d8eec089c71020e722c4b3a7b446304edd6a3a82143",
        },
        wld: {
          amount: "24.80",
          transactionHash:
            "0xefbdc168d380738d5a4e85877a51685b0c9d939724cadb1543e54f77c5ce7c48",
        },
      },
      {
        weekNumber: 5,
        wdd: {
          amount: "38873",
          transactionHash:
            "0x072441e60feb69913228af811449d4c42b66890a584bfc1ed053db72dfaeaed8",
        },
        wld: {
          amount: "19.84",
          transactionHash:
            "0xaf8b86daaa908843d111bcbaf13e46eb20dccf30a8b4c661529cf5b9669b0aec",
        },
      },
      {
        weekNumber: 6,
        wdd: {
          amount: "36398",
          transactionHash:
            "0x96ed50ee201101dc35ad98079516654b3b946d82e36d8942147fdd488abc5146",
        },
        wld: {
          amount: "18.55",
          transactionHash:
            "0xfa0faac1fccf50e5b05a802080c95be16d77c98d8622dbc84f2e71e6b89da741",
        },
      },
      {
        weekNumber: 7,
        wdd: {
          amount: "34403",
          transactionHash:
            "0x375309ab33c80f7cde49372e3e0d3f7d0b8fcdd2dcd86fb53eb0c758c0942080",
        },
        wld: {
          amount: "24.15",
          transactionHash:
            "0x8d86aef95c4de67a5191f8f684ee8ea1d63974b032d7ab5d7548d344df7968cd",
        },
      },
    ],
  },
  {
    id: 5,
    name: "World Republic Constituent Assembly 🌍",
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
          transactionHash:
            "0xa0311e464e08ca770104ad1bfed6d4060ab7cc8b2ee89b4a36ea2ec86f624995",
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
          transactionHash:
            "0xd662b55524e0f803833ef201b64c3990ee77931b3f5cf6af2dddcbb6561f6991",
        },
      },
      {
        weekNumber: 3,
        wdd: {
          amount: "9906",
          transactionHash:
            "0x13a7f54f76b363aa1fbf120b4a7ed5fe304fee37dfbb86c714a9f94aa653f155",
        },
        wld: {
          amount: "6.92",
          transactionHash:
            "0x6ec33f96b5ea6590649f318fd82b29a169e2df7df47ae804691e735c0b64a622",
        },
      },
      {
        weekNumber: 4,
        wdd: {
          amount: "9251",
          transactionHash:
            "0xb18a4c0be4f6e396776e6db4e7333bb263564b8f04ebb771358a83bd41372902",
        },
        wld: {
          amount: "5.51",
          transactionHash:
            "0x2a2094120a5360a0836e96146d9bac3dcfcb87d5ed5fb9d5272bc4457c5ff97b",
        },
      },
      {
        weekNumber: 5,
        wdd: {
          amount: "8513",
          transactionHash:
            "0xe7f036e8740455bab53ecdef621a7d2cc497aeba54ebd4c027b7a2a49573de04",
        },
        wld: {
          amount: "4.35",
          transactionHash:
            "0xd81f47a764a786178c0bd7ac586137d377ecd765e45452bf27dadf41f82380a5",
        },
      },
      {
        weekNumber: 6,
        wdd: {
          amount: "7968",
          transactionHash:
            "0x60fc42202685e10a59ce9e636be8e6c35fbef229a627a874774dd5838630e9a3",
        },
        wld: {
          amount: "4.06",
          transactionHash:
            "0x59b4fddb080b2ce718229b62c9273730518ae83b4c917f508a3f474cfc85f7ad",
        },
      },
      {
        weekNumber: 7,
        wdd: {
          amount: "7630",
          transactionHash:
            "0xdd84901023562662c14103d1dfd4591424bf02362ee4b5b667898190fbd7dc54",
        },
        wld: {
          amount: "5.36",
          transactionHash:
            "0x8457a79b344847d2386946a7fac13ebe135013f0a45e3f03b8397aad174322c1",
        },
      },
    ],
  },
  {
    id: 829,
    name: "Free coin",
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
          transactionHash:
            "0x6f4eedbebf57c60288d5b1563d9c179318d03b0fef3f817350a414db12fc0fa2",
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
          transactionHash:
            "0x5fda9b27b879573f38f6a2e1f8c4c48e80c7a5eeee74ed07bf7993905effb840",
        },
      },
      {
        weekNumber: 3,
        wdd: {
          amount: "5189",
          transactionHash:
            "0xcbc4a4695607c00c7c7e01b09a64ce5ba83f6d51d8092ff4fdf8538cc1dcd5d1",
        },
        wld: {
          amount: "3.62",
          transactionHash:
            "0xf54942a4a2694ae4624d5c003d42fa52830ca6901644880f8ad02746e82f3d67",
        },
      },
      {
        weekNumber: 4,
        wdd: {
          amount: "4838",
          transactionHash:
            "0x897379fa435bb8f9f08d98aa2aa96dc4996d40b3f7f3eacf6143417e6764cad2",
        },
        wld: {
          amount: "2.88",
          transactionHash:
            "0x111e6474b66284ddde87f8bbc8089b532c6902dab4638e436bb6522d3450dab4",
        },
      },
      {
        weekNumber: 5,
        wdd: {
          amount: "4550",
          transactionHash:
            "0x94d081a0c6c77688601633618f54274bafb02d7da211b65a2343079a95d0b415",
        },
        wld: {
          amount: "2.32",
          transactionHash:
            "0xd8f09493e27961a39456f59e1de35e6f99fe5e4ba0096872b12d4c663c8f91a1",
        },
      },
      {
        weekNumber: 6,
        wdd: {
          amount: "4372",
          transactionHash:
            "0xbd7b0caa9881ebefb240ccef653469d4c128609d2566e6edaab481ba9ae161ba",
        },
        wld: {
          amount: "2.23",
          transactionHash:
            "0x83345a3ff75ac0ebfb1a46772213d7b97b95287d274db42568a71e51628ede77",
        },
      },
      {
        weekNumber: 7,
        wdd: {
          amount: "4227",
          transactionHash:
            "0x3e2a15eef7e6343c4b2d93939f9a3dc97c7c257588589784e766559cae52650a",
        },
        wld: {
          amount: "2.97",
          transactionHash:
            "0x15d3d2b351fefd715d57ee90917561b6de30c054613e160ec14cd2f91c242917",
        },
      },
    ],
  },
  {
    id: 1294,
    name: "Apoyando la idea de Pablo Emilio Escobar Gaviria 😎",
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
          transactionHash:
            "0x3a1cef2e0add636f1152637a791e4dbd66fa4e7c34fed37b571f475134a39317",
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
          transactionHash:
            "0xb9b43d6f07db7948aa401e02144b7eb7daee4d85797d49ce796e26244e1334d9",
        },
      },
      {
        weekNumber: 3,
        wdd: {
          amount: "4969",
          transactionHash:
            "0x036721d8198d1baa995c654d1ca61b9952bd4a5d6d459f702ff253154d05e5f7",
        },
        wld: {
          amount: "3.47",
          transactionHash:
            "0x2dd0942668c9774b65f11096837bb919e05f900f3c5e6c211858ef745bf1bc28",
        },
      },
      {
        weekNumber: 4,
        wdd: {
          amount: "4706",
          transactionHash:
            "0xdbca7fac37be3cacdbd26aeb569c6d7b8d7d1b8c84a93540dd3f4a95c634ba40",
        },
        wld: {
          amount: "2.80",
          transactionHash:
            "0xe8fab9d6aaa50180d935f9151f760d2ea9fe7406bc8c7660a41996e8190bafea",
        },
      },
      {
        weekNumber: 5,
        wdd: {
          amount: "4413",
          transactionHash:
            "0xcf9575c350657eac74865f2cda2ad3d42435af4279a62768a0a5d1451d861273",
        },
        wld: {
          amount: "2.25",
          transactionHash:
            "0xfdf5ce0eeb5ab55a0163dd37412082267c8aafb5654aac680a503f358f8a16c3",
        },
      },
      {
        weekNumber: 6,
        wdd: {
          amount: "4256",
          transactionHash:
            "0x94e0e51cd70d4ee671a3f3ad24826ae44d340cda9305f67e1621861e8477ab34",
        },
        wld: {
          amount: "2.17",
          transactionHash:
            "0x8c97dd3a7d65a06b434922f2d2afded393dfc3f2ec366b32f5c92337ccc40df0",
        },
      },
      {
        weekNumber: 7,
        wdd: {
          amount: "4127",
          transactionHash:
            "0x4ce884b1606f2c118e5b040f783ff9204f703e12742db0de1b285659b04e2fea",
        },
        wld: {
          amount: "2.90",
          transactionHash:
            "0x43b8518ffc8db15f55828ad164f3efe87ed0f7f4ccc448b4e9b95631890d514f",
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
          transactionHash:
            "0x8b8e72fa71296920db478fde759d014e0f3fb1a50e28e1f773defc2285131358",
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
          transactionHash:
            "0x9db1e7ea76af6213a3b07984f7b89f4c60f6f2a27883963dd362c4a718a9039a",
        },
      },
      {
        weekNumber: 3,
        wdd: {
          amount: "5388",
          transactionHash:
            "0x01bcbd090fcc4fb71733bf29bfe83dc83faec29b626f4755c99e98dd424054d0",
        },
        wld: {
          amount: "3.76",
          transactionHash:
            "0x39eb2a12ec057d80a5ecc84c41a31d01d1d6cb59e453d3de83de68f420cfcd0f",
        },
      },
      {
        weekNumber: 4,
        wdd: {
          amount: "5269",
          transactionHash:
            "0xbf1ce9f64a49f80eb96d5919fe42133e883004032f332c70f89a31c0738d5121",
        },
        wld: {
          amount: "3.14",
          transactionHash:
            "0x7a5f5716778ebae5a8ac5dbb9c746f17cf378a73f972dca6856797ebe8880684",
        },
      },
      {
        weekNumber: 5,
        wdd: {
          amount: "5191",
          transactionHash:
            "0x201e7a7238c7b56f39b6234729b27c6df450c0f1c83ecc297ff2833508f22e74",
        },
        wld: {
          amount: "2.65",
          transactionHash:
            "0x08b9556e34a2280ce60c23b0c3c6f6bf4fa9ffd828ae93af25982fb22b3a66b7",
        },
      },
      {
        weekNumber: 6,
        wdd: {
          amount: "5067",
          transactionHash:
            "0x596e1ff915a81000f297188069ec465d3cddc500eed3b6bb62efdf5524254bf2",
        },
        wld: {
          amount: "2.58",
          transactionHash:
            "0xeaa1b02dcdca495d7095e0ccecdcc47fb7fd462815469a19c13b852a4dc57147",
        },
      },
      {
        weekNumber: 7,
        wdd: {
          amount: "4948",
          transactionHash:
            "0x08dcc5c44fe32633e89ca0aefecef828953be7e3b128a4fb4a6129d3512aa71d",
        },
        wld: {
          amount: "3.47",
          transactionHash:
            "0xff1e669c564595698c603916c62aa5eea9d82c395185a92671d5e9ead6dac5a7",
        },
      },
    ],
  },
  {
    id: 11,
    name: "🌍Gobernanza Hispana💎",
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
          transactionHash:
            "0xed01432cdff77f2156d4c8962eff49253c1cf54643a4716e493d48f511d448db",
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
          transactionHash:
            "0x473bd58dd53756a5ad4faf86b2e890d29bdb281dd62fe39a7607baf6756b936c",
        },
      },
      {
        weekNumber: 3,
        wdd: {
          amount: "5168",
          transactionHash:
            "0xc3a5e3582f4114fb1bfc0203fd6dcaccd4b5e3cd91cf036f6f8e616c81859d6e",
        },
        wld: {
          amount: "3.61",
          transactionHash:
            "0x419abb646fd6dae2be98f5517bb94191501ca1cf2440305f67710b55d2c0f0a0",
        },
      },
      {
        weekNumber: 4,
        wdd: {
          amount: "5007",
          transactionHash:
            "0x7305ea29b73c2e0d8eb528df328b149d365fe135112a31bd41fa30f0b07fef87",
        },
        wld: {
          amount: "2.98",
          transactionHash:
            "0xda489d568aa33aef6bde093f1cca89ad718141cd8b0e86cc78e9a51655dffec4",
        },
      },
      {
        weekNumber: 5,
        wdd: {
          amount: "4856",
          transactionHash:
            "0x150e8d71c86d27847432efd7dfc74a3805c31cb4eba4cd97c77a306af0524074",
        },
        wld: {
          amount: "2.48",
          transactionHash:
            "0xe7ea1da392fe44036583a33bdccaeddb799bfe04283bf27a1f606fbe2ce2130d",
        },
      },
      {
        weekNumber: 6,
        wdd: {
          amount: "4765",
          transactionHash:
            "0xc151bbb5abc8ec72001006e0d766840fdf67206afda8fe2602615c6738072ae6",
        },
        wld: {
          amount: "2.43",
          transactionHash:
            "0x5d068b77014c9aaaf6c71f8e8b4957a4780b2525a5e5f1392a08b0007b4337bb",
        },
      },
      {
        weekNumber: 7,
        wdd: {
          amount: "4654",
          transactionHash:
            "0xb911ac5ebc811f617435ee18ec72da2a6d2ec85ce62a217800ce38c77342aa03",
        },
        wld: {
          amount: "3.27",
          transactionHash:
            "0x0f6c49d08b8fb5ae647c8454e34c313126acb3b5dd2eabf3a0f930f1031d004a",
        },
      },
    ],
  },
  {
    id: 979,
    name: "ALL TOKENS INTERNATIONAL Wld, Wdd, Cash, Puf, Dna, 0rb, ALL🤑 All for one and one for all",
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
          transactionHash:
            "0xd5a0a99e1abd1c2cf75d6392fa1c2a115d8d10c8b81b954274a206b6dc2778e7",
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
          transactionHash:
            "0xb216edea2e22a0eae2ec2784cd51adf064530084408b2afb7744be96bb6ce88f",
        },
      },
      {
        weekNumber: 3,
        wdd: {
          amount: "4542",
          transactionHash:
            "0xe74e176b0e8983663dbde635db6f7f46ffc6b09539559c0ac18cdd17ee4491a6",
        },
        wld: {
          amount: "3.17",
          transactionHash:
            "0xc1dd156c3430127e35ae82ebab0c2ffc66ad975a2cc7926bcc9bb7c1502164e3",
        },
      },
      {
        weekNumber: 4,
        wdd: {
          amount: "4388",
          transactionHash:
            "0x5977bc95ca21541ba311cdf7adbc79702f9bd207e9ce5becb49f14a408fc45c7",
        },
        wld: {
          amount: "2.61",
          transactionHash:
            "0x63f045d13ea5ee5b80f1214ab0f9cefa5cfba0a3357853fb90eb7087efe63a75",
        },
      },
      {
        weekNumber: 5,
        wdd: {
          amount: "4396",
          transactionHash:
            "0xd87d379ef327f636e8ad5269b9e7565c712c0710c66a3c63eea9090662407e30",
        },
        wld: {
          amount: "2.24",
          transactionHash:
            "0x503b2f056e0715bff7528d1f5b5a282f571bf76c680d250e0c28f2202b23c778",
        },
      },
      {
        weekNumber: 6,
        wdd: {
          amount: "4706",
          transactionHash:
            "0x098f22247f459dd1e42f0695578a807cf1934b85bbdc0a4733b13caa17c7a2a8",
        },
        wld: {
          amount: "2.40",
          transactionHash:
            "0xdd63ef5991aed1205c7527208630233185527c320f98f219b233ba637fc91e5f",
        },
      },
      {
        weekNumber: 7,
        wdd: {
          amount: "4754",
          transactionHash:
            "0x4985ef394532017e60ddf376fe15f96b2cf20397171408e3c0deb2e7b2b81b78",
        },
        wld: {
          amount: "3.34",
          transactionHash:
            "0xf226000bfdd44bf4824fe575a052fb46d797ddabccf1b30cb5fc8f5c85226f08",
        },
      },
    ],
  },
  {
    id: 1090,
    name: "REPUBLIK WORLD INDONESIA",
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
          transactionHash:
            "0x427e32b96634135bf1624c8fd73cb7357e0bca9f74c16bf0bdddc53b51cb373d",
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
          transactionHash:
            "0xf79ef572978b7b7da9beb02c9befd14ebfdadecf1ff2690e4eb753b41836c1e6",
        },
      },
      {
        weekNumber: 3,
        wdd: {
          amount: "4219",
          transactionHash:
            "0xd34828260a2d6b73731e01d0adecb1f22ead1d8a895c3407d7098319cbdee170",
        },
        wld: {
          amount: "2.95",
          transactionHash:
            "0xe2d47f0f43a083f36bffc526c2766694068423e4d82385ce05d15faf27a4e5df",
        },
      },
      {
        weekNumber: 4,
        wdd: {
          amount: "3969",
          transactionHash:
            "0x1ef80c0e34486cf71a5d67300bbe1f20e2a7714ea2a12b1d349ae9f5b673ab51",
        },
        wld: {
          amount: "2.36",
          transactionHash:
            "0x6a66a86b6216b775ffa7ad30c37b29b055c497d3dd88fab05e690c5d7d9438af",
        },
      },
      {
        weekNumber: 5,
        wdd: {
          amount: "3817",
          transactionHash:
            "0x5ad15f44a2c38546d1753b02bc70e21af6bf09708e60cb369a6fc7bd6e8e7de9",
        },
        wld: {
          amount: "1.95",
          transactionHash:
            "0xe9d9a810ddbda8880f60133b4b1320d405163abeab2d325e77102f1677756b41",
        },
      },
      {
        weekNumber: 6,
        wdd: {
          amount: "3699",
          transactionHash:
            "0x8b1280359b0ab883bcaf2a9defcd170497a1b4715bd872c8f4ea136d24ec72ba",
        },
        wld: {
          amount: "1.88",
          transactionHash:
            "0xfd37ffe58a59a6a946e6439f3d035ca42ba0cc50801c7f4daaa16a87ee6220f4",
        },
      },
      {
        weekNumber: 7,
        wdd: {
          amount: "3605",
          transactionHash:
            "0x0187a646281d91696567e7715110a8fba731dee95d8cb90d4e4e539ea7a4285f",
        },
        wld: {
          amount: "2.53",
          transactionHash:
            "0x795df051b6a87eb02c0cebd0caecb1016c0fce658f64d0f18914422e8734672f",
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
          transactionHash:
            "0x7dc3692896e08980173f3324959d4c5a2ea7647ad87e78616c28201aa5a2d320",
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
          transactionHash:
            "0x5e9a7f98512f6cfd4e03f1b00ca584078e9d3686acaa77bb6821707fbe9a3b99",
        },
      },
      {
        weekNumber: 3,
        wdd: {
          amount: "4226",
          transactionHash:
            "0x8f263679aecbf07d3c3774ddd3de3403da0c6867b17483045074ccea6128d154",
        },
        wld: {
          amount: "2.95",
          transactionHash:
            "0x1d11cf2a6ab18b12a2c23d2030ac4414e018cb956e0f3473c33f1ecd1ebd1195",
        },
      },
      {
        weekNumber: 4,
        wdd: {
          amount: "4013",
          transactionHash:
            "0x4f707e426e79e13bc96408650a3ea79f0901ca5718e8261a30eefdaf61746b51",
        },
        wld: {
          amount: "2.39",
          transactionHash:
            "0x02aa0f929a8794bc0845580e6424d48995a9f0ab6e66fb91a171d60b8f0d740e",
        },
      },
      {
        weekNumber: 5,
        wdd: {
          amount: "3823",
          transactionHash:
            "0xdec27efeb186052c33b4e69638afc5d24f87561743f149812a4ffbb16a4f4595",
        },
        wld: {
          amount: "1.95",
          transactionHash:
            "0xae6d12c7e60aa62aeb5c7d3426cf10ebe1b978e23346c51ca119cc702358c95d",
        },
      },
      {
        weekNumber: 6,
        wdd: {
          amount: "3725",
          transactionHash:
            "0xbc8a9258165726f91d8616a7a5124f2e62c727a5d3c80e56d80dfdb26e95f646",
        },
        wld: {
          amount: "1.90",
          transactionHash:
            "0xbcd655a453ce7620dd08ea0b8da74121b77f7a0de23721f1cd94679705a660f3",
        },
      },
      {
        weekNumber: 7,
        wdd: {
          amount: "3639",
          transactionHash:
            "0x3b6a2e138ff0977d893813e86ba8e5c75405dbb4a6fb078e2543ff1c32707c0f",
        },
        wld: {
          amount: "2.55",
          transactionHash:
            "0x51095c8f7f23e0fda12d3a2f625ee3bc562346f2c7be4037b6753b3a843be650",
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
          transactionHash:
            "0x5f0f7e206f1835e93532df62c00d28b59e2603717cef6269ab0a0c9a79298956",
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
          transactionHash:
            "0x1673c351cfdaad5d2291cbf57bf26a38e4fb1132d4e2d2ea9f90867a90cf6f04",
        },
      },
      {
        weekNumber: 3,
        wdd: {
          amount: "4192",
          transactionHash:
            "0x785e9c99d8a8bb8fad596495619b3a9f6c4072424b1f908d3975816d46ea44b9",
        },
        wld: {
          amount: "2.93",
          transactionHash:
            "0xdb0c34e43974ad3d0d6f6396db3160e4588b1d7a91ef192b9611c932e8c463e1",
        },
      },
      {
        weekNumber: 4,
        wdd: {
          amount: "4038",
          transactionHash:
            "0x00ee77f367e42a9b073289c18b82f03fe93ed4495010e462fa3f0ce5c359d67a",
        },
        wld: {
          amount: "2.40",
          transactionHash:
            "0x5ee039650dfb86c1f83670515d9542ed236be827b60f999de6c25876ccfe50d3",
        },
      },
      {
        weekNumber: 5,
        wdd: {
          amount: "3863",
          transactionHash:
            "0x395eba90b076cc27556dcdd82e87d200c304d3d253506a8390704edda991e6a9",
        },
        wld: {
          amount: "1.97",
          transactionHash:
            "0xc0ba01d979ee48458e761fbbd68c0baab588ed23c39b8b4cf3b23d5aa6ba648f",
        },
      },
      {
        weekNumber: 6,
        wdd: {
          amount: "3731",
          transactionHash:
            "0x6bbeba7125c430b19aab12e0674489f85d7c2500049977dacce7f690adac70b1",
        },
        wld: {
          amount: "1.90",
          transactionHash:
            "0x8d922755f5a7b886fa43c1c7d8e41b758d9fafa0b3313071f7b5927911fb1c4c",
        },
      },
      {
        weekNumber: 7,
        wdd: {
          amount: "3615",
          transactionHash:
            "0xc3327d8631d396165e417c0c459a7a12527ce7e2ddbaa00f8a26ec0ec0d684e0",
        },
        wld: {
          amount: "2.54",
          transactionHash:
            "0x143dfd8f3907830475fba12f061741424bd1afee30a455ebb271fd06ae35dfc5",
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
          transactionHash:
            "0xfc3d2da6196ec4fd29869b8775ed5331068204b5ca73dbe93c893f56f90c1f00",
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
          transactionHash:
            "0x9a90df01d8b0ea22618ae30ced6e61513d1fb906116cdd29db3fd061998efe32",
        },
      },
      {
        weekNumber: 3,
        wdd: {
          amount: "4109",
          transactionHash:
            "0xd01a7be3aefe2b248c013788adb33d22aff791bfb73f87d3090ad001b7f19c46",
        },
        wld: {
          amount: "2.87",
          transactionHash:
            "0x7c56ded603be04cfc51b38eec7cbedff162591f3c13b627c99610f388b7fe2be",
        },
      },
      {
        weekNumber: 4,
        wdd: {
          amount: "3944",
          transactionHash:
            "0xad6284bd4c78fcb198c36ee023292f96c1583c2ac5acd468a7aaeebd28afbb5e",
        },
        wld: {
          amount: "2.35",
          transactionHash:
            "0xcbcc0a250aaec3421a2d9049c1f3de5053c08026a7e3858738ab73986adb28eb",
        },
      },
      {
        weekNumber: 5,
        wdd: {
          amount: "3772",
          transactionHash:
            "0x7dfa261c0ca63ff6b785996099ff15a12c2614fce7d1c6eb8caf4b79570e450a",
        },
        wld: {
          amount: "1.93",
          transactionHash:
            "0x288c3ab4069c7fedc7d8b48314d68dedf2de87b690f928844781727de50e5f20",
        },
      },
      {
        weekNumber: 6,
        wdd: {
          amount: "3693",
          transactionHash:
            "0xdae2908b3e4007fcee1c245ec2731f32096a2840d800a937527a3f70532762fc",
        },
        wld: {
          amount: "1.88",
          transactionHash:
            "0x854def1dd2cb1b4e24690a653bec28ac9ea8bb8c7895c886720aacb2beb2be85",
        },
      },
      {
        weekNumber: 7,
        wdd: {
          amount: "3605",
          transactionHash:
            "0x8b8d262a683fe4dbece501ee7a63fdae91f281ae4c53170d314626991555e081",
        },
        wld: {
          amount: "2.53",
          transactionHash:
            "0xd0f4eac5d7746f290ce3723cfa4a1735b7e88a240361adf7ae29e4b7f7e77720",
        },
      },
    ],
  },
  {
    id: 2805,
    name: "FREE WORLD/WDD",
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
          transactionHash:
            "0xf984884a453819ca9bde858ef1972b531119807fa205b6616c5af58cce9a524a",
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
          transactionHash:
            "0xe63001dbe72f76cd02f0b987bc3aefd33ebd4c5b174566ca2bb77e7386744330",
        },
      },
      {
        weekNumber: 3,
        wdd: {
          amount: "3930",
          transactionHash:
            "0x2dad03dcc3e6dd828c1191928a30d53825250d37fc06b86f20e58489bd01c007",
        },
        wld: {
          amount: "2.74",
          transactionHash:
            "0xb0752c2829f1ef88be42d5914fac93f86e526c6da637a13822ad4b5012a7073e",
        },
      },
      {
        weekNumber: 4,
        wdd: {
          amount: "3725",
          transactionHash:
            "0xe8a83bc9556fe9732809d42bfd84cd91fcce0ecaa3b8057a113cf04727290e60",
        },
        wld: {
          amount: "2.22",
          transactionHash:
            "0x49fe6d0233b7d0e0409dcf349b2b1de7a750e352c08dea6ee1c16ec9faf94479",
        },
      },
      {
        weekNumber: 5,
        wdd: {
          amount: "3590",
          transactionHash:
            "0x1306a06075d9ac4ca3129c27978e12f7def8f1e8265288596cf96524ae770777",
        },
        wld: {
          amount: "1.83",
          transactionHash:
            "0x0b03ef07b18fa5d1bdefd5b304eb7291e589efbec7dacb7861b0905e90cfb15d",
        },
      },
      {
        weekNumber: 6,
        wdd: {
          amount: "3492",
          transactionHash:
            "0xa8f35129473918f4459f0f1dbf2fa9e16ea280bf19ec69b2a38b8b7d6e103fcd",
        },
        wld: {
          amount: "1.78",
          transactionHash:
            "0xdda90eb95ea0fe353e10693b8d8b5602663b75f2c0e355760dfbf6010cc140de",
        },
      },
      {
        weekNumber: 7,
        wdd: {
          amount: "3425",
          transactionHash:
            "0xc7d75f77710da95a130a842b4db2fe0c46ec89b9f207f2a3ce44604ca4a40705",
        },
        wld: {
          amount: "2.40",
          transactionHash:
            "0xaf55c35e5d4a395b7657afc90a8e9cf90191cfe14eda1d0dd9f4d9a83353f98b",
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
          transactionHash:
            "0xc4a2e8f8762ff3f474071c172121c021ce71eb69d244b90ede1256ac5eec344a",
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
          transactionHash:
            "0x6ee86ff68abff2ada3a92a9460e466a191d9d50764fb2b02b98b282756388f6a",
        },
      },
      {
        weekNumber: 3,
        wdd: {
          amount: "3690",
          transactionHash:
            "0xad48583543b15a1595335257f933eda778e136bfba1b86f5bd77d2d651f89ca4",
        },
        wld: {
          amount: "2.58",
          transactionHash:
            "0xddb0cf20a28a5bf93fbcf4ba0025bbc59a223e132c003d2083862faa939e0402",
        },
      },
      {
        weekNumber: 4,
        wdd: {
          amount: "3538",
          transactionHash:
            "0x8f51ef2abde0238e86a95eb5fca7c4a85cb7191b4c9845b1066ede6f948ac3c6",
        },
        wld: {
          amount: "2.11",
          transactionHash:
            "0x8a2d8694ad1c154ec94e04c6cd95c80f5a4070b7896665686a6f9e18de456cb6",
        },
      },
      {
        weekNumber: 5,
        wdd: {
          amount: "3420",
          transactionHash:
            "0xf12b7f623a2b7b20878e98abe42a60947b2010d732f590233427bc9084879f67",
        },
        wld: {
          amount: "1.75",
          transactionHash:
            "0xa832abdd7bb4b2c500f48baad7340ace7be267ffb8c6fe956fd770a314a8fef4",
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
          transactionHash:
            "0xf824c8b9882a61481bca70101088b78c19c26584b17bf23444e8e3f4e490e0cc",
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
          transactionHash:
            "0xbe0bd83e052c32658f6ebef8da95b3ae743fe48a502fd580fac8444c710ac0e0",
        },
      },
      {
        weekNumber: 3,
        wdd: {
          amount: "3683",
          transactionHash:
            "0x72acd613c1035ca643e6900861e57c48f7ebdc242ec7a026c6c44b5e652dd1f0",
        },
        wld: {
          amount: "2.57",
          transactionHash:
            "0x60d796a77cb46cba891295979a99e82f8727ed90b650538201b0b0a73a325937",
        },
      },
      {
        weekNumber: 4,
        wdd: {
          amount: "3500",
          transactionHash:
            "0x2dbe81440f75e0de3231647b6ae8edc3ea7dba9518c9ed90000c5f9b72c0bc2a",
        },
        wld: {
          amount: "2.08",
          transactionHash:
            "0x1656cb17842bc40df288b1ee3f08c9dd0c42a38e479f845a00659f51d5c1af69",
        },
      },
      {
        weekNumber: 5,
        wdd: {
          amount: "3397",
          transactionHash:
            "0x0cbe09789000b52fc7d43665e9d15973f6286217562e7eb577ab22c9a36e704c",
        },
        wld: {
          amount: "1.73",
          transactionHash:
            "0x6910663953d1fcbfc8b85006c88051854fdf6a94281592574f94577bffd1a02e",
        },
      },
    ],
  },
  {
    id: 2546,
    name: "OFFICIAL $SAMA PARTY",
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
          transactionHash:
            "0xc5857009be803f4c223ff1b7286bc596e903b21fde3ec8f8c6eb7171243b7b93",
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
          transactionHash:
            "0x5830f3e8e084906ecf2722ee977fc99b203210305efa30d534d78f7984eda2ad",
        },
      },
      {
        weekNumber: 3,
        wdd: {
          amount: "3745",
          transactionHash:
            "0x38255ccee8337b72f31e56af1447d0768682737bbc2d675694a60a15aa038ba2",
        },
        wld: {
          amount: "2.62",
          transactionHash:
            "0xe979e4010bd403273bc7c14c984071bb83bae5dba958873d8ddc2b589fd2223f",
        },
      },
      {
        weekNumber: 4,
        wdd: {
          amount: "3563",
          transactionHash:
            "0xc134295c01f1cc6e8f67fc84fda4427abb6682f976d03082db79def1d3c6944e",
        },
        wld: {
          amount: "2.12",
          transactionHash:
            "0x73c4a6aa963bbbabec8909904edc9c7dcd172974b21fffdcbd3149b727978618",
        },
      },
      {
        weekNumber: 5,
        wdd: {
          amount: "3426",
          transactionHash:
            "0x1cd0d94e664c8747f367e30e524f0c7aafddcb83d3dc81dcde425cb5dd47cddf",
        },
        wld: {
          amount: "1.75",
          transactionHash:
            "0x5e9fa0d2a1f94141132fe510ffad7812af2828c60226a0870de6db5fdc77a561",
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
          transactionHash:
            "0x5d139e9f92bde039e89b6e4a822f52332c870bd730f693bbfde1ae5e700c677f",
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
          transactionHash:
            "0xa9ee201884e2b63f815fd219b7de290f48214a399cea8731aeb5b3c5649ee0ce",
        },
      },
      {
        weekNumber: 3,
        wdd: {
          amount: "3641",
          transactionHash:
            "0x34f0265c24d967e9338b7a5ebf1ed118cd27a938ad86607c8c648efdd087fdd4",
        },
        wld: {
          amount: "2.54",
          transactionHash:
            "0x2101a556273d4206df2c4cd553e6eb962750c6caeef0bac0674d245b350beef8",
        },
      },
      {
        weekNumber: 4,
        wdd: {
          amount: "3494",
          transactionHash:
            "0x4d713854d992f060f2f305f6e8feb0a85efc25c64e52a0968eac031c14d376f0",
        },
        wld: {
          amount: "2.08",
          transactionHash:
            "0x40ec758c6db532ff0e6f64277c097f7496493242b13e42d8ff0001e8bb6db82a",
        },
      },
      {
        weekNumber: 5,
        wdd: {
          amount: "3380",
          transactionHash:
            "0xdf30a00439263c71debe200198ca7593017096fe558ee2358651d2c93837c821",
        },
        wld: {
          amount: "1.73",
          transactionHash:
            "0x57cc4fd855f65a64f69ed1260775dea333593ad02629b1438e3940dade888cdf",
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
          transactionHash:
            "0x3106236e83012ad28507f5839c0acd585e427557ef1dab01a89f6a52ef5ace5b",
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
          transactionHash:
            "0xdf32393f74f128e6c8e9a1eded7cf33e1ff553ef8aac4ef11b06a8468b169050",
        },
      },
      {
        weekNumber: 3,
        wdd: {
          amount: "3600",
          transactionHash:
            "0x9002411e7fdb6dfb6c1063884cf82d9d2dfba5269d7c6077bedb80c4657dcd63",
        },
        wld: {
          amount: "2.51",
          transactionHash:
            "0x40a03562e0cd430af97210918349b2af6016fe7241b18afb9150293817206179",
        },
      },
      {
        weekNumber: 4,
        wdd: {
          amount: "3463",
          transactionHash:
            "0xc2da860f5196ab2804e9834f28a4d56306e3a9155d4484c29a089e83e7f1c4e7",
        },
        wld: {
          amount: "2.06",
          transactionHash:
            "0x5843d04aef365e06e348df09c68199888ed98e9769999df180ef23c592793f1c",
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
          transactionHash:
            "0x61d99a77ca0ac344091f725eb0c7a3b39d20bed131fb821cd054db1721062674",
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
          transactionHash:
            "0x8e4eb041c838f9ee61fc40602e8972df9ec861f0783468149a0d63b804ada597",
        },
      },
      {
        weekNumber: 3,
        wdd: {
          amount: "3573",
          transactionHash:
            "0xa281e3fac77bf4dd08d8a51a9a8f32623bab5f64c39d4ab4a43724ac269edc8e",
        },
        wld: {
          amount: "2.50",
          transactionHash:
            "0x74a520584dce017d8f1f342533ff7793ab4670ad138328d538b6f12a43360c0d",
        },
      },
      {
        weekNumber: 4,
        wdd: {
          amount: "3438",
          transactionHash:
            "0xf428ab90343d54e96d74bcdd63321f85e2d244223237981904d27718f9776433",
        },
        wld: {
          amount: "2.05",
          transactionHash:
            "0x3ffb248d108987ff03824edaa9c7c2909f2f8dd9e1a05f7fa2077fa96bc51466",
        },
      },
    ],
  },
  {
    id: 1479,
    name: "Semua Dapat Duit",
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
          transactionHash:
            "0xae3bfe317adbaf6fca5ad55efc2bd1331bff979d4f135b5eddcafe63023e4ade",
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
          transactionHash:
            "0xe0ddb52d1775ef670ffee1a431ce109b09fb9528a8f0f062ab1503740f668269",
        },
      },
      {
        weekNumber: 3,
        wdd: {
          amount: "3607",
          transactionHash:
            "0x501441a10d32b1e76bb4c77ec8403f122ca5197355783ff49cd03b027296c003",
        },
        wld: {
          amount: "2.52",
          transactionHash:
            "0x4c8c065b00e236f29ac6f0cd4f9e363df18436d25579a320b85ad92ea805464e",
        },
      },
      {
        weekNumber: 4,
        wdd: {
          amount: "3488",
          transactionHash:
            "0xcf146f68281468580fc2639750a6f78654f2ed721a6fdf10cb600974398ba3f6",
        },
        wld: {
          amount: "2.08",
          transactionHash:
            "0x347615c8dda763707a4cef3648625f24c6e5461f8983b6074a08a8ea17456fde",
        },
      },
      {
        weekNumber: 5,
        wdd: {
          amount: "1682",
          transactionHash:
            "0xe56eb49b29a47345005f627d393f85d89f10d3381ea9152e1781e30c6e53c5ce",
        },
        wld: {
          amount: "0.86",
          transactionHash:
            "0x8904d494986bc7b09669b9b60945a866ce33e663e4411a722266e922ea785925",
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
          transactionHash:
            "0xdfedf2ea12164e4689ca392dd094e05238f6aae5941b1a8118e0194dbaebae80",
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
          transactionHash:
            "0x7c73f575824ee829ce5eaed06b072b839fd73adbc46e8b29f0c59f2a1eb2d990",
        },
      },
      {
        weekNumber: 3,
        wdd: {
          amount: "3580",
          transactionHash:
            "0x69a2be746ba1d88f1e39610dd37eccaf737d22804e1f99ae23770a2315e22953",
        },
        wld: {
          amount: "2.50",
          transactionHash:
            "0xaf41fe24560a6955a26825c099b614797c48bb2ef0b9df709b58c332fd2bdd5a",
        },
      },
      {
        weekNumber: 4,
        wdd: {
          amount: "3450",
          transactionHash:
            "0xe52f80f0572b54165075cceda1524f057da533f250df5443b71cbd4dbbc6873d",
        },
        wld: {
          amount: "2.05",
          transactionHash:
            "0xdadc9b38773e6129b232b2f42f43766405bf9d87202d8831a206b23a415ab07d",
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
          transactionHash:
            "0xed87c6b6f6d61b4bc91be0ddd69597cd9983ee46c9c459f22b3427312a84cbd5",
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
          transactionHash:
            "0xb99475e9c65978bd1165aa24d47eb4599ff7df19a46f1eb8a2ddb5724499367a",
        },
      },
      {
        weekNumber: 3,
        wdd: {
          amount: "3552",
          transactionHash:
            "0x388c022c4c33e33588cca2219fe527cb808f6f27d06b65fee7b1a7b0781130ef",
        },
        wld: {
          amount: "2.48",
          transactionHash:
            "0x4c56112adf05ad4baa9db9f77819eddb6f15786d15451940da9cc8332395cd3e",
        },
      },
      {
        weekNumber: 4,
        wdd: {
          amount: "3419",
          transactionHash:
            "0x7e2c40c20cb12d2316aee1d0ba3242ecff4d23d3953c08a7cfb40b345cc1c418",
        },
        wld: {
          amount: "2.04",
          transactionHash:
            "0x0428c6005e3a8a6f3880537e48632f2c6f101a84bf9676357b1e401a41c85155",
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
          transactionHash:
            "0x9862e8e78b85ea5ef289522e9b4d5b4424cac21e400dc81a61a3e48753fde085",
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
          transactionHash:
            "0x584eee9f277bbf6d532c009d34dcc0c1a8636e34e7d3284aa1e395b8f3cdba44",
        },
      },
      {
        weekNumber: 3,
        wdd: {
          amount: "3428",
          transactionHash:
            "0x058295b281bec1440c0028b21b7dec18beadee6c9c9be7c6eb3499ff73fddb77",
        },
        wld: {
          amount: "2.39",
          transactionHash:
            "0x9728822d8006309c5a014c037d6f6976aa384df9b60ac6f1250dac69b276cd3d",
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
          transactionHash:
            "0x45240a09017caaa5033973f63bd78d77f3d7e480a1f8618a2a607a66f05027ba",
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
          transactionHash:
            "0x351a4ba2b61b5518506da0a895d20c99e9add3fb4298449518edacace30a5444",
        },
      },
      {
        weekNumber: 3,
        wdd: {
          amount: "3428",
          transactionHash:
            "0x490636a8a0ec4e597cf0e9b276215c3eb81923aac0e4407570ab28a058683cb2",
        },
        wld: {
          amount: "2.39",
          transactionHash:
            "0x319592564b97627248d51e766788e97a33b35635dea51fb7a5c47c5f3e904757",
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
          transactionHash:
            "0x0493fdddab61c4610ddb15ebd825437a218ea8095b3663c792cb897b8dc048ad",
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
          transactionHash:
            "0xfd00c59056ffc56cf964cff07d2e3283d8c054ebf833c4d8ca980d38481731be",
        },
      },
      {
        weekNumber: 3,
        wdd: {
          amount: "3346",
          transactionHash:
            "0x04c65aeb74e688f1243cfa33599726e6f41fb57124a859d09e0bc04e0c9f937f",
        },
        wld: {
          amount: "2.34",
          transactionHash:
            "0x57f14be883e5d33e7459432bb37a89f4963aeb8e6af1d73f744e09fa2267bd0f",
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
          transactionHash:
            "0x00ba9348baac35137f81fb8a90bedebc0017bf83f567e11ee3301fa3524ff422",
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
          transactionHash:
            "0x7c8c7933bd347af8b700255c11d31ab3d66ece12a2d56fc666124626976d62cd",
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
          transactionHash:
            "0x6428f790ed06e7e97a3693375c80f89e21b58197348ab66c628788e5fd05934a",
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
          transactionHash:
            "0xba9249924fd9fb3adce2290a4cd6dddfc133ca1cf3c70a56ac950ad81cb63af9",
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
          transactionHash:
            "0x48607efe14f86dbfd20f8191d1439b6e2b7a1ed0679e105a0af802ee60a8da26",
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
          transactionHash:
            "0x0a6db4bbc94fb336c5e2e2458fe0bc92f39e1a7ab630344a008ec96989bffa77",
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
          transactionHash:
            "0xf949facfce57e0f5e55ba969bafb6be3d6ff82dd4a5c8d3fec5b5ded88fc44e1",
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
          transactionHash:
            "0xbca3f593c8fe81dea0c3589d71bf9698dac04c62517160b7845b1a8fff12f144",
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
          transactionHash:
            "0xdb8c95a7b061de1101e8d0ecbf2dfd3aa477310d7470624f5353740abbd6fbae",
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
          transactionHash:
            "0x566cb7107ea20d48939d9982641aa26ae33611b359383692ccf0410f844abd87",
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
          transactionHash:
            "0xc18c5f8235600ccca5fb6b4a373e0958085252f68747d0fff18d2277095c0b98",
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
          transactionHash:
            "0x6d765b82a116fdb079988fbd7733aaafcd833431427708f8b00ee37ec16e477b",
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
          transactionHash:
            "0x8473f12c01afb6babfd6fb08da038fe263d6e162b0668d4a699d0407ef2f93cd",
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
          transactionHash:
            "0x6cbf39a35a22749eb5e5d9d2dffc289ca643601bedfa9ee5d33a354399db64cb",
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
          transactionHash:
            "0x020fcf93a90b9967159cf18071a7f929ca41f49350386a6c8dca94f0a766d407",
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
          transactionHash:
            "0xe059ddff267824a8c20472e76b70398bf4d6c7e4047673eb618384ae895d3522",
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
          transactionHash:
            "0x5ff0126d83caf7601a186d978f6c2567575987f38920d22b85fa56595e6332d9",
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
          transactionHash:
            "0xc4299a4a78a03c13913319c15a9dc6cde8ed2856bc3443cbbff9e5258891cae5",
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
          transactionHash:
            "0x9ef116cf68e9d0055cff22e5215b65bd8f1276e8ab9422ac339754952ca647fb",
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
          transactionHash:
            "0xb0507715c9c1545deee83e8c4eda02891ef824f20a2543402127fcfdeb16d490",
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
          transactionHash:
            "0xb3307e8926a9bb63b5c33d299b5223e76cab1f6bff78014555b864590f092ba6",
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
          transactionHash:
            "0x15ca963041f14cfa99e3de1cfac2427fe711f285e94004a2eba4e59a567aefd7",
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
          transactionHash:
            "0xd3d05a5042739dd9f1b6906e78db57d7c095653209f4c021b3732118f8ee157d",
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
          transactionHash:
            "0xd1bfe50eb507e6ef3c8a2bab37a1d8a132015cd1e00b443cbb7d54eb78f51f25",
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
          transactionHash:
            "0xf9e9086d39bbd4883cdbe506160a9371ca3f34fbc382b91c943963fe71b14e2a",
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
          transactionHash:
            "0xf92ac245a616deff047bddc1a78e4aa1f40efa9f9a4a94d3bf982d2044eb145c",
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
          transactionHash:
            "0x1b466ebaad67ec49faa545f154c2403608f3f4eeed3ed37bf4d64b9c0afeb452",
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
          transactionHash:
            "0x4af204ff80d41f8fa6e7f931313d7799f0c9e4ee1efb93d2bf04bd5e9bfaca95",
        },
      },
    ],
  },
  {
    id: 6188,
    name: "FREE WLD DAN WDD 🪙",
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
          transactionHash:
            "0x393f273586319f296bd602757fb239fe1495f4415fcd2f5c42b564ff74e7eb5c",
        },
      },
      {
        weekNumber: 4,
        wdd: {
          amount: "3806",
          transactionHash:
            "0xec199d84d1fe34285376eba3bde920671c4bab15aac0d086d016fbcc28849b2c",
        },
        wld: {
          amount: "2.27",
          transactionHash:
            "0x4eeb13504a2581e9b2c6b45578e57dd77ced38affb17e4e48df7a3414dd0ce35",
        },
      },
      {
        weekNumber: 5,
        wdd: {
          amount: "3602",
          transactionHash:
            "0xb7f6a7a70f8673df5a5f70cbf2138f7bdd4f91a785f6b896966d70bb8d9a2d17",
        },
        wld: {
          amount: "1.84",
          transactionHash:
            "0xcfb6a94887d714749c2ee5bc54437d696a131591a4c586b16aa925b8849c2378",
        },
      },
      {
        weekNumber: 6,
        wdd: {
          amount: "3460",
          transactionHash:
            "0x17efb25aa1380cb3a8b74b1baa3379d3123094774c67711fbfa00ded77d872a0",
        },
        wld: {
          amount: "1.76",
          transactionHash:
            "0xa672a9f939d1d9876e28dbee4b48176e4ebc7f460fc9a9fba2ded48076a92a4d",
        },
      },
      {
        weekNumber: 7,
        wdd: {
          amount: "3376",
          transactionHash:
            "0x02a9f51a80d38a028e16639f3994878a6d2016fd14075152953f0afc57c8a562",
        },
        wld: {
          amount: "2.37",
          transactionHash:
            "0xeec15430fc7f07e478518a0b4123f886086cde614a077c0c271ac5728fcec74b",
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
          transactionHash:
            "0xb38f4787ae124803efede79e175b282f1423ac4ab61a3456194a4966f007c9e7",
        },
      },
      {
        weekNumber: 6,
        wdd: {
          amount: "3465",
          transactionHash:
            "0x2b4ae4b6c7b4dc6337497605d3f0047466102ce26e851f454ed305d5f4752a3f",
        },
        wld: {
          amount: "1.77",
          transactionHash:
            "0xe464efca94e46129ad7cc844c8c43b3034f6f9ee18c487118ef2f3cb5ee187fe",
        },
      },
      {
        weekNumber: 7,
        wdd: {
          amount: "3490",
          transactionHash:
            "0xb0aa383cedf8672274de79743fe8457f8f9f6b114ba855ceaf48387b77284bd7",
        },
        wld: {
          amount: "2.45",
          transactionHash:
            "0x3cbc79979f260bb036ed58e6532284576b2c68888e88587ee280a43a817ec30a",
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
          transactionHash:
            "0x04ec5a06eb9e14872b2c2b144fb0763d24134490bb0cd73da2a84413bf3bd469",
        },
      },
    ],
  },
  {
    id: 3979,
    name: "EggsVault Party",
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
        weekNumber: 2,
        wdd: {
          amount: "2967",
          transactionHash:
            "0x8a4693653e0235678392dfc0ce84364662f5249bd6d3c70e91b2004bb532703a",
        },
        wld: {
          amount: "8.44",
          transactionHash:
            "0x2b7a7eaefd10e75190612c8cca86e53f537ee14118bd7e40b7dee86a607cc755",
        },
      },
      {
        weekNumber: 3,
        wdd: {
          amount: "7224",
          transactionHash:
            "0xce3a5d957a084a3e1a63d117e1f697b256ab5f2067064b6c16961a1f71e4ab55",
        },
        wld: {
          amount: "5.05",
          transactionHash:
            "0xbe21ade375b0a0c020b4e9ea357b33c0e334ad88488074662983bc8ed36000bf",
        },
      },
      {
        weekNumber: 4,
        wdd: {
          amount: "6582",
          transactionHash:
            "0x9a59b62ba32fdc4561bbde251da5790527863fb21771ccdb95f246f071e57348",
        },
        wld: {
          amount: "3.92",
          transactionHash:
            "0x8ce376da0e7168a855c8de75e271fdebed1fc3c56876ac619cd34cae3ee38c2e",
        },
      },
      {
        weekNumber: 5,
        wdd: {
          amount: "6020",
          transactionHash:
            "0x35ef3e0f29fb060ee8e5a33c7e110e99bd171c7739ddeacedf614471859c8e1f",
        },
        wld: {
          amount: "3.07",
          transactionHash:
            "0xa3fd13b52954a3406b09f24eb39a6c23f11c59adcce6da4363b0f4e8440d2cb7",
        },
      },
      {
        weekNumber: 6,
        wdd: {
          amount: "5656",
          transactionHash:
            "0xfb2961239837b42557fccf4467ce4f9cb835953d9f0b6cd7479871c6174b3aab",
        },
        wld: {
          amount: "2.88",
          transactionHash:
            "0xbcc36f33562023794d8b5abfa1654a46480024d57ccdf08e454285982a51956a",
        },
      },
      {
        weekNumber: 7,
        wdd: {
          amount: "5416",
          transactionHash:
            "0x2439ffe90c3aa7a7fa462b500bfee1b17dfee24b619e78f8cb0b832a931f7f6b",
        },
        wld: {
          amount: "3.80",
          transactionHash:
            "0x6a1f055f4a4f44e9b5e723d23a1c3d80a22495d1aeadcbd9b44572ad161e2ea2",
        },
      },
    ],
  },
  {
    id: 3149,
    name: "BORROW WORLD 10 COINS",
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
        weekNumber: 2,
        wdd: {
          amount: "2513",
          transactionHash:
            "0x093fb6e88c6b6a6b4975ae8ed380368ba4c218fdb113a6e1e2f091fa6cca0f01",
        },
        wld: {
          amount: "7.14",
          transactionHash:
            "0x55bbb7362badb7ae53f1a7eb304da233f22699c81af81f56ff6f6d399f9191e4",
        },
      },
      {
        weekNumber: 3,
        wdd: {
          amount: "6062",
          transactionHash:
            "0xbaff78f348e87bdf6a2ba4f41e4a0dbcedb55c4fd8cfe2728c312d33b0175917",
        },
        wld: {
          amount: "4.23",
          transactionHash:
            "0xe182ab247d9c012090d50bff8d020f3d8f925f71b13c44e8507b6dfe2a3fceb5",
        },
      },
      {
        weekNumber: 4,
        wdd: {
          amount: "5988",
          transactionHash:
            "0x3d3ee2d6be2093e332566e5154a21c2756f920ac58c024c7b50263c09f3646f5",
        },
        wld: {
          amount: "3.57",
          transactionHash:
            "0xf00628ff91519d4c2261df4f40b466eb79dba90e978c296f138cda6ba8c82205",
        },
      },
      {
        weekNumber: 5,
        wdd: {
          amount: "5668",
          transactionHash:
            "0x7bef9fb9f5c296fd98fd86950ce821576f52741074eab9dbc520933171809708",
        },
        wld: {
          amount: "2.89",
          transactionHash:
            "0xfe86817c3986aa9cc122332757e4d46368b561f69c1344821a3f469b8eaf0bdc",
        },
      },
      {
        weekNumber: 6,
        wdd: {
          amount: "5491",
          transactionHash:
            "0x50b277b76b3771d5fb8dd04d4ca9026e62f6d2a1208b1af8167a86c78416e0f3",
        },
        wld: {
          amount: "2.80",
          transactionHash:
            "0x7251e56bb4dbb8bb5ac0bd6d524be4a4bb38d00061869ea0053b3a81c95ce6ab",
        },
      },
      {
        weekNumber: 7,
        wdd: {
          amount: "5232",
          transactionHash:
            "0xdc197dc8cec4055fee0ff2a773fd4314f24083a96dfb33624ea9560b48430bdd",
        },
        wld: {
          amount: "3.67",
          transactionHash:
            "0xf5b54a3912b660fb3a81f0ab9439442529a8ba7a1288d39fba39b9520dae0fed",
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
        weekNumber: 2,
        wdd: {
          amount: "1782",
          transactionHash:
            "0x00b40e8e66eb362c1be143250b94a7114ae0abcf7d95588f770ea4608648289f",
        },
        wld: {
          amount: "5.07",
          transactionHash:
            "0xaf4d5960c7e6a450051deac511521f8a29bdc2a551e7a8ed936583ca2122b3e0",
        },
      },
      {
        weekNumber: 3,
        wdd: {
          amount: "5257",
          transactionHash:
            "0x21b1c366b3e314393ff6b34524a155d0ac67b3f298cbbaaa104d5367e27236db",
        },
        wld: {
          amount: "3.67",
          transactionHash:
            "0x980927d91189875f38abc5e097b2a6ae14ee95746b36401166faa9cfaa64a12c",
        },
      },
      {
        weekNumber: 4,
        wdd: {
          amount: "5219",
          transactionHash:
            "0x3340b3342a63e57a57e9f9fe5cdfeba8dfbca302589afb00358a663c021e08b7",
        },
        wld: {
          amount: "3.11",
          transactionHash:
            "0x9f4d999efd037dcc4acbb6e69491d254c8ba59a840a8fcaff8c910c515a73263",
        },
      },
      {
        weekNumber: 5,
        wdd: {
          amount: "5038",
          transactionHash:
            "0x116bf57a0ca4796130ebd8c0333d1e3e88c95823263c4898bfb72f9bfab7e4a2",
        },
        wld: {
          amount: "2.57",
          transactionHash:
            "0xb4163bd7db9abca71c90f5103b1e32aa7bd2b3d9c076141fd8698eef9eab07c7",
        },
      },
      {
        weekNumber: 6,
        wdd: {
          amount: "4871",
          transactionHash:
            "0x65a6ddadc1224208025b6ba3fad5bffcb07e559046998c78cc6a392c070ea35f",
        },
        wld: {
          amount: "2.48",
          transactionHash:
            "0x696f4dd06e34befdfd57b5df1f904674c421728e4085a8a4ef2d9310dfb724bf",
        },
      },
      {
        weekNumber: 7,
        wdd: {
          amount: "4729",
          transactionHash:
            "0x5a1d1cc13a998dee4d4c7b2c43c4b86a589ffc76e587bff132f8dc772292f20c",
        },
        wld: {
          amount: "3.32",
          transactionHash:
            "0xcc42688660700acb70a87d0a349c5181980fc3b8dc098f1bffb1a2dba3c0e4b2",
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
        weekNumber: 2,
        wdd: {
          amount: "1872",
          transactionHash:
            "0xa1edd97cec227212653e9421a866bf72db9b8f48e6f8f66eba8e0e78f0792c94",
        },
        wld: {
          amount: "5.32",
          transactionHash:
            "0x6e1705af494cb8fac3b3dc18d55cc2d311cd424f5cb3ff69b015fe570d5bc7d9",
        },
      },
      {
        weekNumber: 3,
        wdd: {
          amount: "5938",
          transactionHash:
            "0x4d3361ab9b00bacf1a43caa0c63916dbd2bd5731dfdfc69465a5bd769fa8b904",
        },
        wld: {
          amount: "4.15",
          transactionHash:
            "0xe47d5feccbf83e5e4b3e4c5060db7c7666173cf6a76975fa4c61a5fa6f530248",
        },
      },
      {
        weekNumber: 4,
        wdd: {
          amount: "5769",
          transactionHash:
            "0x4407250247a09a55a2682c20ab1cf3f4db9915cc5861515d2a9876e0bd11ae36",
        },
        wld: {
          amount: "3.44",
          transactionHash:
            "0xf4e22ae4f429d4a62dd003f17ec99bafc88d8149cd90c750ee2c227985d99957",
        },
      },
      {
        weekNumber: 5,
        wdd: {
          amount: "5776",
          transactionHash:
            "0x009916bca25ff3e01112f84b527daaa202f8067cb09d60753eb831487602ff09",
        },
        wld: {
          amount: "2.95",
          transactionHash:
            "0xe1d622e74630260b0238720180936b1cd8d1b52ce97cc999b76486bace222232",
        },
      },
      {
        weekNumber: 6,
        wdd: {
          amount: "5624",
          transactionHash:
            "0xa33109921fd55478cb4830cb824c909885c08e96c185e863f2207f63ed14d5dd",
        },
        wld: {
          amount: "2.87",
          transactionHash:
            "0x7ddb3bf6bc1183d5912958ec648b126e9159ff52f7701751c6a8b74046e8bdf0",
        },
      },
      {
        weekNumber: 7,
        wdd: {
          amount: "5465",
          transactionHash:
            "0xf9bfe9ec7fac820595182950b35566e5a5bc7cd1c1e821c2f30264239b908389",
        },
        wld: {
          amount: "3.84",
          transactionHash:
            "0x62d4b871e489a9662b5bd44cac2559bba7550aeae2e8d8cb16b0210fed5590c7",
        },
      },
    ],
  },
  {
    id: 3673,
    name: "Gratis 250.000 WLD",
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
        weekNumber: 2,
        wdd: {
          amount: "1632",
          transactionHash:
            "0x517a752efc5e0c1de4845d92b200478720b3f30aec38e4072ccb636d8917f7d6",
        },
        wld: {
          amount: "4.64",
          transactionHash:
            "0x5003c6cb21b4ac935b357246be1017323be331318f2ea45eaf07f1de461cbc1e",
        },
      },
      {
        weekNumber: 3,
        wdd: {
          amount: "3779",
          transactionHash:
            "0xcd9c7f86c22b52ea3c69ea04a6845a7995f1173dba3a5a0d25a54c45ebd62b3a",
        },
        wld: {
          amount: "2.64",
          transactionHash:
            "0xc582a89d4a674c186ebd35d53ebf15456c0cfb8da16b434c518174694626c5b5",
        },
      },
      {
        weekNumber: 4,
        wdd: {
          amount: "3600",
          transactionHash:
            "0xea48217bfcfbe0591bca12f4f51e3ec059561971279b2e84e22146ae152bf82a",
        },
        wld: {
          amount: "2.14",
          transactionHash:
            "0x9802b6e98edfbaf78e74de5158f8a6e3975c381a0c290eb7a5410dd2e04faf9f",
        },
      },
      {
        weekNumber: 5,
        wdd: {
          amount: "3477",
          transactionHash:
            "0xc5b4618e0a4e38a486ce3d576b90df98a31d8fefd8b47cf4249a8582878c17d8",
        },
        wld: {
          amount: "1.77",
          transactionHash:
            "0x5f094d3b326c439759e95583f67d75e4244aa0cd894ca9653fc206b5622c85af",
        },
      },
      {
        weekNumber: 6,
        wdd: {
          amount: "3391",
          transactionHash:
            "0xaf54c192f269f7b47abb107708f48e5f25a13b3e55a6df0a09466310bd863e69",
        },
        wld: {
          amount: "1.73",
          transactionHash:
            "0x6cb48bda1076f5d23f1272208479f7f286a4e35091f845ab87293a4ba1d6a7ea",
        },
      },
    ],
  },
  {
    id: 4109,
    name: "250.000 WDD gratis tiap Minggu, join sekarang!!!",
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
        weekNumber: 2,
        wdd: {
          amount: "1622",
          transactionHash:
            "0x24251de90cca135481816e23d73cb401c1d04166ce3b67a4de8b128888eda2e1",
        },
        wld: {
          amount: "4.61",
          transactionHash:
            "0x7570b8bd2afabf7d6f11d50234fd38331e6b0d11ef64af00ba26983363931a38",
        },
      },
      {
        weekNumber: 3,
        wdd: {
          amount: "3738",
          transactionHash:
            "0xdeb97c1b7ca1393248ca7857d5f2185267929165090fafb5ff2ef5b0b4da3039",
        },
        wld: {
          amount: "2.61",
          transactionHash:
            "0xdae7e5c7b69e6ce106e306571898c445285062ccc01242f8451e34dd914605db",
        },
      },
      {
        weekNumber: 4,
        wdd: {
          amount: "3575",
          transactionHash:
            "0xab865ffe155466834bd931c132eb3afb19e51d7f23eeca21858fc0b6b6ea838c",
        },
        wld: {
          amount: "2.13",
          transactionHash:
            "0x94794b0a94466c0c5b610383efce2eaf5543944591466349e22e99e939edb7da",
        },
      },
      {
        weekNumber: 5,
        wdd: {
          amount: "3420",
          transactionHash:
            "0xc3e28bd807536d5d1d6945ac06e37c2dddc0a9f9fcfd3a28c5203f2064ec9b79",
        },
        wld: {
          amount: "1.75",
          transactionHash:
            "0x641bd77e1b97d51750f1c2c3958a89dfa99ca4f387620a6027998b2c57bfee76",
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
        weekNumber: 2,
        wdd: {
          amount: "1613",
          transactionHash:
            "0x2b1e423dec95c6212f18d3c9c4fe8a0cb28a94025edc1a80ac800ec431d35314",
        },
        wld: {
          amount: "4.59",
          transactionHash:
            "0x92548a6ad795568bb6b0862ab0a74d1d58b06fc0c53f3c4cbde6e12df07d327c",
        },
      },
      {
        weekNumber: 3,
        wdd: {
          amount: "3779",
          transactionHash:
            "0xcd9c7f86c22b52ea3c69ea04a6845a7995f1173dba3a5a0d25a54c45ebd62b3a",
        },
        wld: {
          amount: "2.62",
          transactionHash:
            "0x502bf389b1b5c7226f9bf7748e63a9799a101b6980d96b3891f8370c0ddb588e",
        },
      },
      {
        weekNumber: 4,
        wdd: {
          amount: "3556",
          transactionHash:
            "0xdfd96628546b2380a4a67b85dcd0e3e33071a21c330ac23e9b92cb903eb9a7f3",
        },
        wld: {
          amount: "2.12",
          transactionHash:
            "0xbfa5b4dd4c756119dcb555752f90eebccb0f2a3d290609a5e87d3101484d91ed",
        },
      },
      {
        weekNumber: 5,
        wdd: {
          amount: "3448",
          transactionHash:
            "0x2eac4f1bc92ee5ab76062f4497baa5bf4ad2b1a9c2dba343b4e5eb1598ec54d9",
        },
        wld: {
          amount: "1.76",
          transactionHash:
            "0x4e4badc5bfe4c0ac630ef995b17150a24ec1f1c9a8ab43755be27ad8b097be9d",
        },
      },
    ],
  },
  {
    id: 4137,
    name: "FREE 250.000 WDD",
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
        weekNumber: 2,
        wdd: {
          amount: "1580",
          transactionHash:
            "0xf30bd4b02cdd3c29f74e51e42b6eac6c6461b17ad0072cbe4af6710537c60669",
        },
        wld: {
          amount: "4.49",
          transactionHash:
            "0x8490cf5eff9556eb2fe9a064c9bdbf43877cc4daf69b4ece435a26b1e1c276ff",
        },
      },
      {
        weekNumber: 3,
        wdd: {
          amount: "3655",
          transactionHash:
            "0x3944fe0480726d8a6d7acba4087a24bbd59c5e4c10f500eb7f0cd3a9ed3baba8",
        },
        wld: {
          amount: "2.55",
          transactionHash:
            "0x347922d277628d228a90ddb4136016f06ec96962f120f9e1f47b702c5a11778e",
        },
      },
      {
        weekNumber: 4,
        wdd: {
          amount: "3519",
          transactionHash:
            "0xdbb69b975c55c5a1ef7d749b05a97ebcf3852e806c172a97fd87f4c04452cd94",
        },
        wld: {
          amount: "2.10",
          transactionHash:
            "0x730e9f8dd270007bc90ae52596a46a3827560b710f22a4cec00c898199efccc5",
        },
      },
      {
        weekNumber: 5,
        wdd: {
          amount: "1682",
          transactionHash:
            "0x7f3def7b5d1c8e414ede6d9a014155c5ad0fa5be5c59ffb1342498abb25331cf",
        },
        wld: {
          amount: "0.86",
          transactionHash:
            "0x6f832a7b5af494dfc638de67036705dd09167fcb11bbcf2936c2ca340b396e8a",
        },
      },
    ],
  },
  {
    id: 3415,
    name: "PRA x WDD x WLD 250.000",
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
        weekNumber: 2,
        wdd: {
          amount: "1529",
          transactionHash:
            "0x27b9d794fd56a86fc096725f9cdfb4489992ef3dcfeeabdfa6040cd478f2f23c",
        },
        wld: {
          amount: "4.35",
          transactionHash:
            "0x466a0c5c08894b663de75f8d11ca2e819eda86dd33d621e9839f73f2a1850f8e",
        },
      },
      {
        weekNumber: 3,
        wdd: {
          amount: "3655",
          transactionHash:
            "0x91750471749043345acd73a26d0cb5aa868b85a1cf03c16b9bfeca0892fbfb39",
        },
        wld: {
          amount: "2.55",
          transactionHash:
            "0xbe86143c63ab979f748b475e6ffde559ee7716d1445ca706e7aa45f4d9992b9c",
        },
      },
      {
        weekNumber: 4,
        wdd: {
          amount: "3613",
          transactionHash:
            "0xb91ea0646c3eb7f6267649cef390f5190386a5aa246c9096a828ce27088168d5",
        },
        wld: {
          amount: "2.15",
          transactionHash:
            "0xf8bad35d804f5beff1e966f397ceffd515aa2e7b7e368c5c60aaea38762dfca5",
        },
      },
      {
        weekNumber: 5,
        wdd: {
          amount: "3511",
          transactionHash:
            "0xcb6ceac680a7c42d361f069f6858308b9a10931443d3d5aff19b98717c87e6fa",
        },
        wld: {
          amount: "1.79",
          transactionHash:
            "0xb320ea1744a04e5e447a960514b95552550698e6ac4f6a9357bcbe323d89cd26",
        },
      },
      {
        weekNumber: 6,
        wdd: {
          amount: "3471",
          transactionHash:
            "0x98c7408c7f590a6184bae397057f643ac632b5c8b6e0d0ee2ba8e5646f9cb59e",
        },
        wld: {
          amount: "1.77",
          transactionHash:
            "0x27d68d42eab02e80f263ada3f05014a796d96bacf8bd829584b96d49bff4397b",
        },
      },
      {
        weekNumber: 7,
        wdd: {
          amount: "3386",
          transactionHash:
            "0x7dcaee36ceb74479bc12ad122167393fa3aa1f3f5d3e3e1410ed530137564b12",
        },
        wld: {
          amount: "2.38",
          transactionHash:
            "0xf6c274a1151d97c48f108f375fc935ef88b809394137cb21ab797b32644148e1",
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
        weekNumber: 2,
        wdd: {
          amount: "1523",
          transactionHash:
            "0x33c408634cc421d836e2c7f6c05aabf9c4bb3be2f5d76f9298d18c87bc32b483",
        },
        wld: {
          amount: "4.33",
          transactionHash:
            "0xe72639d013e9834bc64faed98d801010c00a6ccd7d3c9e30e7059b3bb97421e6",
        },
      },
      {
        weekNumber: 3,
        wdd: {
          amount: "3648",
          transactionHash:
            "0x7b23b39a827c4300d5682270450bbd08b610c36fffc8a6837093d296fd3f55d8",
        },
        wld: {
          amount: "2.55",
          transactionHash:
            "0x008f990f36cf53a23c0b6c4c58b019ad8d2f66566a73693e7ad8e28de80ee3b7",
        },
      },
      {
        weekNumber: 4,
        wdd: {
          amount: "3519",
          transactionHash:
            "0x70f5222426d6b8801cb400c507c6054bfb3e5b90c8bb3e5613bc4de7f6a03db5",
        },
        wld: {
          amount: "2.10",
          transactionHash:
            "0x7718c7d2e71872500127431c77e55d983eb7f3b200b5a2624b8c13d9ca4b892f",
        },
      },
      {
        weekNumber: 5,
        wdd: {
          amount: "3397",
          transactionHash:
            "0x2fc610835c920d02c984ae6de35eef425c1fff00384d7bfb48f3767fc5af1877",
        },
        wld: {
          amount: "1.73",
          transactionHash:
            "0x52bbdf12b28c6a41ddaccdf5b063c19b5c422485d08b4d6bf87659600a743be1",
        },
      },
    ],
  },
  {
    id: 3556,
    name: "World Republic Official✔️",
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
        weekNumber: 2,
        wdd: {
          amount: "1499",
          transactionHash:
            "0x4e403e2d61dc46a45cccfd65d212f7e4a3a464412ea4ebe1d1c4152e12d6ab2b",
        },
        wld: {
          amount: "4.26",
          transactionHash:
            "0x42a0d5844d4ff65c4069f35670ac70519efcd9cf5d0fadb5790686cfc984e1a0",
        },
      },
      {
        weekNumber: 3,
        wdd: {
          amount: "3738",
          transactionHash:
            "0x45e88f903b36986f1f85137d1b28042af6f5c2952d0686b97be3d255839e3974",
        },
        wld: {
          amount: "2.61",
          transactionHash:
            "0xf2f73e219be7eb33dc3e9417782b71ed886287a57900d9c3e1f81d0aa2085d44",
        },
      },
      {
        weekNumber: 4,
        wdd: {
          amount: "3600",
          transactionHash:
            "0x7497de2e96a0857355ae50498b72684ae7a733b8ac380a044e0f5f5102399b70",
        },
        wld: {
          amount: "2.14",
          transactionHash:
            "0x1c49ddde9b6cc5e291f1086c0d5733b8834de62d7057df969ee788ca3d8d9f5f",
        },
      },
      {
        weekNumber: 5,
        wdd: {
          amount: "3471",
          transactionHash:
            "0xce9d72f2ab0ea6b572d34f7d51de344b714b5db1414a3b93315145685cab971c",
        },
        wld: {
          amount: "1.77",
          transactionHash:
            "0x5f0f4531449841c05c6618a29d46c2b2c8ac5b1745c5bddeecf857f0511d3c94",
        },
      },
      {
        weekNumber: 6,
        wdd: {
          amount: "3386",
          transactionHash:
            "0x4ac7dc21a721e621ef1d8d2ec5ef3f48d7865e86b3440ac4d7051e8d21c8cf90",
        },
        wld: {
          amount: "1.73",
          transactionHash:
            "0x4584945a5d366cf7ff8687910354c2acf7046320d951cea79575b354c3a59e3e",
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
        weekNumber: 2,
        wdd: {
          amount: "1499",
          transactionHash:
            "0x20f8144a1ab17b862ab6a6ecd5325f926dacb5718ce1d8ffc44280913d0fc757",
        },
        wld: {
          amount: "4.26",
          transactionHash:
            "0x4366c37c916dcd25c7b470ec235f6f331d3a81345c83ae71a2901572e0364e3e",
        },
      },
      {
        weekNumber: 3,
        wdd: {
          amount: "3573",
          transactionHash:
            "0xd27dc5ae646c77ea2d145cb844ec1f4e5932d4af51652be78258980b8cd5d604",
        },
        wld: {
          amount: "2.50",
          transactionHash:
            "0x95d73ee8303d16fd178c08743b60425196a343a90bc2f711c801ae181e8898b6",
        },
      },
      {
        weekNumber: 4,
        wdd: {
          amount: "3456",
          transactionHash:
            "0x9bd5624edafbcdaae4bc4a67488d01379edfc3fc2e3de9d587896d2ecc8c8b11",
        },
        wld: {
          amount: "2.06",
          transactionHash:
            "0x646c76262d5e12ea58d46d9a73513780ce8b1ab9cc64b2642b92399464e0724a",
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
        weekNumber: 2,
        wdd: {
          amount: "1481",
          transactionHash:
            "0x655e73e66a80e69d75dae275a1e290327f10ca1ad53f386ab7f4194da0533c16",
        },
        wld: {
          amount: "4.21",
          transactionHash:
            "0x895e1b0fbf99dbaa78431af71affde7d5167cab8e665fc1db4a0ed9937f7b1c3",
        },
      },
      {
        weekNumber: 3,
        wdd: {
          amount: "3497",
          transactionHash:
            "0x49216b377238cb3ede7d40521885deae1645141475e76ee25a4764d775be655c",
        },
        wld: {
          amount: "2.44",
          transactionHash:
            "0x9fa3633bd318cc09b76b4b5a7852b926c4ed539b2d5145f2ae215448d5796391",
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
        weekNumber: 2,
        wdd: {
          amount: "1409",
          transactionHash:
            "0xd5078c2a2afc5bbe97c10b7c5c8dcf24ce9ed8a5849c17c6d65ffcf2170a7be8",
        },
        wld: {
          amount: "4.01",
          transactionHash:
            "0x3ff1d1948143a6d3333bbf9fb4a8a2e430ff33af864128e3b5586ff2714d0877",
        },
      },
      {
        weekNumber: 3,
        wdd: {
          amount: "3380",
          transactionHash:
            "0xf30f51f878e7f5983bb5405e575c064ae97c766e0b188ed9b99bebc6598abce7",
        },
        wld: {
          amount: "2.36",
          transactionHash:
            "0x1aeae86a8c250aa4305666e9f846743810affc94da582c1b59dc235328659376",
        },
      },
    ],
  },
  {
    id: 3006,
    name: "Bgolden  WLD GANA",
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
        weekNumber: 2,
        wdd: {
          amount: "1400",
          transactionHash:
            "0xe0b2a6a05adecdef9c5b946ec2ce17a832bbc6261be4dd8caf7b15c79ff319b2",
        },
        wld: {
          amount: "3.98",
          transactionHash:
            "0x6af624391b56fbb080eac30bf7e4245d1809ef9fd26caeb51c82c390ad3e205a",
        },
      },
      {
        weekNumber: 3,
        wdd: {
          amount: "3380",
          transactionHash:
            "0x42cb5badff5a80417304fb433579c4bba0eb10ccc947d79d5b48cf75261503ad",
        },
        wld: {
          amount: "2.36",
          transactionHash:
            "0xd25f91f905794a7bebf88cbee1767a1945a1bafd1196321a1b280b03679330c5",
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
        weekNumber: 2,
        wdd: {
          amount: "1397",
          transactionHash:
            "0xf930218cc14aa6570a3590c503bd8ac21fd20b35c2f40ae3c23706210367ed1c",
        },
        wld: {
          amount: "3.97",
          transactionHash:
            "0x0f1d23f80d24a88d27ad67797bf13d645a25a6d5c8db0509151230911da3a47e",
        },
      },
      {
        weekNumber: 3,
        wdd: {
          amount: "3387",
          transactionHash:
            "0x7e8c62d9b29be07be11ee5d0e3684b255d991639b603e6a6e6c33fd233e14b7e",
        },
        wld: {
          amount: "2.37",
          transactionHash:
            "0x429b3ab6260fa1ea55d9fc51eaeda30313aef09f12849bbab299d516d632e381",
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
        weekNumber: 2,
        wdd: {
          amount: "1376",
          transactionHash:
            "0x35343c8b832ab9a252fcaa75193c96031f985e0461466e1e5b95f3266995ceb1",
        },
        wld: {
          amount: "3.91",
          transactionHash:
            "0x0342cedae4da13626333d4b1af4ff29ae6db02dc709f4d63116c807599f17790",
        },
      },
      {
        weekNumber: 3,
        wdd: {
          amount: "3332",
          transactionHash:
            "0x36eadc99b1f0f6c78061efbe4687b0ddc7dfeb9fe039bb6551211f33b8241b90",
        },
        wld: {
          amount: "2.33",
          transactionHash:
            "0xfb74ec62ed0a49bbe13d98ff0760de1d8b3e7cfcce1e9bf294320849b7cc01cc",
        },
      },
    ],
  },
  {
    id: 4372,
    name: "250.000 WORLD COIN",
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
        weekNumber: 2,
        wdd: {
          amount: "1373",
          transactionHash:
            "0x80659f0c66637fa4461f5161cd349522d2454e1c3b3cb1175caddefa1070c86c",
        },
        wld: {
          amount: "3.90",
          transactionHash:
            "0xa74269deef6e05cf4dca23987bd62fe021716104ff99872edf14e3d9856f1961",
        },
      },
      {
        weekNumber: 3,
        wdd: {
          amount: "3717",
          transactionHash:
            "0x9a84177cbe64af56aa4ab23e43720e235058cfa7945d63f1ddfb055ce7b8693e",
        },
        wld: {
          amount: "2.60",
          transactionHash:
            "0x1eedc20a277389180166e8d3ff344cf8bb1450160d700cfb2a6e52ecc6007862",
        },
      },
      {
        weekNumber: 4,
        wdd: {
          amount: "3513",
          transactionHash:
            "0xf8c0851a8597dac66f7881b72ba89f7adc25bca1ebc4d798ee12b8dd3faa593e",
        },
        wld: {
          amount: "2.09",
          transactionHash:
            "0xde3d3f3eac95209aaf92e0e406e86b4feac4f51f7e208b7009c43c7f16cff989",
        },
      },
      {
        weekNumber: 5,
        wdd: {
          amount: "3391",
          transactionHash:
            "0xf50f048a738b9c29e97cfcc5c08af1a49a5120ffa1e6c0d7a3723b43f92bbe7f",
        },
        wld: {
          amount: "1.73",
          transactionHash:
            "0xd7528d7c822a16a6ab195b5997d4468075a924d7f7512cc4fa802d5e334f5a39",
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
        weekNumber: 2,
        wdd: {
          amount: "1373",
          transactionHash:
            "0x5e07ee40e4e0bac9c5040c90f81367b34afe9f8a0f1d495dee3898e7e1bacf05",
        },
        wld: {
          amount: "3.90",
          transactionHash:
            "0x47c90a7fd40e1e92aaf0d9cc6242849823bdc8989d3e164852d3ef4072d61bab",
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
        weekNumber: 2,
        wdd: {
          amount: "1358",
          transactionHash:
            "0xfcdcf68e252454f657f8b8428a233356f7eee5bba790988e2c149c1c654fe4e2",
        },
        wld: {
          amount: "3.86",
          transactionHash:
            "0x34933a77c7cd25a2df18ee3065fe64c69044eb1a0b1a2c352cdde8027c50742a",
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
        weekNumber: 2,
        wdd: {
          amount: "1346",
          transactionHash:
            "0x14c254721f716007f7eb395e4569c2a94b122e92ba35cfa4f92ef9d0d5318bfc",
        },
        wld: {
          amount: "3.83",
          transactionHash:
            "0xa4c50f90166248e4b9989ae3754303c0c9f7bd8a58339954e2d28dcae71fa679",
        },
      },
    ],
  },
  {
    id: 5054,
    name: "FREE 500.000 WLD EVERY WEEK",
    leaderAddress: "0xade52d5293d83c6d05a9af2d5f0a9bc6d9bd3051",
    leaderUsername: "thekoem.3775",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 3,
        wdd: {
          amount: "4515",
          transactionHash:
            "0x50633f019ab11f01d8074d01752491b6b09a4fc85f7ffa0abfbd887de74b9827",
        },
        wld: {
          amount: "3.15",
          transactionHash:
            "0x2b8d58e0496b34968eeaf686f43ef66d35eb6aae83e6db6bfc37eb433a64b988",
        },
      },
      {
        weekNumber: 4,
        wdd: {
          amount: "4150",
          transactionHash:
            "0x9498f28d1c73f8b681c7777e291f6a0a4b12a8d6a4aec7842442ea83540c39da",
        },
        wld: {
          amount: "2.47",
          transactionHash:
            "0xaa4b3c7e926250afb5631217e423e138673fe343689b519a9bbee8931643c915",
        },
      },
      {
        weekNumber: 5,
        wdd: {
          amount: "3891",
          transactionHash:
            "0x1d09c4cbed64b501abffd4b68e3c325e68584ea22046ee4cb076ab63074043c1",
        },
        wld: {
          amount: "1.99",
          transactionHash:
            "0x1e9381a6ad0c5e4b61fc5bfc79ad36f6eb697cda008993c29701fc993403228e",
        },
      },
      {
        weekNumber: 6,
        wdd: {
          amount: "3768",
          transactionHash:
            "0xef8890d28dc5a5caf2484b5d4f2fa3edab3aef679eb10231621707b6c1b1705a",
        },
        wld: {
          amount: "1.92",
          transactionHash:
            "0xbafeffcd916ad8eaad72aebdb3d64d7ad212fa0f0d01c59ddd9acde46a56a95f",
        },
      },
      {
        weekNumber: 7,
        wdd: {
          amount: "3644",
          transactionHash:
            "0xdb79317d78ead9a22842acfc89d6da80323bfb497602fa508ed4000c25ea44c8",
        },
        wld: {
          amount: "2.56",
          transactionHash:
            "0xd313d92e6949ee42e94b87ecaedf23320b928e5a1462ae024471e802dae71b49",
        },
      },
    ],
  },
  {
    id: 4800,
    name: "Get free 275.000 wdd, join now",
    leaderAddress: "0xc32daf5e6468e18dc6cc8fc238af117ebc2a0deb",
    leaderUsername: "elaymadoen.3820",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 3,
        wdd: {
          amount: "4412",
          transactionHash:
            "0x9be0775076ade99612f1c6d5bd5158422275fc84815a671ed5a5712ca0774346",
        },
        wld: {
          amount: "3.08",
          transactionHash:
            "0xb0aef37babfa4bad1451468d9f2f11b4b33683dfc5d2ce2cd79f555de22361d8",
        },
      },
      {
        weekNumber: 4,
        wdd: {
          amount: "4094",
          transactionHash:
            "0xf1458ac057da7996ffd1db1d7a7734aefddfda29901a5bac3d0c30b55e0b5c12",
        },
        wld: {
          amount: "2.44",
          transactionHash:
            "0xf53c4af82abb917f31cb5c2e75cecbc6c60025fdf2fcb44f0a3df3fb44e3e80c",
        },
      },
      {
        weekNumber: 5,
        wdd: {
          amount: "3851",
          transactionHash:
            "0x02eb7606bf5b8c0e5bcb74824654b2a429cbcafe9031e4ffb1888a0b7e2539fd",
        },
        wld: {
          amount: "1.97",
          transactionHash:
            "0xfe431752f7d412682cf47d567d76e4de2147283a9f68b6981e93fb2fd3bec18a",
        },
      },
      {
        weekNumber: 6,
        wdd: {
          amount: "3731",
          transactionHash:
            "0x8fad36ede05f90f19d353b4f26c2c0efc706ccdf76ff06b1801ad4bcb6b8cfb9",
        },
        wld: {
          amount: "1.90",
          transactionHash:
            "0xaa81afb24eebfa7a06acbb7d20096d5954a6dfd02d1f04a11b562026c936aef9",
        },
      },
      {
        weekNumber: 7,
        wdd: {
          amount: "3629",
          transactionHash:
            "0xb066a2699aa0391435e9d8db55c8ee649a7229d6d3f993b0a176290bd53850b3",
        },
        wld: {
          amount: "2.55",
          transactionHash:
            "0x74179451980fd4d4f465b43cf8c1375cd22dd299b246ea65ee2bfe12bab6d1d7",
        },
      },
    ],
  },
  {
    id: 5320,
    name: "GET FREE 250.000 WDD SETIAP MINGGU",
    leaderAddress: "0x4610eab5837806528ddeff038223888c3925bbb3",
    leaderUsername: "kasnah.1033",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 3,
        wdd: {
          amount: "4391",
          transactionHash:
            "0xc4f23e6407ec930b65cdd4202bc47afc40515bcafd0320b56e908e25d62ac2b0",
        },
        wld: {
          amount: "3.07",
          transactionHash:
            "0x8fb2aea6cbcfaf327c4f06c85d579442751307e36ca1489ba643216ea1d64cc2",
        },
      },
    ],
  },
  {
    id: 5966,
    name: "KUMPULAN PARA PEMULA 📢📢",
    leaderAddress: "0x9535c70e3cb62cff337bc9b4d04c457f58f62b5c",
    leaderUsername: "ahmadbayan.2270",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 3,
        wdd: {
          amount: "4295",
          transactionHash:
            "0x307dada20f6577a98b1bcbe8df05de258136807226bb5a318f76f8b1c6544790",
        },
        wld: {
          amount: "3.00",
          transactionHash:
            "0x99ff18c5d2eebd13cd096048075cfe686b3244209e1fa7c1bf4c4c68d46fa139",
        },
      },
      {
        weekNumber: 4,
        wdd: {
          amount: "4244",
          transactionHash:
            "0x9d58b24cb98fec1d33adc17e9bf66cbbbc3349cc36103c306e47e0f7253ba654",
        },
        wld: {
          amount: "2.53",
          transactionHash:
            "0x6d6d2c6a14e18683406da225a4ac17db01fa87b6890681b055ecbc44d04fbe7c",
        },
      },
      {
        weekNumber: 5,
        wdd: {
          amount: "3999",
          transactionHash:
            "0xcff5c3547ac098f6921207448dd985e29b615c1ffa54ff460a417ce77b353079",
        },
        wld: {
          amount: "2.04",
          transactionHash:
            "0x9078a857e7b7bdaad623cc893f8000ff0610b132d6c15b691a05b3d5663b3bf2",
        },
      },
      {
        weekNumber: 6,
        wdd: {
          amount: "3842",
          transactionHash:
            "0x6c4cf7d5829211298bbb9ab629ebf4891dc55320b16cf615e3a3665a854bf070",
        },
        wld: {
          amount: "1.96",
          transactionHash:
            "0x794469bca3768cd0ec14ec0b80becef2e12a274ee799ea9413c10385f0fc8e14",
        },
      },
      {
        weekNumber: 7,
        wdd: {
          amount: "3739",
          transactionHash:
            "0x8440fe14290a1f347ea827a4f3db95e2d468cea5846c520310533da75682a6a1",
        },
        wld: {
          amount: "2.62",
          transactionHash:
            "0xbf7b1c46a96f6e7ebd76dd25a35966eb2b06f7a0beda9c31a6d12b2234f60f05",
        },
      },
    ],
  },
  {
    id: 5703,
    name: "FREE WORLD COIN",
    leaderAddress: "0x14e513c7d140b66733eae4847fc6ebd10a87f230",
    leaderUsername: "vanerryzsh.9515",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 3,
        wdd: {
          amount: "4226",
          transactionHash:
            "0xc5915ea843c62ad5f5d2674109827e5b97b922feba292d5a1177db42b5905ddd",
        },
        wld: {
          amount: "2.95",
          transactionHash:
            "0xa58e3974cfb97e27b454223d974db14486f09a689aa0c61c89d86fcda7bda780",
        },
      },
      {
        weekNumber: 4,
        wdd: {
          amount: "3913",
          transactionHash:
            "0x5c683d8f10518bc674b7ee901c53d04d3a14e47b975dbf7c5609b66e0b62ca0f",
        },
        wld: {
          amount: "2.33",
          transactionHash:
            "0xe0aa4bd4c4dc6013c233516c6345e7e5780b2245fda66c1d35e94c089f6509c7",
        },
      },
      {
        weekNumber: 5,
        wdd: {
          amount: "3721",
          transactionHash:
            "0x600d2b70b8f426a170a846a1544fd612cc309e451dc2365b2a57f928c21d00e9",
        },
        wld: {
          amount: "1.90",
          transactionHash:
            "0xc27f52a53ab27c50c8053146a9a14ac267835e367cf8bde20fa301ab13f9cd5b",
        },
      },
      {
        weekNumber: 6,
        wdd: {
          amount: "3593",
          transactionHash:
            "0x353987e5c3349fa15b9511600321002e26ef74c8fc63bce3fa945b0cab9ef390",
        },
        wld: {
          amount: "1.83",
          transactionHash:
            "0x8bc45235a1404c23e73011e003c8744f68a88fcbe89703b69e006d945ce908b1",
        },
      },
      {
        weekNumber: 7,
        wdd: {
          amount: "3480",
          transactionHash:
            "0xb3b219bc74ac1b06c236b59a0d2197463648f52a1d6199f642e61e6067ce24b7",
        },
        wld: {
          amount: "2.44",
          transactionHash:
            "0xa7577c5300d66fde2b4fd8b00d38addaa7206aa0164b08a89290a26515c0f882",
        },
      },
    ],
  },
  {
    id: 7195,
    name: "Gratis 1.000.000 WLD setiap hari🪙☑️",
    leaderAddress: "0x3fc9a16b697157c3693844d7fabcefa5658330e3",
    leaderUsername: "kasiada.7939",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 3,
        wdd: {
          amount: "3580",
          transactionHash:
            "0xabb62ab1604331efbe6014371cced9a16d3fb43eac763c306e6b4f35f437c9b9",
        },
        wld: {
          amount: "2.50",
          transactionHash:
            "0xb6bf413ad5d3dfcfc567db8b6250dd4829103281cd842e4f8ad4144951465234",
        },
      },
      {
        weekNumber: 4,
        wdd: {
          amount: "3500",
          transactionHash:
            "0xbf3f337cfe1eb22d0ea2e49206049f20e769ade80f336e55d0c851e54e6d1677",
        },
        wld: {
          amount: "2.08",
          transactionHash:
            "0x5ad2ec3df92ac48e53b578896f8dd4db414e74aa277d9f36ff12816049694a64",
        },
      },
      {
        weekNumber: 6,
        wdd: {
          amount: "3571",
          transactionHash:
            "0xb82a96ebc871a14feabbc00d49d53163ecaf5dd4163d5b94f4ea5b4dd4d52ea9",
        },
        wld: {
          amount: "1.82",
          transactionHash:
            "0x75682b1ed371cf736a0ebd0fae3efcae0d191981b121aac7ef2bfc0568ab46ec",
        },
      },
      {
        weekNumber: 7,
        wdd: {
          amount: "3485",
          transactionHash:
            "0x7d4a247e3113646a45d8b58085d4c19e9af474feef4fd21aa98169c95c2c9626",
        },
        wld: {
          amount: "2.45",
          transactionHash:
            "0xcfab27500a1d7533e5c3f4062328d8df827c99d4b830b628909b86e4d1e526e1",
        },
      },
    ],
  },
  {
    id: 5161,
    name: "Uno Party",
    leaderAddress: "0x9f1498f4e2a16120f5958b3532f08020611488cc",
    leaderUsername: "yann.8741",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 3,
        wdd: {
          amount: "3573",
          transactionHash:
            "0x7a7b6cec12ae8875a1725b4e4669f914f794074dffb8adb5df47c587293d32bd",
        },
        wld: {
          amount: "2.50",
          transactionHash:
            "0x18a9358c54e89fb58fefed3bcb8d49e37f8bc1316fa6abbba0964c172ba6fdb2",
        },
      },
      {
        weekNumber: 4,
        wdd: {
          amount: "3494",
          transactionHash:
            "0xf212ba0c293f5ce62dad432f6ea7c5266b4fd3f744e1f21d766824f4932e53cd",
        },
        wld: {
          amount: "2.08",
          transactionHash:
            "0x3530fbd67ff0b4272b16d63544b14333ce130f1ac1393523d244df6d007b0a04",
        },
      },
      {
        weekNumber: 5,
        wdd: {
          amount: "3533",
          transactionHash:
            "0x19544a2373113b1e91731118ad7395a62f143aa288ea3bbd9963596941c3a7dc",
        },
        wld: {
          amount: "1.80",
          transactionHash:
            "0xc1fa262ebeaaeb0fcfed694485aa38e0030460172938237c345b7a70237c7b28",
        },
      },
      {
        weekNumber: 6,
        wdd: {
          amount: "3471",
          transactionHash:
            "0x4880cf3cdb326511739c42cbc74bc214ed731603aa945978d0b9634a99328f37",
        },
        wld: {
          amount: "1.77",
          transactionHash:
            "0xa3d520b0d8fa7859bd49b2582c286e37a8875c2f3a8cb2f2b55b256c84500a8b",
        },
      },
      {
        weekNumber: 7,
        wdd: {
          amount: "3435",
          transactionHash:
            "0x0dba1b18b6ae969051d8c05ddc951673b5d2da46b8d5903c9905be55b2751870",
        },
        wld: {
          amount: "2.41",
          transactionHash:
            "0x94c864bf06b3599aa20cd656050b3adc78047ca28f2484814dd13731a8c161fc",
        },
      },
    ],
  },
  {
    id: 4792,
    name: "FREE GIVEAWAY 100.000  WLD",
    leaderAddress: "0x66c18406b30c38fa24f4d2d2b3bd3afc47f9fed4",
    leaderUsername: "lamhot74.1917",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 3,
        wdd: {
          amount: "3483",
          transactionHash:
            "0xca4d8ae626594091a2b8921db98e57e60cdec1a866ad140a7370fc5cb2b9901e",
        },
        wld: {
          amount: "2.43",
          transactionHash:
            "0x5a7613894d4d1b9ead2604c289451153d229edece0415b79abd4e916f49dc1be",
        },
      },
    ],
  },
  {
    id: 6621,
    name: "Axo Party",
    leaderAddress: "0x5d00F1163DCD55f27A1F678C6820ED2f8FE5513E",
    leaderUsername: "davidmateos",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 4,
        wdd: {
          amount: "8638",
          transactionHash:
            "0x090d6bb3ee87a1fcdeaaec8c2c9c6b0ef753b4ef793d453fb726d8acb0b96e37",
        },
        wld: {
          amount: "5.14",
          transactionHash:
            "0x5e9b0e61d290d02d5ecdc5b6cd37ba68288678979be9e79504f41ab41bf996df",
        },
      },
      {
        weekNumber: 5,
        wdd: {
          amount: "15480",
          transactionHash:
            "0x0a63f0052b2d90e88a18a6cdc3b96a7c49b0e1e7276965da4bc306a156403fd2",
        },
        wld: {
          amount: "7.90",
          transactionHash:
            "0xb587dd5ca2a02fa6bd8c42e241a3e01341dc9d65c5a2becdcbd913ddc4855f1a",
        },
      },
      {
        weekNumber: 6,
        wdd: {
          amount: "18810",
          transactionHash:
            "0x760b6632f5714487e8a8e4a40ff10882f6371555e27ea10c63b1332511b5c5ce",
        },
        wld: {
          amount: "9.59",
          transactionHash:
            "0xebdbbbd2ec178abd3b74c93249df6cbbe14e9d582d38d1cfacd7192f07805bcf",
        },
      },
      {
        weekNumber: 7,
        wdd: {
          amount: "20785",
          transactionHash:
            "0x3a68712ac0d6d56daf8ea46148cad35d747e90651793f2eb072f907359f0f89c",
        },
        wld: {
          amount: "14.59",
          transactionHash:
            "0xa8a306ddcbe4ca55ac1f1aa8352adc6831eace436f2e5753ad14a239d4a9280e",
        },
      },
    ],
  },
  {
    id: 6553,
    name: "Gratis 250.000 WLD✅🪙",
    leaderAddress: "0xe22d840e55b06edf6f2d40b1254eee7b203b130c",
    leaderUsername: "skychiro",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 4,
        wdd: {
          amount: "4938",
          transactionHash:
            "0xf016b0ed746984b7d751407a6a25da593f4a630087a7c59f0f3019e593da8df1",
        },
        wld: {
          amount: "2.94",
          transactionHash:
            "0xfa4952dae39bbc196ab56c0cac5e66907b48687e8a257a2931cb0fbb20e9d8be",
        },
      },
      {
        weekNumber: 5,
        wdd: {
          amount: "4624",
          transactionHash:
            "0x2e4bdb7ca03c07fa3537cc8f13a33f635cd468a457fbabfcc4aa8e587eb62e2c",
        },
        wld: {
          amount: "2.36",
          transactionHash:
            "0x030c08ea5d4583fc59ec26c89dbc39706776e25a0a7adbc3852dded000bcadf3",
        },
      },
      {
        weekNumber: 6,
        wdd: {
          amount: "4367",
          transactionHash:
            "0x6ba7cb429dfb65e1f22097063b30dc7d110942a0518fc8405952b7a57fef5c44",
        },
        wld: {
          amount: "2.23",
          transactionHash:
            "0x687cf748929a21199f3cf279acf54f9856135d33abc20660de74a798ae8e8586",
        },
      },
      {
        weekNumber: 7,
        wdd: {
          amount: "4182",
          transactionHash:
            "0xce26958939be513b0dba614acbfdacb2f7ef859d80335867e97a12fbb9f36b1f",
        },
        wld: {
          amount: "2.94",
          transactionHash:
            "0x9725c02d250792227ba9dac5d0e891513bdab825f3edc2a77c472776940608a4",
        },
      },
    ],
  },
  {
    id: 6798,
    name: "Gratis 250.000 WLD✅💰🪙",
    leaderAddress: "0xba63479d6da567c3bb5e4f60afc68a865f347eb7",
    leaderUsername: "ilham.7223",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 4,
        wdd: {
          amount: "4475",
          transactionHash:
            "0x3f83a73696e8cd665b3c25b24d62b024e28a956ac561bf8489ad797ed34cc03d",
        },
        wld: {
          amount: "2.67",
          transactionHash:
            "0x8f53ce5d84b7c8f76e607324d76740d3e162cfe99ed9fcc912477577863f92a8",
        },
      },
      {
        weekNumber: 5,
        wdd: {
          amount: "4232",
          transactionHash:
            "0x75a269f51201e1e2456ae96168366868f62ad9556b6bbe8aa69c67a966271c22",
        },
        wld: {
          amount: "2.16",
          transactionHash:
            "0x835eda879c92b159b4acc31aafd990b05146fdcb98b9b4b551bc7cfdeac37a58",
        },
      },
      {
        weekNumber: 6,
        wdd: {
          amount: "4001",
          transactionHash:
            "0x64eb5a31375b0dbf55a5f2378b2c9517d540a224c6a5302951e15579f1cb2da4",
        },
        wld: {
          amount: "2.04",
          transactionHash:
            "0xfa94ccb973076b2203cc694ed94171a6b303df45fc1f74c5cc99582a68df519f",
        },
      },
      {
        weekNumber: 7,
        wdd: {
          amount: "3843",
          transactionHash:
            "0x32cd9ac7c6dbf9fcac72ca23d4608061f90830def5f9414b86747daa6f41d163",
        },
        wld: {
          amount: "2.70",
          transactionHash:
            "0xe6692a9738f28cbd82a2d315bda1a3e3e08c4831eb4043442450e9f5bb20b9b8",
        },
      },
    ],
  },
  {
    id: 6837,
    name: "JOIN AND GET 500.000 FREE WLD💰🪙✅",
    leaderAddress: "0x16c3308281fe6bb85046ca4f65591aff7e43ee22",
    leaderUsername: "yosafat.7340",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 4,
        wdd: {
          amount: "4400",
          transactionHash:
            "0xabcaf75811600a118daad14d372c2d52fe4020206a0c0aff3cacfa045ab837f6",
        },
        wld: {
          amount: "2.62",
          transactionHash:
            "0x5b3ed99c2c5a75066dec1ca898a09449ea2a2644bbe26fd1ee9a44f4514f3509",
        },
      },
      {
        weekNumber: 5,
        wdd: {
          amount: "4260",
          transactionHash:
            "0x72fc52d80874e35da67bcde0b3efbdeb7a82d84a738373c3034e82c8c5555824",
        },
        wld: {
          amount: "2.17",
          transactionHash:
            "0x186834eb0ac79c15e660fcc1c3e8700658fedadd5c002c293cd8b4bcf73c262a",
        },
      },
      {
        weekNumber: 6,
        wdd: {
          amount: "4097",
          transactionHash:
            "0x5d59ef9e70a36c067e3431fa2ba13f33ba031c0a98220b88eddb52c83ab68e55",
        },
        wld: {
          amount: "2.09",
          transactionHash:
            "0x13d10047bc6c4170182e0234f03fa098f55ceec873c5a96534bae3c737815115",
        },
      },
      {
        weekNumber: 7,
        wdd: {
          amount: "3948",
          transactionHash:
            "0xfb032e83c73414facfb981a9688e2b7941164c799cfbd4c52f70b3acdcd8ed71",
        },
        wld: {
          amount: "2.77",
          transactionHash:
            "0xacbe57f0c137bb3c0987c9f8d52b9ab19b88bc43b9a06e34a5361fa6c2a1c15e",
        },
      },
    ],
  },
  {
    id: 5320,
    name: "Free Sushi Party",
    leaderAddress: "0x57f7d8a11ea627395c999958a0b6ef96c6058606",
    leaderUsername: "republicwdd",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 4,
        wdd: {
          amount: "4175",
          transactionHash:
            "0xe82f77b804477cdf80d6c265136363dbd0e2712d554cd2b0bb552316b4c7aede",
        },
        wld: {
          amount: "2.49",
          transactionHash:
            "0xce5a8cf18d794bd8d3da23ca6fa0c16704f685d96046cd0210230610fda7f883",
        },
      },
      {
        weekNumber: 5,
        wdd: {
          amount: "3948",
          transactionHash:
            "0xf03d60ded5adb8702d87669decef6a235a619902d1e0456f2d1c03a78990c85a",
        },
        wld: {
          amount: "2.01",
          transactionHash:
            "0x7b357048b708b45a62ebc44bb90fd22c4b254c5d28f058638207c8081ef41a08",
        },
      },
      {
        weekNumber: 6,
        wdd: {
          amount: "3794",
          transactionHash:
            "0xae3959537b09035ef6a94f560f37767ea0443585f65fa3b3c5a0d66243ad025b",
        },
        wld: {
          amount: "1.93",
          transactionHash:
            "0x2e322f8e12f4912bf12f22ce3bae6a55b26b56b88c22115a506a6747f20e017d",
        },
      },
      {
        weekNumber: 7,
        wdd: {
          amount: "3689",
          transactionHash:
            "0xcea9fda92a3c36bd65e847dfce4d51ba650f5969efc40e90f97249575ea2c418",
        },
        wld: {
          amount: "2.59",
          transactionHash:
            "0x3fdacd87d114f4051d43ad2558aeb392857bfa8cecdb85f91bc98fda6cc40532",
        },
      },
    ],
  },
  {
    id: 6263,
    name: "FREE 250 WLD COIN KENYAN &ASIA",
    leaderAddress: "0xc5c35a03772140e4b7c74bbe132b8dc537080988",
    leaderUsername: "juniorond",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 4,
        wdd: {
          amount: "3875",
          transactionHash:
            "0xb30a3ac77968827e4fba6146060c6f183e8125105a837d8bf0f9edeca31a509f",
        },
        wld: {
          amount: "2.31",
          transactionHash:
            "0x584eb50beed4ca42196308cdf9aad1b422e5fc8a8e7bbe6097b65e734a7718f3",
        },
      },
      {
        weekNumber: 5,
        wdd: {
          amount: "3641",
          transactionHash:
            "0x134707a5f8c512c26682acd02686b9246b4116cfe38316bca7b33fe42252c5cb",
        },
        wld: {
          amount: "1.86",
          transactionHash:
            "0xc4492276d57a28212267e2d73a5a063b7107af4f14e1844d484bb8f86627a96b",
        },
      },
      {
        weekNumber: 6,
        wdd: {
          amount: "3518",
          transactionHash:
            "0x180cc82af334f3db6d83d3fc1acd95a32451a756182b182b21d776cbeb36e551",
        },
        wld: {
          amount: "1.79",
          transactionHash:
            "0xc7beb476c68b5957d6bd324d110d412721d08a41ed95f6867d8e0a7e678e9598",
        },
      },
      {
        weekNumber: 7,
        wdd: {
          amount: "3415",
          transactionHash:
            "0x7303f07ab97e941aa24e3df42864c193afd4d21e20659c6880d6115a9827a3aa",
        },
        wld: {
          amount: "2.40",
          transactionHash:
            "0x5acf14f57cc7631915af55bd8906312363115b9137497f2f89b63eb65f91451e",
        },
      },
    ],
  },
  {
    id: 6995,
    name: "💰AIR DROP +50$WLD ✅ 50.000 FREE $CDT🤑",
    leaderAddress: "0x01588dbba4afafe8ad6a849c09561b424edcf0ac",
    leaderUsername: "camilin23",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 4,
        wdd: {
          amount: "3850",
          transactionHash:
            "0x3403fe41849083bc282b938112549a69a5b3467f4f58885713c37e3494f43090",
        },
        wld: {
          amount: "2.29",
          transactionHash:
            "0x00c62d14d393fec622052d3219333a4696551975c2ec7c7c34924d84686f69de",
        },
      },
      {
        weekNumber: 5,
        wdd: {
          amount: "4118",
          transactionHash:
            "0x677e7e84f254843eb0e918ac951711e6821aa23649ce644b47ea88048fe7b539",
        },
        wld: {
          amount: "2.10",
          transactionHash:
            "0x2464f6e4f7d0511b223617bac02d07e8da91c46d5e3e9d3e2f37136fa57aefd1",
        },
      },
      {
        weekNumber: 6,
        wdd: {
          amount: "3911",
          transactionHash:
            "0xddc653d00795b2a7e5b54c93aaa7b9c75d01af02cef94d4fd1688f585c27389d",
        },
        wld: {
          amount: "1.99",
          transactionHash:
            "0x1e6c2ba1d3c1b04d62b206e595de903d03ae7e70a548557042be0281fd4703eb",
        },
      },
      {
        weekNumber: 7,
        wdd: {
          amount: "3764",
          transactionHash:
            "0x4bee296de8123ee76b2361d160089b7d07cf81c6594d065bdc79bda74112ea5c",
        },
        wld: {
          amount: "2.64",
          transactionHash:
            "0x62b716fb8a14265c0857356ec06542b7a7854a05b2603103894680d03af20536",
        },
      },
    ],
  },
  {
    id: 6981,
    name: "🤑 500.000K Mil Coins 🤑",
    leaderAddress: "0x472067c6e204d1c108da8fe3faf35dc7090aebdd",
    leaderUsername: "jimenaadiass",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 4,
        wdd: {
          amount: "3425",
          transactionHash:
            "0x45f68230e81815399b756019c3f55400b2bf8efc6b71930f29299a8731970c0e",
        },
        wld: {
          amount: "2.04",
          transactionHash:
            "0xf8ea74101766a57f462497dc22803f754ed9e047a3a445084fdca72f46a3a5b9",
        },
      },
      {
        weekNumber: 5,
        wdd: {
          amount: "3619",
          transactionHash:
            "0x8cdde0f0b8e98881edc362ab1ef9a10d099a39a1cf85750ef5dd6bb5218ee514",
        },
        wld: {
          amount: "1.85",
          transactionHash:
            "0x938e43b56c416b2a5e3a7c2c10e299db09fbb5c1a235f1544ad1a79952526626",
        },
      },
      {
        weekNumber: 6,
        wdd: {
          amount: "3487",
          transactionHash:
            "0x7671306aa0ba0b91febd837fa533fe82c69b5c4b2b2f979c489908defabee417",
        },
        wld: {
          amount: "1.78",
          transactionHash:
            "0xa37dda7e51bb9f6f139533e4648b28cda47fbb130c38720bf8c6ea7598da8859",
        },
      },
      {
        weekNumber: 7,
        wdd: {
          amount: "3480",
          transactionHash:
            "0x00ddfdd1e76d279de432f7d725adbdd8d050d777a9fc204a0f443c5c8231f12e",
        },
        wld: {
          amount: "2.44",
          transactionHash:
            "0xb3c08c8464df5b9fe12fe219c04c05b7aef29a9eca8d74494ca0b9bed385c6cd",
        },
      },
    ],
  },
  {
    id: 521,
    name: "Libertarios Colombia",
    leaderAddress: "0x9dbfc5ea11ed3e26e42f17308e0fb92b1673358f",
    leaderUsername: "snake0",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 4,
        wdd: {
          amount: "3375",
          transactionHash:
            "0x610676761606ef943eae9c61775c1ff4c811bb1ba652b2b453015e005e56c94f",
        },
        wld: {
          amount: "2.01",
          transactionHash:
            "0x16d3b86d68ca34f09546f06cff7c28e91616fa66e6644645dce1ec64e1772736",
        },
      },
      {
        weekNumber: 5,
        wdd: {
          amount: "3397",
          transactionHash:
            "0x41f5015b21cd1ff705ecd278aeda2f18b6c6362dba04a1a780a0653f811659a3",
        },
        wld: {
          amount: "1.73",
          transactionHash:
            "0x47493fc8ee2de14f23f795db2ed75f32c37340109f54c70a7443b0c312d7318c",
        },
      },
      {
        weekNumber: 6,
        wdd: {
          amount: "3423",
          transactionHash:
            "0x45718e925797604a1eb97cebd9772b7a9c31f44d8024677f715da445bac06013",
        },
        wld: {
          amount: "1.74",
          transactionHash:
            "0x758ccffc9b237a77be631c1ea7932493bb677bf5e3b50c240570c1c7c03f8cb8",
        },
      },
      {
        weekNumber: 7,
        wdd: {
          amount: "3366",
          transactionHash:
            "0x0ef53a7bab77fa189fbf82f6cd6c221b5c439d9a79c80d4b57a9f80a0c790cf1",
        },
        wld: {
          amount: "2.36",
          transactionHash:
            "0xd5775688443e1b7df67adc67b2af7be78eddc25d194ea92323f337ef99ad2428",
        },
      },
    ],
  },
  {
    id: 7399,
    name: "Everyone can be rich here, earn 1,000,000,000,000 WLD coins just for joining this party💰💵🤑",
    leaderAddress: "0x2d354b611376c2327a0a34e9ce63c7eb2aa40cd1",
    leaderUsername: "febri.2619",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 5,
        wdd: {
          amount: "4612",
          transactionHash:
            "0x59fa8ec9c8f5e492474bc04b02a58f63e6226c707ade1da50b2461b949916305",
        },
        wld: {
          amount: "2.35",
          transactionHash:
            "0xa25cc9ee4e5792c85d89feb50185038aa2fcd5fef9b21c8e7e59448ab865e763",
        },
      },
      {
        weekNumber: 6,
        wdd: {
          amount: "4340",
          transactionHash:
            "0xa5bdae54bd1393d8796cf41abe96849c057bd842a8910d24f846788eda2bd382",
        },
        wld: {
          amount: "2.21",
          transactionHash:
            "0xba2e45d020899bfe0c7c2dbb5898f7333a7f273ac481eec6ca88f39f92470409",
        },
      },
      {
        weekNumber: 7,
        wdd: {
          amount: "4187",
          transactionHash:
            "0x3a8db2a50bee7036931859c11ff1ba40eb910b0d71fa70c8322b532b5a1d5860",
        },
        wld: {
          amount: "2.94",
          transactionHash:
            "0x510cb5d738b2028510020bb7012708b6c0d5c5399666531f297b1bf7a0f26de5",
        },
      },
    ],
  },
  {
    id: 7197,
    name: "Worldcoin☑️",
    leaderAddress: "0x87fae60f0a7b9a4bd15cf417115dafdd86827e70",
    leaderUsername: "mairbek",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 5,
        wdd: {
          amount: "4022",
          transactionHash:
            "0x7d0dc49d6f3993dc78e9f7a1855c02fb07c37f398f176fddc002901cbdb18ecc",
        },
        wld: {
          amount: "2.05",
          transactionHash:
            "0xf3630ebc34138d7e2dafdb3d50cb877bb8eac0bde280462724751b7fed0f0fe0",
        },
      },
      {
        weekNumber: 6,
        wdd: {
          amount: "4118",
          transactionHash:
            "0x8a7a1f165d5fdbcd6206d83d0d7c3ebeef114ab12eb2401e5a46873dc84b8552",
        },
        wld: {
          amount: "2.10",
          transactionHash:
            "0xe6b4887001d8f6c1ede200294d05261d57c5f23fa1f88c9ac132ef6fdc18a6a4",
        },
      },
      {
        weekNumber: 7,
        wdd: {
          amount: "4013",
          transactionHash:
            "0x5a63c0cd956ae4b978c83a70ec72c7c8c90ee518248f49fdcd7b80391d2a2e78",
        },
        wld: {
          amount: "2.82",
          transactionHash:
            "0xb5c822640d6ef6dcee6d381b6d57127315d4f0f57fe7910ab7529644be5201f0",
        },
      },
    ],
  },
  {
    id: 7116,
    name: "Gratis 250.000 World Coin",
    leaderAddress: "0xb6f8c2f642bbb34942d8f30f1523339beabe3760",
    leaderUsername: "selfi.4646",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 5,
        wdd: {
          amount: "3800",
          transactionHash:
            "0x7185934dcfdd27b8b41e88c0f1568514b48a9aa3a9bfe2cd760542c142c35b57",
        },
        wld: {
          amount: "1.94",
          transactionHash:
            "0x0ebef16c311c1998233be321ad8c8c797faeaa6348f579970fa19060d74b62ca",
        },
      },
      {
        weekNumber: 6,
        wdd: {
          amount: "3662",
          transactionHash:
            "0xccb1ae717ccd38cb3d2298d93d31a3077a1622e8a514cbf2d27bed85aef2cb26",
        },
        wld: {
          amount: "1.87",
          transactionHash:
            "0x06c80cd49d06cf25a7363bd07201b1483d12cb23d9b84a4ebee503c4b802f900",
        },
      },
      {
        weekNumber: 7,
        wdd: {
          amount: "3530",
          transactionHash:
            "0xa0af4650a0139bf95a32da67b78fb63b709fb0b4815c274d91e78503664e5c3f",
        },
        wld: {
          amount: "2.48",
          transactionHash:
            "0xa037589b4dc891d47b4ed3f86abb682a9cc0b62fc95c8f0baab099d91342c0bb",
        },
      },
    ],
  },
  {
    id: 7284,
    name: "KLAIM WORLDCOIN HINGGA 1.000.000 WLD",
    leaderAddress: "0xae0416a6100de3bf19a4dc59f467e53ff4a7d64f",
    leaderUsername: "buatmakan.5613",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 5,
        wdd: {
          amount: "3778",
          transactionHash:
            "0x9e7e648865649033ecbaec334e0892a733eb5a82128ddab7fcd9bb3205ecd622",
        },
        wld: {
          amount: "1.93",
          transactionHash:
            "0xa79f114eebe13eff5cd76c6d0ee65629543ec17ce4869ca65df3d9d39bfe981c",
        },
      },
      {
        weekNumber: 6,
        wdd: {
          amount: "3640",
          transactionHash:
            "0xd350226b502d0f48f178d9608b6635abeba8df58ab676ea7d5a51244b72ecb7e",
        },
        wld: {
          amount: "1.86",
          transactionHash:
            "0xfab2dbb9d50f5c6749569f6efbd70232dcab9f3335a04947b76c193c06b0b01a",
        },
      },
      {
        weekNumber: 7,
        wdd: {
          amount: "3525",
          transactionHash:
            "0xd3d25a5c27400f1f9e087a50bc3d2dd8937cabb89bfeb1b480aeff6df87498b3",
        },
        wld: {
          amount: "2.47",
          transactionHash:
            "0x7e270eb9f35e87b1991e5b10293723e84afc699e025d58de34d33fdb3baa7798",
        },
      },
    ],
  },
  {
    id: 8088,
    name: "Gratis 999.999 WLD💰🪙✅",
    leaderAddress: "0xd6b5d77bd14ce9f21959cb64c24eeeab6f4aac34",
    leaderUsername: "nabary.2834",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 5,
        wdd: {
          amount: "3755",
          transactionHash:
            "0x7d10ccd221c72690fb5a658cac0bde5af62520dcd7b9d25800e198c6c092ea75",
        },
        wld: {
          amount: "1.92",
          transactionHash:
            "0x75c4c0310d78e03381e06b30c685aa302d2236a59a1ddc34bf82663fd306db04",
        },
      },
      {
        weekNumber: 6,
        wdd: {
          amount: "3863",
          transactionHash:
            "0x133f98a756894b5002fae35573420add2190bcf55684e95145c392f8a27475e6",
        },
        wld: {
          amount: "1.97",
          transactionHash:
            "0x58378e0aa079090334dcd110493b8f4e2dfc003a394618b76eed9f2e8b408984",
        },
      },
      {
        weekNumber: 7,
        wdd: {
          amount: "4475",
          transactionHash:
            "0xc98b52e34f7916e00d3e724fd2936a616950ff131818bb176d67d6dc000f8e77",
        },
        wld: {
          amount: "3.14",
          transactionHash:
            "0xe39b4a80dbb6110d2008797bd5a5382eba0cd553d970f616c5c30668687aab5c",
        },
      },
    ],
  },
  {
    id: 7316,
    name: "💰🤑 500.000 WLD GRATIS 🤑💰",
    leaderAddress: "0x2f19d415ff9b1a319acdb6482e32ce98140aab57",
    leaderUsername: "siriusdead.7700",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 5,
        wdd: {
          amount: "3477",
          transactionHash:
            "0xfc32f1d877dff81efbc2999422995b6db77e22d9aeb7714c02bc498a1804cde0",
        },
        wld: {
          amount: "1.77",
          transactionHash:
            "0x0abaeb7832c426f2b82d005e7da8e4292aba6ad3422c5290ff866414fa123f02",
        },
      },
      {
        weekNumber: 6,
        wdd: {
          amount: "3375",
          transactionHash:
            "0x2fe5a12a8c98660f11277eb5d1fa5b4e22b7c9d54e7bcc7f59cc58b7e9a5fccf",
        },
        wld: {
          amount: "1.72",
          transactionHash:
            "0x7d9be1ee8ffd556418cc3f394e8bd23a282bdb5fb37e25e7ec5085eb8408ad3d",
        },
      },
    ],
  },
  {
    id: 6930,
    name: "Get free 275.000 wdd, Join now",
    leaderAddress: "0x67309d8d393d0b8e97387b7e1390a7bb94bdd57d",
    leaderUsername: "biano.8957",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 5,
        wdd: {
          amount: "3380",
          transactionHash:
            "0x95f1474e70bbc41e3045a89942d4b9f542ebfd759898fe2b24ee7bec913418bf",
        },
        wld: {
          amount: "1.73",
          transactionHash:
            "0xf0a28be7cf5ed6ae90892189633ac462047e96c6ef87faaa125dfea7542e3219",
        },
      },
    ],
  },
  {
    id: 7898,
    name: "💰 Claim Gratis 870.000 WLD 💷🎁✅",
    leaderAddress: "0x2763957a15d4dea7fc6f9c421d8e41b6ba7205c8",
    leaderUsername: "ashleyyy69",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 6,
        wdd: {
          amount: "5767",
          transactionHash:
            "0xf97724592094605cac709ee1bb66384cd0236eefa214780a121df46629faef63",
        },
        wld: {
          amount: "2.94",
          transactionHash:
            "0xbfe7a9bfcc48c06415f094c4d79990ea1ef22a8b0744b20204e6880ab8dae444",
        },
      },
      {
        weekNumber: 7,
        wdd: {
          amount: "5346",
          transactionHash:
            "0xdc456263da5ef10bb646c5fa00e8ac36c5d8af85f1206f2b011c710a50d5d591",
        },
        wld: {
          amount: "3.75",
          transactionHash:
            "0xc665ce05175494e674becd31ce23b7093c318b1fc18cbfd14bc9d7cd06d4657d",
        },
      },
    ],
  },
  {
    id: 7735,
    name: "🥳GRATIS WDD+WLD SETIAP MINGGU GABUNG SEKARANG UNTUK MENIKMATI HADIAHNYA 🤑 FREE WDD+WLD EVERY WEEK 💰 WDD+WLD MIỄN PHÍ MỖI TUẦN 🎊 WDD+WLD GRATIS TODAS LAS SEMANAS 🎉 TOTAL 250.000 WDD + 10.000 WLD 🎁",
    leaderAddress: "0x87536a0ee32a6f5c9f50cf4ec4f8dbbe2e2ef213",
    leaderUsername: "alfian17",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 6,
        wdd: {
          amount: "3980",
          transactionHash:
            "0x5d4a133b5094140cd44324d4463310d94c99d07c33756e97c858068e04cbb326",
        },
        wld: {
          amount: "2.03",
          transactionHash:
            "0x8a63d158648c2a6b5f72436ef06a026bee48139700e76dd20a5573178245ae87",
        },
      },
      {
        weekNumber: 7,
        wdd: {
          amount: "3853",
          transactionHash:
            "0x5863415dbfd053169e8ffc08850e9495094fc78e7e96e1598266ed9decba5484",
        },
        wld: {
          amount: "2.71",
          transactionHash:
            "0x995bac5c0429d7ac0b2eb321f23f8abd144700d0457bd644e39e4f55764ca279",
        },
      },
    ],
  },
  {
    id: 7703,
    name: "💰AIR DROP +50$WLD ✅ 50.000 FREE $CDT🤑",
    leaderAddress: "0x04ee1c4a93e7d63114147dcf700ad7bd62f178e4",
    leaderUsername: "bares.1996",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 6,
        wdd: {
          amount: "3704",
          transactionHash:
            "0x0cad03024ff63c41e2ca4b709824fe673c7c6c3e30bd1d98bb06fdff5371031e",
        },
        wld: {
          amount: "1.89",
          transactionHash:
            "0x1d9c782ea21a39c319e42400bc6b4ebc1faf186693d9ae57b19ccab5109b88bf",
        },
      },
      {
        weekNumber: 7,
        wdd: {
          amount: "3535",
          transactionHash:
            "0x4a400a46bd2a9329f1a2e886254ad1133fb3f60a6f1afcf6c829eade00c34e10",
        },
        wld: {
          amount: "2.48",
          transactionHash:
            "0x4f8963417af73ca2c0d061e2e9fd7437b6f866b00e526b90ae5789a5961d3680",
        },
      },
    ],
  },
  {
    id: 8010,
    name: "Gratis 250.000 WLD✅💰🪙",
    leaderAddress: "0x23e56889205f6a0a48abfe28a6038a07b10d33d9",
    leaderUsername: "zagoanzzz.6234",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 6,
        wdd: {
          amount: "3577",
          transactionHash:
            "0x9bf357529fa3e18bd6d36fc5fac3f19d52e1b5d77d784009821874da785e6909",
        },
        wld: {
          amount: "1.82",
          transactionHash:
            "0xd11a862c5b6e06642abb0a0a84fcd4de5d5a43f08bbc68f152b142ce7e226ff0",
        },
      },
      {
        weekNumber: 7,
        wdd: {
          amount: "3863",
          transactionHash:
            "0x3da421185fc7c2b930a17e45344eba08a4733fd8217e1b4bd897e178bb1caea1",
        },
        wld: {
          amount: "2.71",
          transactionHash:
            "0x792f6a3136c5b8881a31f808fc92231d58320210c15f92d8fa7766ab127420f5",
        },
      },
    ],
  },
  {
    id: 8056,
    name: "Klaim Gratis 1.000.000.000 WLD Setiap Minggu💰🎁🪙",
    leaderAddress: "0x73a37e0074ea209cf39dd3cc800ffe83c30b7635",
    leaderUsername: "bela.3427",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 6,
        wdd: {
          amount: "3487",
          transactionHash:
            "0x683fb0652dfbf28702f6d351ec066e7348e0abc1d89214f394ac8c5651552b78",
        },
        wld: {
          amount: "1.78",
          transactionHash:
            "0xee4474701900ceb8224589664af306e3c70b092d2278517bd3afd873b2d1d0db",
        },
      },
      {
        weekNumber: 7,
        wdd: {
          amount: "4212",
          transactionHash:
            "0xd7200d8856c4ff26ee1e51e3b55597324dcd02f753431792e4ed70a2d63cdad2",
        },
        wld: {
          amount: "2.96",
          transactionHash:
            "0x0d12cb627e8c5ceee5ed35baef13a654c9415ded15632c8bfb5fa3637b2d797d",
        },
      },
    ],
  },
  {
    id: 7568,
    name: "🔹250.000 WLD ++ GRATIS",
    leaderAddress: "0x022c83c4ecc5b7a1edbaa6c4aaa901d37fb31ca8",
    leaderUsername: "eldizer.8331",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 6,
        wdd: {
          amount: "3481",
          transactionHash:
            "0xac53a2c4a6c2825abefa98e7dabbbf6b4c2204e5450d2733bd42d4b225729817",
        },
        wld: {
          amount: "1.77",
          transactionHash:
            "0x35c37cd2d12e7491655f802ee7828a37a8fd05af9943ccafb3af0b597529f782",
        },
      },
    ],
  },
  {
    id: 7980,
    name: "💰AIR DROP +50$WLD ✅ 10.000 FREE $ORO🤑",
    leaderAddress: "0x4e9dd0dbef7ceb170ac707fe980b860d292f7e55",
    leaderUsername: "deshini",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 6,
        wdd: {
          amount: "3476",
          transactionHash:
            "0x1be6e07808ddbb68c7f190f5752505a353b739e2ec9ca65212e89ef43cd0545d",
        },
        wld: {
          amount: "1.77",
          transactionHash:
            "0x105813dc3f94066eae21b234d45c3a6adb710c65c585645993f8225b8b4f5531",
        },
      },
      {
        weekNumber: 7,
        wdd: {
          amount: "3739",
          transactionHash:
            "0x9d4098fcdb0dd24d6e87e29c3534476fb309aa0f242c974223209867862e0ae3",
        },
        wld: {
          amount: "2.62",
          transactionHash:
            "0x8b6182dd879adf6748c138be3c80c9fd8c1ad5d22d058910fa8bbb5ab9ed9bea",
        },
      },
    ],
  },
  {
    id: 7812,
    name: "FREE 250.000 WDD🪙EVERY WEEK.JOIN TO CREW PARTY🤜🏻🤛",
    leaderAddress: "0x63d572b8bd80a8c0a99f1ce94201fa097bd33eda",
    leaderUsername: "a2627j",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 6,
        wdd: {
          amount: "3460",
          transactionHash:
            "0x862822fc1c9734144902d83c91ada58d5a0b962e1c0167d98ff39659f004d5b4",
        },
        wld: {
          amount: "1.76",
          transactionHash:
            "0x5d3022cfd6ed12110dcef8e8a65d653dfb94a9100d188e10bc37c35f1dcf2ce7",
        },
      },
    ],
  },
  {
    id: 8219,
    name: "Gratis 1.000.000 WLD✅💰🪙",
    leaderAddress: "0x12c38e630e097aca66c402b71c59019ce0485f48",
    leaderUsername: "sodikin.5379",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 7,
        wdd: {
          amount: "4898",
          transactionHash:
            "0x0cc87d968cef1a84596e275d75bc83f89450cedc15b601ea15ac9b8665a618af",
        },
        wld: {
          amount: "3.44",
          transactionHash:
            "0xad6e21056a9b781970233423547139c4fb0db6ec16aeb51291617da67e21f24a",
        },
      },
    ],
  },
  {
    id: 8090,
    name: "💰 Claim Gratis 870.000 WLD 💷🎁✅",
    leaderAddress: "0xacde720c577204d39efc89f8cc24026f333b5893",
    leaderUsername: "jhonmndzzz",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 7,
        wdd: {
          amount: "4102",
          transactionHash:
            "0xaf8968f9f815d86c2276b7ff6bbe80b6ba57432425a2a12c83c7032e517d9a18",
        },
        wld: {
          amount: "2.88",
          transactionHash:
            "0xf60369ad69d0b2f615a1d17ab2ca343f128c088531e4fefcd04990d25572b604",
        },
      },
    ],
  },
  {
    id: 8163,
    name: "💰 Claim Gratis 1.000.000 WLD 💷🎁✅",
    leaderAddress: "0xaa1eee936f8b86743483a65ea5bb60781e6a799e",
    leaderUsername: "mahlil1952",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 7,
        wdd: {
          amount: "4097",
          transactionHash:
            "0x896b05aeeccb0987d6202190acd4b2dee8c7b15577721f8111504529d67459f7",
        },
        wld: {
          amount: "2.88",
          transactionHash:
            "0x94fbce5c0a90ea5992bcb8c04251d80e8e55ec2b98d80955d522fd8219d4119f",
        },
      },
    ],
  },
  {
    id: 8108,
    name: "GRATIS 1.000.000 WLD SEMANAL",
    leaderAddress: "0x6c0ba7daa1dc356acbfd0a1906538512238a67ed",
    leaderUsername: "andry.3511",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 7,
        wdd: {
          amount: "3540",
          transactionHash:
            "0x48cbd069a165dadc5c10506ad362f684fe652de653c6bb7a4557a94ca2394a98",
        },
        wld: {
          amount: "2.48",
          transactionHash:
            "0xd476b85f0c4c72ccfb96999c8a037b14e9cf1732b538e28bde384c5f2358e8fd",
        },
      },
    ],
  },
  {
    id: 7996,
    name: "FREE 250.000 WDD🪙EVERY WEEK.JOIN TO DRC PARTY🏦",
    leaderAddress: "0x9c2b216791c2006b433ae4475b21aad81ee5a5a2",
    leaderUsername: "yunus.2992",
    get totalWdd() {
      return calculateTotal(this.weeklyPayouts, "wdd");
    },
    get totalWld() {
      return calculateTotal(this.weeklyPayouts, "wld");
    },
    weeklyPayouts: [
      {
        weekNumber: 7,
        wdd: {
          amount: "3475",
          transactionHash:
            "0xc6fad6c5b287180ccc45b4b7e4b104a9780c03cdb7dfad8cb099da7a691525f9",
        },
        wld: {
          amount: "2.44",
          transactionHash:
            "0xeee816bc7bfe9e448b5d8589ad1edbd2c9578562e8c45c489d5836821d41c3ee",
        },
      },
    ],
  },
];
