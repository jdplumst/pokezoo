import { createFileRoute } from "@tanstack/react-router";
import { PokeballBackground } from "#/features/home/components/PokeballBackground";
import { SignInCard } from "#/features/home/components/SignInCard";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	return (
		<PokeballBackground>
			<div className="flex flex-col gap-20 p-8">
				<h1 className="text-4xl font-bold text-center">PokéZoo</h1>
				<SignInCard />
			</div>
		</PokeballBackground>
	);
}
