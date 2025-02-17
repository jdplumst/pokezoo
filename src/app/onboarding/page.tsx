import { getOnboarding } from "~/server/actions/onboarding";
import { type Metadata } from "next";
import OnboardingForm from "~/components/onboarding-form";

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
