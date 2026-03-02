import { ideaAdditionalLoad } from "./idea-details-additional-loader";
import store from "../../../shared/services/store";
import { fetchIdeaTypes } from "../store/idea-types-slice";
import { RequestStatus } from "../../../shared/types/types-for-hooks";

export async function ideaAddLoad() {
    await store.dispatch(fetchIdeaTypes());
    const state = store.getState();
    if (
        state.ideaTypes.status === RequestStatus.Failed ||
        state.ideaTypes.status === RequestStatus.FailedUnAuth
    ) {
        throw new Error(state.ideaTypes.error);
    }
    await ideaAdditionalLoad(null);
    return null;
}