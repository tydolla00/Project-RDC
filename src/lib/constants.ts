import { getAllGames } from "../../prisma/lib/games";
import { getAllMembers } from "../../prisma/lib/members";

export const getMembersNav = async () => {
  const members = await getAllMembers();

  const navMembers: {
    alt: string;
    name: string;
    navName: string;
    url: string;
    src: string;
    desc: string;
    stats: { prop: string; val: string }[];
  }[] = members.map((member) => {
    const memberKey = member.playerName.toLowerCase();
    console.log(memberKey);
    const rdcMember = RDCMembers.get(memberKey)!;
    return {
      alt: rdcMember.nav.alt,
      name: member.playerName,
      navName: rdcMember.nav.name,
      url: rdcMember.nav.url,
      src: rdcMember.nav.src,
      desc: rdcMember.desc,
      stats: rdcMember.stats,
    };
  });
  return navMembers;
};

// TODO Replace src with player avatars
export const RDCMembers = new Map<string, MembersProps>([
  [
    "mark",
    {
      nav: {
        alt: "RDC Mark",
        name: "Cash Money Mawk",
        url: "/members/mark",
        src: "https://static.wikia.nocookie.net/rdcworld1/images/f/f2/Mark-Phillips.jpg/revision/latest/thumbnail/width/360/height/450?cb=20191004005953",
      },
      desc: "Director, animator, Mark is the founder and creator of RDC. He is one of the better gamers in RDC and plays as such.",
      stats: [
        { prop: "Best Rocket League Player", val: "#1" },
        { prop: "Dragon Ball Sparking Zero", val: "#2" },
        { prop: "Scariest Gamer", val: "Most deaths in Lethal Company" },
      ],
    },
  ],
  [
    "ipi",
    {
      nav: { alt: "Ipi", name: "Iceman Ip", url: "/members/ipi", src: "" },
      desc: "Ipi is a newcomer in the eyes of RDC, while not yet an official member of RDC yet, one can assume that it's only a matter of time as he has been beating down the crew in Golf and Mario Kart.",
      stats: [
        { prop: "", val: "" },
        { prop: "", val: "" },
        { prop: "", val: "" },
      ],
    },
  ],
  [
    "john",
    {
      nav: { alt: "RDC John", name: "John", url: "/members/john", src: "" },
      desc: "If you've ever seen or been to DreamCon, this man has had a hand in it. Don't let his sorry gaming skills fool you, John is very valuable in the backend and his contributions should not go unnoticed. Don't forget his immaculate singing ability, John is clearly the best singer in RDC.",
      stats: [
        { prop: "", val: "" },
        { prop: "", val: "" },
        { prop: "", val: "" },
      ],
    },
  ],
  [
    "aff",
    {
      nav: {
        alt: "RDC Aff",
        name: "Aff",
        url: "/members/aff",
        src: "https://static.wikia.nocookie.net/rdcworld1/images/f/f7/DtlKwRJW4AI3qrN_Aff.jpg/revision/latest?cb=20191004012842",
      },
      desc: "Aff and his turtle bring a lot to RDC. Give aff for giving us all the laughs, memes, and behind the scenes work that he contributes to.",
      stats: [
        { prop: "", val: "" },
        { prop: "", val: "" },
        { prop: "", val: "" },
      ],
    },
  ],
  [
    "lee",
    {
      nav: {
        alt: "RDC Leland",
        name: "Meland",
        url: "/members/lee",
        src: "https://static.wikia.nocookie.net/rdcworld1/images/e/ee/Leland-manigo-image.jpg/revision/latest?cb=20240119040253",
      },
      desc: "I love it when you talk to me, my cash machine, my cash machine. The old man laugh always get us. While Leland is really sorry at most games, don't try to play him in any fighting game. You are most likely to get beat up.",
      stats: [
        { prop: "", val: "" },
        { prop: "", val: "" },
        { prop: "", val: "" },
      ],
    },
  ],
  [
    "dylan",
    {
      nav: {
        alt: "RDC Dylan",
        name: "The Big Dyl",
        src: "",
        url: "/members/dylan",
      },
      desc: "The tech guru, the thriller in manilla, el luchador. Dylan is a huge component in the puzzle that is RDC. The flawless streams are thanks to Dylan. He is one of the top gamers in the group although recently he has been falling lower in the ranking of rdc members.",
      stats: [
        { prop: "", val: "" },
        { prop: "", val: "" },
        { prop: "", val: "" },
      ],
    },
  ],
  [
    "ben",
    {
      nav: {
        alt: "RDC Ben",
        name: "LaBen James",
        url: "/members/ben",
        src: "https://static.wikia.nocookie.net/rdcworld1/images/0/0a/Ben.jpg/revision/latest?cb=20240119050707",
      },
      desc: "Ben is a very average gamer. Somethings he is good at and other's hes not. It's hard to explain. Ben gets it done. He works well and if he leaves again he's dead to us.",
      stats: [
        { prop: "", val: "" },
        { prop: "", val: "" },
        { prop: "", val: "" },
      ],
    },
  ],
  [
    "des",
    {
      nav: {
        alt: "RDC Des",
        name: "Big Booty Des",
        url: "/members/des",
        src: "https://static.wikia.nocookie.net/rdcworld1/images/6/62/Desmond-johnson-4.jpg/revision/latest?cb=20191004011638",
      },
      desc: "How greeeeeeeat is our God. Ranking as the 2nd best singer in RDC Desmond is surprisingly a very good gamer. You would think the dementia would affect Des but the rage and enthusiasm he plays with always uplifts him in the end. Also Desmond, how is Crystal?",
      stats: [
        { prop: "", val: "" },
        { prop: "", val: "" },
        { prop: "", val: "" },
      ],
    },
  ],
]);

export const getGamesNav = async () => {
  const games = await getAllGames();

  const navGames: {
    alt?: string;
    name: string;
    url: string;
    src?: string;
    desc?: string;
  }[] = games.map((game) => {
    const gameKey = game.gameName.replace(/\s/g, "").toLowerCase();
    return {
      alt: game.gameName,
      desc: gamesNav.get(gameKey) || "",
      name: game.gameName,
      url: `/games/${gameKey}`,
      src: `/images/${gameImages[gameKey as keyof typeof gameImages]}`,
    };
  });
  navGames.push({ name: "Browse all games", url: "/games" });
  return navGames;
};

// create a map of games to their respective descriptions
const gamesNav = new Map<string, string>([
  ["rocketleague", "Stats from the most intense 3v3 battles."],
  ["lethalcompany", "Stats that tell you who touches the most paper."],
  ["callofduty", "Stats for FFA's and who sells the most online."],
  ["mariokart8", "Stats that tell you who races the hardest."],
  ["speedrunners", "Stats that tell you who races the hardest."],
]);

export const gameImages = {
  rocketleague: "rocketleague.png",
  lethalcompany: "lethalcompany.jpg",
  mariokart8: "mk8.jpg",
  speedrunners: "speedrunners.jpeg",
  callofduty: "callofduty.jpeg",
};

export enum errorCodes {
  NotAuthenticated = "Not Authenticated",
}

type MembersProps = {
  desc: string;
  nav: { alt: string; name: string; url: string; src: string };
  stats: { prop: string; val: string }[]; // TODO: Grab stats from database
};
