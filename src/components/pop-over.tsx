import { Spinner } from "@heroui/react";
import { CircleX, Send } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";

interface PopOverProps {
	rect: DOMRect;
	content: string;
	onSync: (selectedTerms: string, context: string) => Promise<void>;
	gap?: number;
}

export function PopOver({ rect, gap = 10, content, onSync }: PopOverProps) {
	const containerRef = useRef<HTMLDivElement>(null);

	const [height, setHeight] = useState<number>(0);

	const [isLoading, setIsLoading] = useState(false);

	const calculatedTop =
		rect.top - height - gap <= 0 ? 0 : rect.top - height - gap;

	const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

	const splittedContents = content
		.replaceAll(/\[\d+\]/g, "")
		.replaceAll(/[^a-zA-Z0-9\-\s]/g, "")
		.split(" ")
		.filter((i) => i !== ""); // split content using space

	useLayoutEffect(() => {
		if (containerRef.current) {
			const h = containerRef.current.getBoundingClientRect().height;
			setHeight(h);
		}
	}, []);

	function formatContext(content: string) {
		let capitalized = content.slice(0, 1).toUpperCase() + content.slice(1);

		// remove all the reference: [1], [2], .etc
		capitalized = capitalized.replaceAll(/\[\d+\]/g, "");

		// replace comma, semi-colon and other special characters to dot (.)
		capitalized = capitalized.replace(/[,:;'"[\]/\\=()*&^%$#@]$/, ".");

		// if no ending punctuation was presented, we add dot(.)
		if (!/[.?!]$/.test(capitalized)) {
			capitalized += ".";
		}

		return capitalized;
	}

	async function handleSync() {
		setIsLoading(true);
		const selectedTerms = selectedIndices.map((i) => splittedContents[i]); // remove duplicated terms
		const formattedContext = formatContext(content);

		if (selectedIndices.length > 0 && formattedContext.length > 0) {
			await onSync(selectedTerms.join(" "), formattedContext);
		}
		setIsLoading(false);
	}

	function handleClearSelection() {
		setSelectedIndices([]);
	}

	return (
		splittedContents.length > 0 && (
			<div
				role="tooltip"
				ref={containerRef}
				// biome-ignore lint/a11y/noNoninteractiveTabindex: We need `tabIndex` to make div focusable
				tabIndex={0}
				className="bg-white fixed p-2 rounded-md shadow border border-gray-100 max-w-1/2 h-auto space-y-2 z-999999"
				style={{ left: `${rect.left}px`, top: `${calculatedTop}px` }}
				onClick={(e) => e.stopPropagation()}
				onPointerDown={(e) => e.stopPropagation()}
				onKeyDown={(e) => e.stopPropagation()}
			>
				<div className="text-sm flex items-center justify-between gap-2">
					<span className="text-gray-400 flex-2">
						Click the word you wanna learn:
					</span>
					<button
						type="button"
						disabled={selectedIndices.length === 0}
						onClick={handleClearSelection}
						className="rounded-md border border-red-200 text-red-200 not-disabled:border-red-400 not-disabled:text-red-400 text-sm py-1 px-2 cursor-pointer not-disabled:hover:bg-red-400 not-disabled:hover:text-white duration-400 ease-in-out transition-all inline-flex items-center justify-center gap-2"
					>
						<CircleX size={16} />
						Clear
					</button>
					<button
						type="button"
						onClick={handleSync}
						disabled={selectedIndices.length === 0}
						className="rounded-md bg-blue-200 text-gray-50 not-disabled:bg-blue-500 text-sm py-1 px-2 not-disabled:text-gray-50 cursor-pointer not-disabled:hover:bg-blue-400 duration-400 ease-in-out transition-all inline-flex items-center justify-center gap-2"
					>
						{isLoading ? (
							<Spinner
								size="sm"
								className="transition-all duration-200"
								classNames={{ wrapper: "size-4" }}
								color="white"
							/>
						) : (
							<Send size={16} className="transition-all duration-200" />
						)}
						Sync
					</button>
				</div>
				<div className="flex flex-row flex-wrap gap-1">
					{splittedContents.map((term, index) => {
						const isSelected = selectedIndices.includes(index);
						return (
							<button
								onClick={(e) => {
									e.stopPropagation();
									if (isSelected) {
										setSelectedIndices(
											selectedIndices.filter((i) => i !== index),
										);
									} else {
										setSelectedIndices([...selectedIndices, index]);
									}
								}}
								type="button"
								key={`${term}-${
									// biome-ignore lint/suspicious/noArrayIndexKey: use the compound key
									index
								}`}
								data-selected={isSelected ? "true" : "false"}
								className={cn(
									"border border-gray-50 rounded selection:bg-transparent cursor-pointer bg-gray-100 py-1 px-2 text-sm hover:bg-green-600 data-[selected=true]:bg-green-600 data-[selected=true]:text-gray-50 hover:text-gray-50 transition-all ease-in-out duration-200",
									{
										"": false,
									},
								)}
							>
								{term}
							</button>
						);
					})}
				</div>
			</div>
		)
	);
}
