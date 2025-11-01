# Apora-Browser

<img alt="apora browser title" src="https://github.com/0x0501/Apora-Browser/blob/911a4c1f6cc7d152a1f82894b585e490c65a6235/_resource/apora-browser-1920-1080.png" />

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
| Chrome  |   Support ✅   | `apora-browser-chrome-[version].zip`  |
| Firefox |   Support ✅   | `apora-browser-firefox-[version].zip` |
|  Edge   |   Support ✅   |  `apora-browser-edge-[version].zip`   |
| Safari  | Not support ❌ |             ❌              |

## snapshots

### Setting & Feature

<img alt="apora browser snapshot-1" src="https://github.com/0x0501/Apora-Browser/blob/911a4c1f6cc7d152a1f82894b585e490c65a6235/_resource/apora-browser-1280-800.png" />

<hr/>

### Functionality

<img alt="apora browser snapshot-2" src="https://github.com/0x0501/Apora-Browser/blob/911a4c1f6cc7d152a1f82894b585e490c65a6235/_resource/apora-browser-1280-800%20(2).png" />

## Development

Clone this repository, create a `web-ext.config.ts` and config Chrome, Firefox, and Edge binary path (check it up at [WXT Browser-Startup](https://wxt.dev/guide/essentials/config/browser-startup.html)), after that running the command below:

```bash
bun run dev
```
