export const RDCMembers = new Map<string, MembersProps>([
  [
    "Mark",
    {
      nav: {
        alt: "RDC Mark",
        name: "Cash Money Mawk",
        url: "/members/mark",
        src: "https://static.wikia.nocookie.net/rdcworld1/images/f/f2/Mark-Phillips.jpg/revision/latest/thumbnail/width/360/height/450?cb=20191004005953",
      },
      desc: "Director, animator, Mark is the founder and creator of RDC. He is one of the better gamers in RDC and plays as such.",
      stat1: { prop: "Best Rocket League Player", val: "#1" },
      stat2: { prop: "Dragon Ball Sparking Zero", val: "#2" },
      stat3: { prop: "Scariest Gamer", val: "Most deaths in Lethal Company" },
    },
  ],
  [
    "Ippi",
    {
      nav: { alt: "Ippi", name: "Iceman Ip", url: "/members/ippi", src: "" },
      desc: "Ippi is a newcomer in the eyes of RDC, while not yet an official member of RDC yet, one can assume that it's only a matter of time as he has been beating down the crew in Golf and Mario Kart.",
      stat1: { prop: "", val: "" },
      stat2: { prop: "", val: "" },
      stat3: { prop: "", val: "" },
    },
  ],
  [
    "John",
    {
      nav: { alt: "RDC John", name: "John", url: "/members/john", src: "" },
      desc: "If you've ever seen or been to Dreamcon, this man has had a hand in it. Don't let his sorry gaming skills fool you, John is very valuable in the backend and his contributions should not go unnoticed. Don't forget his immaculate singing ability, John is clearly the best singer in RDC.",
      stat1: { prop: "", val: "" },
      stat2: { prop: "", val: "" },
      stat3: { prop: "", val: "" },
    },
  ],
  [
    "Aff",
    {
      nav: {
        alt: "RDC Aff",
        name: "Aff",
        url: "/members/aff",
        src: "https://static.wikia.nocookie.net/rdcworld1/images/f/f7/DtlKwRJW4AI3qrN_Aff.jpg/revision/latest?cb=20191004012842",
      },
      desc: "Aff and his turtle bring a lot to RDC. Give aff for giving us all the laughs, memes, and behind the scenes work that he contributes to.",
      stat1: { prop: "", val: "" },
      stat2: { prop: "", val: "" },
      stat3: { prop: "", val: "" },
    },
  ],
  [
    "Leland",
    {
      nav: {
        alt: "RDC Leland",
        name: "Meland",
        url: "/members/leland",
        src: "https://static.wikia.nocookie.net/rdcworld1/images/e/ee/Leland-manigo-image.jpg/revision/latest?cb=20240119040253",
      },
      desc: "I love it when you talk to me, my cash machine, my cash machine. The old man laugh always get us. While Leland is really sorry at most games, don't try to play him in any fighting game. You are most likely to get beat up.",
      stat1: { prop: "", val: "" },
      stat2: { prop: "", val: "" },
      stat3: { prop: "", val: "" },
    },
  ],
  [
    "Dylan",
    {
      nav: {
        alt: "RDC Dylan",
        name: "The Big Dyl",
        src: "",
        url: "/members/dylan",
      },
      desc: "The tech guru, the thriller in manilla, el luchador. Dylan is a huge component in the puzzle that is RDC. The flawless streams are thanks to Dylan. He is one of the top gamers in the group although recently he has been falling lower in the ranking of rdc members.",
      stat1: { prop: "", val: "" },
      stat2: { prop: "", val: "" },
      stat3: { prop: "", val: "" },
    },
  ],
  [
    "Ben",
    {
      nav: {
        alt: "RDC Ben",
        name: "LaBen James",
        url: "/members/ben",
        src: "https://static.wikia.nocookie.net/rdcworld1/images/0/0a/Ben.jpg/revision/latest?cb=20240119050707",
      },
      desc: "Ben is a very average gamer. Somethings he is good at and other's hes not. It's hard to explain. Ben gets it done. He works well and if he leaves again he's dead to us.",
      stat1: { prop: "", val: "" },
      stat2: { prop: "", val: "" },
      stat3: { prop: "", val: "" },
    },
  ],
  [
    "Desmond",
    {
      nav: {
        alt: "RDC Des",
        name: "Big Booty Des",
        url: "/members/des",
        src: "https://static.wikia.nocookie.net/rdcworld1/images/6/62/Desmond-johnson-4.jpg/revision/latest?cb=20191004011638",
      },
      desc: "How greeeeeeeat is our God. Ranking as the 2nd best singer in RDC Desmond is surprisingly a very good gamer. You would think the dementia would affect Des but the rage and enthusiasm he plays with always uplifts him in the end. Also Desmond, how is Crystal?",
      stat1: { prop: "", val: "" },
      stat2: { prop: "", val: "" },
      stat3: { prop: "", val: "" },
    },
  ],
]);

export const games: { desc?: string; url: string; name: string }[] = [
  {
    desc: "Stats from the most intense 3v3 battles.",
    url: "/games/rocketleague",
    name: "Rocket League",
  },
  {
    desc: "Stats that tell you who touches the most paper.",
    url: "/games/lethalcompany",
    name: "Lethal Company",
  },
  {
    desc: "Stats for FFA's and who sells the most online.",
    url: "/games/callofduty",
    name: "Call of Duty",
  },
  {
    desc: "Stats that tell you who races the hardest.",
    url: "/games/mariokart",
    name: "Mario Kart",
  },
  {
    desc: "Stats that tell you who races the hardest.",
    url: "/games/speedrunners",
    name: "Speedrunners",
  },
  {
    url: "/games",
    name: "Browse all games",
  },
];

export const gameImages = {
  rocketleague: "rocketleague.png",
  lethalcompany: "lethalcompany.jpg",
  mariokart: "mk8.jpg",
  speedrunners: "speedrunners.jpeg",
  callofduty: "callofduty.jpeg",
};

export const playerAvatarMap = new Map<string, string>([
  ["Mark", "mark_rdc.jpg"],
  ["Dylan", "dylan_rdc.jpg"],
  ["Ben", "ben_rdc.jpg"],
  ["Lee", "leland_rdc.jpg"],
  ["Des", "desmond_rdc.jpg"],
  ["John", "john_rdc.jpg"],
  ["Aff", "aff_rdc.jpg"],
  ["Ipi", "ipi_rdc.jpg"],
]);

type MembersProps = {
  desc: string;
  nav: { alt: string; name: string; url: string; src: string };
  stat1: { prop: string; val: string };
  stat2: { prop: string; val: string };
  stat3: { prop: string; val: string };
};
