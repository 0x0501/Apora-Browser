import { z } from "zod";
export const SettingSchema = z.object({
    ankiConnectUrl: z.url().nonempty("Anki Connect URL cannot be empty"),
    ankiDeckName: z.string().nonempty("Anki deck name cannot be empty"),
    aporaAPIToken: z.string().nonempty("Apora API Token cannot be empty."),
});
