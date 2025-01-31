import { getOnboarding } from "@/src/server/actions/onboarding";
import { Metadata } from "next";
import OnboardingForm from "../_components/OnboardingForm";

export const metadata: Metadata = {
  title: "PokéZoo",
  icons: {
    icon: "/favicon.png",
  },
};

export default async function Onboarding() {
  const starters = await getOnboarding();

  return <OnboardingForm starters={starters} />;
}
