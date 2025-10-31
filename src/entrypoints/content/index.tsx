import "./style.css";
import ReactDOM from "react-dom/client";
import { PopOver } from "@/components/pop-over";

let isAltPressed = false;

export default defineContentScript({
	matches: ["<all_urls>"],

	cssInjectionMode: "ui",

	async main(ctx) {
		const enabled = await aporaBrowserEnabledStorage.getValue();

		if (!enabled) {
			return; // if Apora browser was disabled, do nothing.
		}

		const expandSelectionToBoundaries = () => {
			// if no selection was occurred, return
			const selection = window.getSelection();
			if (!selection || selection.rangeCount === 0) return null;

			const range = selection.getRangeAt(0).cloneRange(); // clone range, do not change the original.
			const { startContainer, endContainer, startOffset, endOffset } = range;

			// only handle text node
			if (
				startContainer.nodeType !== Node.TEXT_NODE ||
				endContainer.nodeType !== Node.TEXT_NODE
			) {
				console.log("Non-text node, return.");
				return range.toString().trim();
			}

			const startText = startContainer.textContent || "";
			const endText = endContainer.textContent || "";

			let newStart = startOffset;
			let newEnd = endOffset;

			// expand left to word start
			while (newStart > 0 && /\S/.test(startText[newStart - 1])) {
				newStart--;
			}

			// expand right to word end
			while (newEnd < endText.length && /\S/.test(endText[newEnd])) {
				newEnd++;
			}

			// expanded selection
			const expandedRange = document.createRange();
			expandedRange.setStart(startContainer, newStart);
			expandedRange.setEnd(endContainer, newEnd);

			selection.removeAllRanges();
			selection.addRange(expandedRange);
		};

		console.log(`Apora Browser: ${enabled}`);

		ctx.addEventListener(document, "keydown", (e) => {
			if (e.altKey) isAltPressed = true;
		});

		ctx.addEventListener(document, "keyup", (e) => {
			if (!e.altKey) isAltPressed = false;
		});

		ctx.addEventListener(document, "mouseup", async () => {
			// if alt key is not pressed, return
			if (!isAltPressed) {
				return;
			}

			const selection = window.getSelection();

			if (!selection) return; // if nothing's selected return

			expandSelectionToBoundaries();

			const parentElementOfSelection = selection.focusNode?.parentElement;

			if (!parentElementOfSelection) {
				console.warn(`parentElementOfSelection is none`);
				return;
			}

			// make parent element of the selected one focusable
			parentElementOfSelection.tabIndex = -1;

			// get the selection range =
			const range = selection.getRangeAt(0);

			// get the Rect (size) of selected range
			const rect = range.getBoundingClientRect();

			const fullWordSelection = range.toString();

			if (!fullWordSelection) {
				console.warn(`Nothing's selected.`);
				return;
			}

			// create mounted UI
			const ui = await createShadowRootUi(ctx, {
				position: "overlay",
				name: "apora-browser-pop-over",
				anchor: document.body,
				onMount: (
					uiContainer: HTMLElement, // body element
					_shadow: ShadowRoot,
					_shadowHost: HTMLElement,
				) => {
					// 1. create mount container
					// Container is a body, and React warns when creating a root on the body, so create a wrapper div
					// const app = document.createElement("div");
					// uiContainer.append(app);

					// 2. render react component
					// Create a root on the UI container and render a component
					const root = ReactDOM.createRoot(uiContainer);
					root.render(<PopOver rect={rect} content={fullWordSelection} />);
					return root;
				},
				onRemove: (root) => {
					// 3. Unmount the root when the UI is removed
					root?.unmount();
				},
			});

			// 4. Mount the UI
			ui.mount();

			const handleClickOutside = (event: PointerEvent) => {
				event.stopPropagation();
				if (
					!ui.uiContainer.contains(event.target as Node) &&
					event.target !== ui.uiContainer &&
					(event.target as HTMLDivElement).nodeName.toLowerCase() !==
						"apora-browser-pop-over" &&
					ui.mounted
				) {
					// remove UI when click outside
					ui.remove();
				}
			};

			ctx.addEventListener(document, "click", handleClickOutside);

			// get user selected text

			console.log(`Alt key: ${isAltPressed}`);
			console.warn(selection);
			console.log(parentElementOfSelection);
		});
	},
});
