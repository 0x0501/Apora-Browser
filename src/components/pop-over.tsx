import { useLayoutEffect } from "react";

interface PopOverProps {
	rect: DOMRect;
	content: string;
	gap?: number;
}

export function PopOver({ rect, gap = 10, content }: PopOverProps) {
	const containerRef = useRef<HTMLDivElement>(null);

	const [height, setHeight] = useState<number>(0);

	console.log(content);
	console.log(content.replaceAll(/[^a-zA-z0-9-]/g, ""));

	const splittedContents = content
		.replaceAll(/[^a-zA-z0-9-\s]/g, "")
		.split(" "); // split content using space

	useLayoutEffect(() => {
		if (containerRef.current) {
			const h = containerRef.current.getBoundingClientRect().height;
			setHeight(h);
		}
	}, [containerRef.current, setHeight]);

	return (
		<div
			role="tooltip"
			ref={containerRef}
			// biome-ignore lint/a11y/noNoninteractiveTabindex: We need `tabIndex` to make div focusable
			tabIndex={0}
			className={`bg-red-400 fixed p-2`}
			style={{ left: `${rect.left}px`, top: `${rect.top - height - gap}px` }}
		>
			<div className="space-x-1">
				{splittedContents.map((term) => (
					<button
						type="button"
						key={term} // fix: duplicated key
						className="border rounded bg-gray-100 py-1 px-2 text-sm"
					>
						{term}
					</button>
				))}
			</div>
		</div>
	);
}
