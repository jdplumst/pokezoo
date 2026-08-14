import type { ReactNode } from "react";

interface PokeballBackgroundProps {
	children: ReactNode;
}

export function PokeballBackground({ children }: PokeballBackgroundProps) {
	return (
		<div className="relative min-h-screen w-full overflow-hidden bg-linear-to-b from-red-500 to-white">
			{/* Single centered pokeball, filling the viewport */}
			<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
				<PokeballShape className="h-[80vmin] w-[80vmin]" />
			</div>

			{/* Content sits above the background */}
			<div className="relative z-10">{children}</div>
		</div>
	);
}

function PokeballShape({ className = "" }) {
	return (
		<svg viewBox="0 0 200 200" className={className} aria-label="pokeball">
			<circle
				cx="100"
				cy="100"
				r="96"
				fill="#fff"
				stroke="#1a1a1a"
				strokeWidth="6"
			/>
			<path
				d="M4 100a96 96 0 0 1 192 0z"
				fill="#e3350d"
				stroke="#1a1a1a"
				strokeWidth="6"
			/>
			<rect x="4" y="94" width="192" height="12" fill="#1a1a1a" />
			<circle
				cx="100"
				cy="100"
				r="26"
				fill="#fff"
				stroke="#1a1a1a"
				strokeWidth="6"
			/>
			<circle
				cx="100"
				cy="100"
				r="12"
				fill="#fff"
				stroke="#1a1a1a"
				strokeWidth="4"
			/>
		</svg>
	);
}
