import { Switch } from "@heroui/react";
import { cn } from "@/utils/css";

export function SwitchPanel() {
	const [toggle, setToggle] = useState(false); // read from storage

	const count = 0;

	return (
		<div className="text-center space-y-6">
			<p className="text-gray-400">Click the switch to enable Apora.</p>

			<Switch
				isSelected={toggle}
				onChange={() => setToggle((e) => !e)}
				size="lg"
			/>
			<p
				className={cn("text-sm text-blue-500", {
					"text-orange-400": !toggle,
				})}
			>
				{toggle
					? count > 0
						? `Made ${count} card with Apora today.`
						: `Build something amazing with Apora!`
					: `Apora is disabled :(`}
			</p>
		</div>
	);
}
