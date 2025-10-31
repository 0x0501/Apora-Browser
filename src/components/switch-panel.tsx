import { Switch } from "@heroui/react";
import { useSetStateWithStorage } from "@/hooks/use-set-state-with-storage";
import { cn } from "@/utils/css";
import { loadConfigFromStorage } from "@/utils/storage";

// if aporaBrowserEnabledStorage changed,
// we need reload the page so that content script could read the latest value
aporaBrowserEnabledStorage.watch(() => {
	browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		const current = tabs[0];
		if (current?.id) {
			browser.tabs.reload(current.id);
		}
	});
});

export function SwitchPanel() {
	const [toggle, setToggle] = useState<boolean>(false);

	const setToggleWithStorage = useSetStateWithStorage(
		setToggle,
		aporaBrowserEnabledStorage,
	);

	const switchRef = useRef<HTMLInputElement>(null);

	const count = 0;

	useEffect(() => {
		loadConfigFromStorage(({ aporaBrowserEnabled }) => {
			setToggle(aporaBrowserEnabled);
		});
	}, []); // runs on mount

	return (
		<div className="text-center space-y-6">
			<p className="text-gray-400">Click the switch to enable Apora.</p>

			<Switch
				ref={switchRef}
				isSelected={toggle}
				onValueChange={(isSelected) => setToggleWithStorage(isSelected)}
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
