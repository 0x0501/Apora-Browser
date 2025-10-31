import { useLayoutEffect, useRef, useState } from "react";

interface PopOverProps {
	rect: DOMRect;
	content: string;
	gap?: number;
}

export function PopOver({ rect, gap = 10, content }: PopOverProps) {
	const containerRef = useRef<HTMLDivElement>(null);

	const [height, setHeight] = useState<number>(0);

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

	function handleSync() {
		const selectedTerms = selectedIndices.map(i => splittedContents[i]); // remove duplicated terms

		console.log(selectedTerms);
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
				<div className="text-sm flex items-center justify-between">
					<span className="text-gray-400">Click the word you wanna learn:</span>
					<button
						type="button"
						onClick={handleSync}
						className="rounded-md bg-blue-500 text-sm py-1 px-2 text-gray-50 cursor-pointer hover:bg-blue-300 duration-400 ease-in-out transition-all"
					>
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
									"border border-gray-50 rounded selection:bg-transparent cursor-pointer bg-gray-100 py-1 px-2 text-sm hover:bg-green-600 data-[selected=true]:bg-green-600 data-[selected=true]:text-gray-50 hover:text-gray-50 transition-all ease-in-out duration-300",
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
