import {
	Button,
	Checkbox,
	Form,
	Input,
	Radio,
	RadioGroup,
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
import { FeatureSchema, SettingSchema } from "@/utils/schema";
import {
	addPartOfSpeechToTagStorage,
	ankiConnectUrlStorage,
	ankiDeckNameStorage,
	aporaAPITokenStorage,
	enablePronunciationStorage,
	enableTermHighlightingStorage,
	loadConfigFromStorage,
	pronunciationVariantStorage,
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

	const {
		handleSubmit: handleSettingSubmit,
		control: controlSetting,
		reset: resetSetting,
	} = useForm({
		resolver: zodResolver(SettingSchema),
		defaultValues: {
			ankiConnectUrl: "", // Read url from storage, if null, set default url
			ankiDeckName: "",
			aporaAPIToken: "",
		},
	});

	const {
		handleSubmit: handleFeatureSubmit,
		control: controlFeature,
		reset: resetFeature,
	} = useForm({
		resolver: zodResolver(FeatureSchema),
		defaultValues: {
			enablePronunciation: false,
			pronunciationVariant: "US",
			enableTermHighlighting: true,
			addPartOfSpeechToTag: true,
		},
	});

	useEffect(() => {
		loadConfigFromStorage(
			async ({
				ankiConnectUrl,
				ankiDeckName,
				aporaAPIToken,
				enablePronunciation,
				pronunciationVariant,
				enableTermHighlighting,
				addPartOfSpeechToTag,
			}) => {
				setAnkiConnectUrl(ankiConnectUrl); // set anki connect url as local state

				resetSetting({
					ankiConnectUrl,
					ankiDeckName: ankiDeckName ?? "",
					aporaAPIToken: aporaAPIToken ?? "",
				});

				resetFeature({
					enablePronunciation,
					pronunciationVariant,
					enableTermHighlighting,
					addPartOfSpeechToTag,
				});

				// load decks from anki connect, do not block the UI
				listDecks({ ankiConnectUrl }).then((res) => {
					if (res.success && res.data) {
						setDeckList(res.data || []); // use empty array as fallback
					} else {
						toast.error(res.message);
						setLoadErrMsg(
							res.message || `Cannot load decks from: ${ankiConnectUrl}`,
						);
						console.error(`Load Error: ${res.message}`);
					}
				});
			},
		);
	}, []); // runs once mount

	async function onSaveSettings(values: z.infer<typeof SettingSchema>) {
		ankiConnectUrlStorage.setValue(values.ankiConnectUrl);
		ankiDeckNameStorage.setValue(values.ankiDeckName);
		aporaAPITokenStorage.setValue(values.aporaAPIToken);

		toast.success("Setting saved.");
	}

	async function onSaveFeatures(values: z.infer<typeof FeatureSchema>) {
		enablePronunciationStorage.setValue(values.enablePronunciation);
		pronunciationVariantStorage.setValue(values.pronunciationVariant);
		enableTermHighlightingStorage.setValue(values.enableTermHighlighting);
		addPartOfSpeechToTagStorage.setValue(values.addPartOfSpeechToTag);

		toast.success("Feature saved.");
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
				<Form onSubmit={handleSettingSubmit(onSaveSettings)} className="w-full">
					<Controller
						control={controlSetting}
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
						control={controlSetting}
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
						control={controlSetting}
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
					{/* Features */}
					<Button type="submit" color="primary" size="sm" className="text-sm">
						Save
					</Button>
				</Form>
			</Tab>
			<Tab key={"Features"} title={"Features"} className="w-full">
				<Form onSubmit={handleFeatureSubmit(onSaveFeatures)}>
					<div className="grid grid-cols-2 w-full gap-3">
						<span className="col-span-2 text-foreground-500">
							Toggle features you'd like to use:
						</span>
						<Controller
							control={controlFeature}
							name="enablePronunciation"
							render={({ field, fieldState }) => (
								<Checkbox
									isSelected={field.value}
									onValueChange={field.onChange}
									validationBehavior="aria"
									isRequired
									isInvalid={fieldState.invalid}
									size="sm"
								>
									Pronunciation
								</Checkbox>
							)}
						/>
						<Controller
							control={controlFeature}
							name="enableTermHighlighting"
							render={({ field, fieldState }) => (
								<Checkbox
									isSelected={field.value}
									onValueChange={field.onChange}
									validationBehavior="aria"
									isRequired
									isInvalid={fieldState.invalid}
									size="sm"
								>
									Term Highlight
								</Checkbox>
							)}
						/>
						<Controller
							control={controlFeature}
							name="addPartOfSpeechToTag"
							render={({ field, fieldState }) => (
								<Checkbox
									isSelected={field.value}
									onValueChange={field.onChange}
									validationBehavior="aria"
									isRequired
									isInvalid={fieldState.invalid}
									className="col-span-2"
									size="sm"
								>
									Add Part-of-Speech to tag
								</Checkbox>
							)}
						/>

						<Controller
							control={controlFeature}
							name="pronunciationVariant"
							render={({ field }) => (
								<RadioGroup
									{...field}
									label="Select Pronunciation variant"
									className="col-span-2"
									orientation="horizontal"
									classNames={{ wrapper: "gap-6.5" }}
									onValueChange={field.onChange}
								>
									<Radio value={"US"} className="col-span-2" size="sm">
										American English
									</Radio>

									<Radio value={"GB"} className="col-span-2" size="sm">
										British English
									</Radio>
								</RadioGroup>
							)}
						/>
					</div>
					<Button type="submit" color="primary" size="sm" className="text-sm">
						Save
					</Button>
				</Form>
			</Tab>
		</Tabs>
	);
}
