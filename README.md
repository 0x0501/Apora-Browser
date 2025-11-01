# Apora-Browser


An extension for using [Apora](https://apora.sumku.cc) on browsers.

## Installment

1. Download Anki Connect from anki addon page:
   [Anki Connect](https://ankiweb.net/shared/info/2055492159) or use addon code:
   **2055492159** to download within Anki.
2. Download Apora Browser from **release page**, choose your platform with different ending (should see it in the table below).
3. **Download `Apora-English.apkg` from release page, and import it into Anki (Important).**

> After successfully installed, you need config your Anki connect url, deck name, Apora API Token.

When everything's all right, toggle Apora Browser and **pressing the `alt` key as you selecting the content**.

Supported Browser:

| Browser |     Status     |    File name convention     |
| :-----: | :------------: | :-------------------------: |
| Chrome  |   Support ✅   | `apora-browser-chrome.zip`  |
| Firefox |   Support ✅   | `apora-browser-firefox.zip` |
|  Edge   |   Support ✅   |  `apora-browser-edge.zip`   |
| Safari  | Not support ❌ |             ❌              |

## Development

Clone this repository, create a `web-ext.config.ts` and config Chrome, Firefox, and Edge binary path (check it up at [WXT Browser-Startup](https://wxt.dev/guide/essentials/config/browser-startup.html)), after that running the command below:

```bash
bun run dev
```