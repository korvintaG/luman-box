import { sourceAdditionalLoad } from "./SourceDetailsAdditionalLoader";

export async function sourceAddLoad() {
    await sourceAdditionalLoad(null);
    return null;
}