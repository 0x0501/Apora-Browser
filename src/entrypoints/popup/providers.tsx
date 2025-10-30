import { HeroUIProvider } from "@heroui/react";
import type { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: ReactNode }) {
	return (
		<HeroUIProvider>
			<Toaster />
			{children}
		</HeroUIProvider>
	);
}
