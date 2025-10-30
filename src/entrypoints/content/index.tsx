import "./style.css";
import ReactDOM from "react-dom/client";
import { PopOver } from "@/components/pop-over";

let isAltPressed = false;

export default defineContentScript({
	matches: ["<all_urls>"],

	cssInjectionMode: "ui",
	async main(ctx) {
		const enabled = await aporaBrowserEnabledStorage.getValue();
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

			const parentElementOfSelection = selection.anchorNode?.parentElement;

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

			console.log(`Range: ${range}`);
			console.log(rect);

			// create mounted UI
			const ui = await createShadowRootUi(ctx, {
				position: "inline",
				name: "apora-browser-pop-over",
				anchor: parentElementOfSelection,
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
					root.render(
						<PopOver rect={rect} content={range.toString().trim()} />,
					);
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
				if (
					!ui.uiContainer.contains(event.target as Node) &&
					event.target !== ui.uiContainer &&
					(event.target as HTMLDivElement).nodeName.toLowerCase() !==
						"apora-browser-pop-over" &&
					ui.mounted
				) {
					console.log("handleClickOutside");
					console.log(event.target);
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
