import ListItem from "@/components/ui/ListItem/ListItem";
import { Typography } from "@/components/ui/Typography";
import { BiLinkExternal } from "react-icons/bi";

const menuSections = [
  {
    title: "CONNECT",
    links: [
      { label: "Telegram", url: "https://t.me/worldrepublicannouncements" },
      { label: "X", url: "https://x.com/WorldRepublicEN" },
    ],
  },
  {
    title: "DOCS",
    links: [
      {
        label: "Community docs",
        url: "https://github.com/worldrepublicorg/docs",
      },
      {
        label: "Operating manual",
        url: "https://github.com/worldrepublicorg/governing-documents/blob/main/manual.md",
      },
    ],
  },
  {
    title: "CODE",
    links: [
      { label: "App", url: "https://github.com/worldrepublicorg/mini-app" },
      {
        label: "Smart contracts",
        url: "https://github.com/worldrepublicorg/smart-contracts",
      },
    ],
  },
] as const;

export default function MenuPage() {
  return (
    <div className="flex flex-col px-6 pb-24">
      <div className="pt-6 pb-4 bg-white">
        <Typography as="h2" variant={{ variant: "heading", level: 2 }}>
          Menu
        </Typography>
      </div>

      <div>
        {menuSections.map((section) => (
          <div key={section.title} className="mt-6">
            <div className="flex mb-4">
              <Typography
                as="h3"
                variant={{ variant: "heading", level: 3 }}
                className="text-gray-500 text-base"
              >
                {section.title}
              </Typography>
            </div>

            <div className="space-y-4">
              {section.links.map((link) => (
                <div key={link.label} className="flex">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <ListItem>
                      <div className="flex items-center justify-between w-full h-8">
                        <Typography
                          as="span"
                          variant={{ variant: "subtitle", level: 2 }}
                          className="text-gray-900"
                        >
                          {link.label}
                        </Typography>
                        <BiLinkExternal className="size-5 text-gray-400" />
                      </div>
                    </ListItem>
                  </a>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
