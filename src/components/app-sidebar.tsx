import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import SidebarMenuLabel from "~/components/sidebar-menu-label";
import Link from "next/link";
import {
  Gamepad2,
  ShoppingCart,
  Swords,
  Award,
  BookText,
  Handshake,
  School,
  FileDiff,
  Settings,
  Rat,
  LogOut,
  Database,
} from "lucide-react";
import Github from "~/components/github";
import SignOut from "~/components/sign-out";
import { Separator } from "~/components/ui/separator";
import { getTime } from "~/server/db/queries/cookies";

export async function AppSidebar() {
  const time = await getTime();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-bold">
            PokéZoo
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key={"Game"}>
                <SidebarMenuButton asChild>
                  <Link href="/game">
                    <Gamepad2 />
                    <SidebarMenuLabel>Game</SidebarMenuLabel>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem key={"Shop"}>
                <SidebarMenuButton asChild>
                  <Link href="/shop">
                    <ShoppingCart />
                    <SidebarMenuLabel>Shop</SidebarMenuLabel>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem key={"Storage"}>
                <SidebarMenuButton asChild>
                  <Link href="/storage/1">
                    <Database />
                    <SidebarMenuLabel>Storage</SidebarMenuLabel>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem key={"Quests"}>
                <SidebarMenuButton asChild>
                  <Link href="/quests">
                    <Swords />
                    <SidebarMenuLabel>Quests</SidebarMenuLabel>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem key={"Achievements"}>
                <SidebarMenuButton asChild>
                  <Link href="/achievements">
                    <Award />
                    <SidebarMenuLabel>Achievements</SidebarMenuLabel>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem key={"Pokedex"}>
                <SidebarMenuButton asChild>
                  <Link href="/pokedex">
                    <BookText />
                    <SidebarMenuLabel>Pokédex</SidebarMenuLabel>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem key={"Trades"}>
                <SidebarMenuButton asChild>
                  <Link href="/trades">
                    <Handshake />
                    <SidebarMenuLabel>Trades</SidebarMenuLabel>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem key={"Tutorial"}>
                <SidebarMenuButton asChild>
                  <Link href="/tutorial">
                    <School />
                    <SidebarMenuLabel>Tutorial</SidebarMenuLabel>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem key={"Patch-Notes"}>
                <SidebarMenuButton asChild>
                  <Link href="/patch-notes">
                    <FileDiff />
                    <SidebarMenuLabel>Patch Notes</SidebarMenuLabel>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem key={"Settings"}>
                <SidebarMenuButton asChild>
                  <Link href="/settings">
                    <Settings />
                    <SidebarMenuLabel>Settings</SidebarMenuLabel>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <Separator className="my-2" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-bold">
            Check These Out
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key={"PokeAPI"}>
                <SidebarMenuButton asChild>
                  <a href="https://pokeapi.co/">
                    <Rat />
                    <SidebarMenuLabel>PokéAPI</SidebarMenuLabel>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem key={"Github"}>
                <SidebarMenuButton asChild>
                  <a href="https://github.com/jdplumst/pokezoo">
                    <Github fill={`${time === "day" ? "black" : "white"}`} />
                    <SidebarMenuLabel>PokéZoo Github</SidebarMenuLabel>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-1" />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key={"SignOut"}>
                <SignOut>
                  <SidebarMenuButton asChild>
                    <div>
                      <LogOut />
                      <SidebarMenuLabel>Log Out</SidebarMenuLabel>
                    </div>
                  </SidebarMenuButton>
                </SignOut>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
