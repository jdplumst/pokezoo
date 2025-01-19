import "server-only";

import { cookies } from "next/headers";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const themeSchema = z.enum(["blue", "purple", "green", "orange"]);

export async function getTheme() {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value ?? "blue";
  const result = themeSchema.safeParse(theme);
  const parsedTheme = result.data ?? "blue";
  return parsedTheme;
}

export async function setTheme(theme: string) {
  const result = themeSchema.safeParse(theme);
  const parsedTheme = result.data ?? "blue";
  const cookieStore = await cookies();
  cookieStore.set("theme", parsedTheme);
  revalidatePath("/settings");
}

export async function getTime() {
  const cookieStore = await cookies();
  const timezone = cookieStore.get("timezone-offset")?.value || "-5";
  const parsedTimezone = Math.floor(Number(timezone)) || -5;
  const hour = new Date().getUTCHours() + parsedTimezone;
  console.log(hour);
  let time: "day" | "night" = "day";
  if (hour < 6 || hour > 17) {
    time = "night";
  }
  return time;
}

export async function getTimezone() {
  const cookieStore = await cookies();
  let timezone =
    cookieStore.get("timezone")?.value ||
    "Eastern Standard Time (North America) [EST -5]";
  const isRealTimezone = timezones.findIndex((t) => t.name === timezone);
  if (isRealTimezone === -1) {
    timezone = "Eastern Standard Time (North America) [EST -5]";
  }
  return timezone;
}

export async function setTimezone(timezone: string, offset: string) {
  const cookieStore = await cookies();
  cookieStore.set("timezone", timezone);
  cookieStore.set("timezone-offset", offset);
  revalidatePath("/settings");
}

export const timezones = [
  {
    name: "Baker Island Time [BIT -12]",
    offset: "-12",
  },
  {
    name: "Samoa Standard Time [SST -11]",
    offset: "-11",
  },
  {
    name: "Hawaii-Aleutian Standard Time [HAST -10]",
    offset: "-10",
  },
  {
    name: "Cook Island Time [CKT -10]",
    offset: "-10",
  },
  {
    name: "Tahiti Time [TAHT -10]",
    offset: "-10",
  },
  {
    name: "Marquesas Islands Time [MIT -9:30]",
    offset: "-9.5",
  },
  {
    name: "Gambier Island Time [GIT -9]",
    offset: "-9",
  },
  {
    name: "Alaska Standard Time [AKST -9]",
    offset: "-9",
  },
  {
    name: "Clipperton Island Standard Time [CIST -8]",
    offset: "-8",
  },
  {
    name: "Pacific Standard Time (North America) [PST -8]",
    offset: "-8",
  },
  {
    name: "Pacific Daylight Time (North America) [PDT -7]",
    offset: "-7",
  },
  {
    name: "Mountain Standard Time (North America) [MST -7]",
    offset: "-7",
  },
  {
    name: "Mountain Daylight Time (North America) [MDT -6]",
    offset: "-6",
  },
  {
    name: "Central Standard Time (North America) [CST -6]",
    offset: "-6",
  },
  {
    name: "Galapagos Time [GALT -6]",
    offset: "-6",
  },
  {
    name: "Easter Island Standard Time [EAST -6]",
    offset: "-6",
  },
  {
    name: "Eastern Standard Time (North America) [EST -5]",
    offset: "-5",
  },
  {
    name: "Ecuador Time [ECT -5]",
    offset: "-5",
  },
  {
    name: "Colombia Time [COT -5]",
    offset: "-5",
  },
  {
    name: "Central Daylight Time (North America) [CDT -5]",
    offset: "-5",
  },
  {
    name: "Venezuelan Standard Time [VET -4:30]",
    offset: "-4.5",
  },
  {
    name: "Eastern Caribbean Time [ECT -4]",
    offset: "-4",
  },
  {
    name: "Eastern Daylight Time (North America) [EDT -4]",
    offset: "-4",
  },
  {
    name: "Atlantic Standard Time [AST -4]",
    offset: "-4",
  },
  {
    name: "Guyana Time [GYT -4]",
    offset: "-4",
  },
  {
    name: "Falkland Islands Standard Time [FKST -4]",
    offset: "-4",
  },
  {
    name: "Bolivia Time [BOT -4]",
    offset: "-4",
  },
  {
    name: "Colombia Summer Time [COST -4]",
    offset: "-4",
  },
  {
    name: "Chile Standard Time [CLT -4]",
    offset: "-4",
  },
  {
    name: "Newfoundland Time [NT -3:30]",
    offset: "-3.5",
  },
  {
    name: "Uruguay Standard Time [UYT -3]",
    offset: "-3",
  },
  {
    name: "Chile Summer Time [CLST -3]",
    offset: "-3",
  },
  {
    name: "Argentina Time [ART -3]",
    offset: "-3",
  },
  {
    name: "Brasilia Time [BRT -3]",
    offset: "-3",
  },
  {
    name: "French Guiana Time [GFT -3]",
    offset: "-3",
  },
  {
    name: "Newfoundland Daylight Time [NDT -2:30]",
    offset: "-2.5",
  },
  {
    name: "Uruguay Summer Time [UYST -2]",
    offset: "-2",
  },
  {
    name: "South Georgia & South Sandwich Islands [GST -2]",
    offset: "-2",
  },
  {
    name: "Cape Verde Time [CVT -1]",
    offset: "-1",
  },
  {
    name: "Azores Standard Time [AZOST -1]",
    offset: "-1",
  },
  {
    name: "Coordinated Universal Time [UTC 0]",
    offset: "0",
  },
  {
    name: "Western European Time [WET 0]",
    offset: "0",
  },
  {
    name: "Greenwich Mean Time [GMT 0]",
    offset: "0",
  },
  {
    name: "West Africa Time [WAT +1]",
    offset: "1",
  },
  {
    name: "Central European Time [CET +1]",
    offset: "1",
  },
  {
    name: "British Summer Time [BST +1]",
    offset: "1",
  },
  {
    name: "Western European Summer Time [WEST +1]",
    offset: "1",
  },
  {
    name: "Mitteleuropaische Zeit (German) [MEZ +1]",
    offset: "1",
  },
  {
    name: "GTB Standard Time (Greece, Turkey, Bulgaria) [GTB +2]",
    offset: "2",
  },
  {
    name: "Israel Standard Time [IST +2]",
    offset: "2",
  },
  {
    name: "FLE Standard Time (Finland, Lithuania, Estonia) [FLE +2]",
    offset: "2",
  },
  {
    name: "South African Standard Time [SAST +2]",
    offset: "2",
  },
  {
    name: "Central Africa Time [CAT +2]",
    offset: "2",
  },
  {
    name: "Eastern European Time [EET +2]",
    offset: "2",
  },
  {
    name: "Central European Summer Time [CEST +2]",
    offset: "2",
  },
  {
    name: "Arabic Standard Time (Baghdad) [AST +3]",
    offset: "3",
  },
  {
    name: "Moscow Standard Time [MSK +3]",
    offset: "3",
  },
  {
    name: "East Africa Time [EAT +3]",
    offset: "3",
  },
  {
    name: "Arab Standard Time (Kuwait, Riyadh) [AST +3]",
    offset: "3",
  },
  {
    name: "Eastern European Summer Time [EEST +3]",
    offset: "3",
  },
  {
    name: "Iran Standard Time [IRST +3:30]",
    offset: "3.5",
  },
  {
    name: "Armenia Time [AMT +4]",
    offset: "4",
  },
  {
    name: "Arabian Standard Time (Abu Dhabi, Muscat) [AST +4]",
    offset: "4",
  },
  {
    name: "Mauritius Time [MUT +4]",
    offset: "4",
  },
  {
    name: "Seychelles Time [SCT +4]",
    offset: "4",
  },
  {
    name: "Reunion Time [RET +4]",
    offset: "4",
  },
  {
    name: "Samara Time [SAMT +4]",
    offset: "4",
  },
  {
    name: "Azerbaijan Time [AZT +4]",
    offset: "4",
  },
  {
    name: "Georgia Standard Time [GET +4]",
    offset: "4",
  },
  {
    name: "Afghanistan Time [AFT +4:30]",
    offset: "4.5",
  },
  {
    name: "Armenia Summer Time [AMST +5]",
    offset: "5",
  },
  {
    name: "Pakistan Standard Time [PKT +5]",
    offset: "5",
  },
  {
    name: "Heard and McDonald Islands Time [HMT +5]",
    offset: "5",
  },
  {
    name: "Yekaterinburg Time [YEKT +5]",
    offset: "5",
  },
  {
    name: "Sri Lanka Time [SLT +5:30]",
    offset: "5.5",
  },
  {
    name: "India Standard Time [IST +5:30]",
    offset: "5.5",
  },
  {
    name: "Nepal Time [NPT +5:45]",
    offset: "5.75",
  },
  {
    name: "Omsk Time [OMST +6]",
    offset: "6",
  },
  {
    name: "British Indian Ocean Time [BIOT +6]",
    offset: "6",
  },
  {
    name: "Bangladesh Standard Time [BST +6]",
    offset: "6",
  },
  {
    name: "Bhutan Time [BTT +6]",
    offset: "6",
  },
  {
    name: "Myanmar Standard Time [MST +6:30]",
    offset: "6.5",
  },
  {
    name: "Cocos Islands Time [CCT +6:30]",
    offset: "6.5",
  },
  {
    name: "Thailand Standard Time [THA +7]",
    offset: "7",
  },
  {
    name: "Christmas Island Time [CXT +7]",
    offset: "7",
  },
  {
    name: "Krasnoyarsk Time [KRAT +7]",
    offset: "7",
  },
  {
    name: "Malaysian Standard Time [MST +8]",
    offset: "8",
  },
  {
    name: "Irkutsk Time [IRKT +8]",
    offset: "8",
  },
  {
    name: "ASEAN Common Time [ACT +8]",
    offset: "8",
  },
  {
    name: "Hong Kong Time [HKT +8]",
    offset: "8",
  },
  {
    name: "Australian Western Standard Time [AWST +8]",
    offset: "8",
  },
  {
    name: "Philippine Standard Time [PST +8]",
    offset: "8",
  },
  {
    name: "China Standard Time [CST +8]",
    offset: "8",
  },
  {
    name: "Brunei Time [BDT +8]",
    offset: "8",
  },
  {
    name: "Singapore Standard Time [SST +8]",
    offset: "8",
  },
  {
    name: "Yakutsk Time [YAKT +9]",
    offset: "9",
  },
  {
    name: "Japan Standard Time [JST +9]",
    offset: "9",
  },
  {
    name: "Korea Standard Time [KST +9]",
    offset: "9",
  },
  {
    name: "Australian Central Standard Time [ACST +9:30]",
    offset: "9.5",
  },
  {
    name: "Chamorro Standard Time [ChST +10]",
    offset: "10",
  },
  {
    name: "Vladivostok Time [VLAT +10]",
    offset: "10",
  },
  {
    name: "Australian Eastern Standard Time [AEST +10]",
    offset: "10",
  },
  {
    name: "Magadan Time [MAGT +11]",
    offset: "11",
  },
  {
    name: "Solomon Islands Time [SBT +11]",
    offset: "11",
  },
  {
    name: "Norfolk Island Time [NFT +11:30]",
    offset: "11.5",
  },
  {
    name: "Fiji Time [FJT +12]",
    offset: "12",
  },
  {
    name: "Kamchatka Time [PETT +12]",
    offset: "12",
  },
  {
    name: "Gilbert Island Time [GILT +12]",
    offset: "12",
  },
  {
    name: "Chatham Standard Time [CHAST +12:45]",
    offset: "12.75",
  },
  {
    name: "Phoenix Island Time [PHOT +13]",
    offset: "13",
  },
  {
    name: "Line Islands Time [LINT +14]",
    offset: "14",
  },
];
