import icon from "@/assets/icon.png";
import SettingTab from "@/components/setting-tab";
import "./App.css";
import { SwitchPanel } from "@/components/switch-panel";

function Header() {
	return (
		<div className="inline-flex w-full items-center gap-1 px-2">
			<img src={icon} alt="Apora Logo" className="size-6" />
			<span className="font-pixel text-lg font-bold">Apora Browser</span>
		</div>
	);
}

function App() {
	return (
		<div className="flex flex-col w-full items-center p-2 gap-3">
			<Header />
			<SwitchPanel />
			<SettingTab />
		</div>
	);
}

export default App;
