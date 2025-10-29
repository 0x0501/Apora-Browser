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
import type z from "zod";
import { SettingSchema } from "@/utils/schema";

export default function SettingTab() {
	const mockLog = "This is log...";

	const mockSelectItems = [
		{
			key: "deck 1",
			label: "Deck 1",
		},
		{
			key: "deck 2",
			label: "Deck 2",
		},
		{ key: "default", label: "Default" },
	];

	const { handleSubmit, control } = useForm({
		resolver: zodResolver(SettingSchema),
		defaultValues: {
			ankiConnectUrl: "http://127.0.0.1:8765", // Read url from storage, if null, set default url
			ankiDeckName: "",
			aporaAPIToken: "",
		},
	});

	function onSavingSettings(values: z.infer<typeof SettingSchema>) {
		console.log(values);
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
								isInvalid={fieldState.invalid}
								errorMessage={fieldState.error?.message}
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
						render={({ field, fieldState }) => (
							<Select
								{...field}
								validationBehavior="aria"
								isRequired
								isInvalid={fieldState.invalid}
								label={"Deck"}
								labelPlacement="outside"
								placeholder="Select a deck"
								className="w-full"
								size="sm"
								items={mockSelectItems}
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
