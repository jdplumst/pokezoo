import { createFileRoute } from "@tanstack/react-router";
import PokeballBackground from "#/features/home/components/PokeballBackground";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	return (
		<PokeballBackground>
			<div className="p-8">
				<h1 className="text-4xl font-bold text-center">PokéZoo</h1>
			</div>
		</PokeballBackground>
	);
}
