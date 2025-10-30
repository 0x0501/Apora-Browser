import {
	Button,
	Form,
	Input,
	Select,
	SelectItem,
	Tab,
	Tabs,
	Textarea,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import type z from "zod";
import { type DeckItem, listDecks } from "@/utils/operation";
import { SettingSchema } from "@/utils/schema";
import {
	ankiConnectUrlStorage,
	ankiDeckNameStorage,
	aporaAPITokenStorage,
	loadConfigFromStorage,
} from "@/utils/storage";

export default function SettingTab() {
	const mockLog = "This is log...";

	const [deckList, setDeckList] = useState<DeckItem[]>([]);

	const [loadErrorMsg, setLoadErrMsg] = useState<string>();

	const [isLoadingDecks, setIsLoadingDecks] = useState<boolean>(false);

	const [isOpenSelection, setIsOpenSelection] = useState<boolean>(false);

	const [ankiConnectUrl, setAnkiConnectUrl] = useState<string>(
		ankiConnectUrlStorage.fallback,
	);

	const { handleSubmit, control, reset } = useForm({
		resolver: zodResolver(SettingSchema),
		defaultValues: {
			ankiConnectUrl: "", // Read url from storage, if null, set default url
			ankiDeckName: "",
			aporaAPIToken: "",
		},
	});

	useEffect(() => {
		loadConfigFromStorage(
			async ({ ankiConnectUrl, ankiDeckName, aporaAPIToken }) => {
				setAnkiConnectUrl(ankiConnectUrl); // set anki connect url as local state

				reset({
					ankiConnectUrl,
					ankiDeckName: ankiDeckName ?? "",
					aporaAPIToken: aporaAPIToken ?? "",
				});

				// load decks from anki connect
				const res = await listDecks({ ankiConnectUrl });

				if (res.success && res.data) {
					setDeckList(res.data || []); // use empty array as fallback
				} else {
					toast.error(res.message);
					setLoadErrMsg(
						res.message || `Cannot load decks from: ${ankiConnectUrl}`,
					);
					console.error(`Load Error: ${res.message}`);
				}
			},
		);
	}, []); // runs once mount

	async function onSavingSettings(values: z.infer<typeof SettingSchema>) {
		ankiConnectUrlStorage.setValue(values.ankiConnectUrl);
		ankiDeckNameStorage.setValue(values.ankiDeckName);
		aporaAPITokenStorage.setValue(values.aporaAPIToken);

		toast.success("Settings saved.");
	}

	return (
		<Tabs aria-label="setting-tabs" size="sm" fullWidth>
			<Tab key={"Logs"} title={"Logs"} className="w-full">
				<Textarea
					classNames={{ label: "text-gray-400" }}
					className="text-gray-400"
					labelPlacement="outside"
					description="If you encounter problems, please send logs to the support team."
					isReadOnly
					label="Logs"
					fullWidth
					value={mockLog}
					variant="faded"
				/>
			</Tab>
			<Tab key={"Settings"} title={"Settings"} className="w-full">
				<Form onSubmit={handleSubmit(onSavingSettings)} className="w-full">
					<Controller
						control={control}
						name="ankiConnectUrl"
						render={({ field, fieldState }) => (
							<Input
								{...field}
								validationBehavior="aria"
								isRequired
								isInvalid={fieldState.invalid || !!loadErrorMsg}
								errorMessage={fieldState.error?.message || loadErrorMsg}
								onValueChange={(value) => setAnkiConnectUrl(value)}
								fullWidth
								size="sm"
								classNames={{ label: "text-xs" }}
								labelPlacement="outside-top"
								label="Anki Connect URL"
								placeholder="http://127.0.0.1:8765"
								description="If you don't know what it is, leave it alone."
								type="text"
							/>
						)}
					/>
					<Controller
						control={control}
						name="ankiDeckName"
						render={({ field, fieldState, formState }) => (
							<Select
								{...field}
								isLoading={isLoadingDecks}
								isOpen={isOpenSelection}
								defaultSelectedKeys={loadErrorMsg ? [] : [field.value]}
								onOpenChange={async (isOpen) => {
									// check if the anki connect url was updated
									if (formState.dirtyFields.ankiConnectUrl) {
										setIsLoadingDecks(true);

										// list decks from updated url
										const res = await listDecks({ ankiConnectUrl });

										if (res.success && res.data) {
											setDeckList(res.data);
											setLoadErrMsg(undefined);
											setIsOpenSelection(isOpen); // only open selection when no error was occurred
										} else {
											const msg =
												res.message ||
												`Cannot load decks from: ${ankiConnectUrl}`;
											setLoadErrMsg(msg);
											toast.error(msg);
										}
										setIsLoadingDecks(false);
									} else {
										// open selection when no fields was touched
										setIsOpenSelection(isOpen);
									}
								}}
								multiple={false}
								validationBehavior="aria"
								isRequired
								isInvalid={fieldState.invalid}
								label={"Deck"}
								labelPlacement="outside"
								placeholder="Select a deck"
								className="w-full"
								size="sm"
								items={deckList}
								description="Select your target deck."
							>
								{(deck) => <SelectItem>{deck.label}</SelectItem>}
							</Select>
						)}
					/>
					<Controller
						control={control}
						name="aporaAPIToken"
						render={({ field, fieldState }) => (
							<Input
								{...field}
								validationBehavior="aria"
								isRequired
								isInvalid={fieldState.invalid}
								errorMessage={fieldState.error?.message}
								fullWidth
								size="sm"
								placeholder="Your Apora Token"
								description={
									<span>
										Get your Apora API token from{" "}
										<a
											href="https://apora.sumku.cc"
											rel="noreferrer"
											target="_blank"
											className="font-bold text-blue-500 underline"
										>
											here
										</a>
										.
									</span>
								}
								classNames={{ label: "text-xs" }}
								labelPlacement="outside-top"
								label="Apora API Token"
							/>
						)}
					/>
					<Button type="submit" color="primary" size="sm" className="text-sm">
						Save
					</Button>
				</Form>
			</Tab>
		</Tabs>
	);
}
