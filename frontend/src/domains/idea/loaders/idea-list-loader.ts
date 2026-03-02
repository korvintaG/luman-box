import { fetchIdeas, fetchIdeasBySrcKw } from "../store/idea-list-slice";
import store from "../../../shared/services/store";
import { fetchIdeaTypes } from "../store/idea-types-slice";
import { RequestStatus } from "../../../shared/types/types-for-hooks";

export async function ideasLoad({ request }: { request: Request }) {
    const url = new URL(request.url);
    const condSrc = url.searchParams.get("source_id");
    const condKw = url.searchParams.get("keyword_id");
    await store.dispatch(fetchIdeaTypes());
    let state = store.getState();
    if (
        state.ideaTypes.status === RequestStatus.Failed ||
        state.ideaTypes.status === RequestStatus.FailedUnAuth
    ) {
        throw new Error(state.ideaTypes.error);
    }

    if (condSrc && condKw) {
        const result = await store.dispatch(
            fetchIdeasBySrcKw({
                source_id: Number(condSrc),
                keyword_id: Number(condKw),
            }),
        );
        if (fetchIdeasBySrcKw.fulfilled.match(result))
            return null;
    } else {
        const result = await store.dispatch(fetchIdeas());
        if (fetchIdeas.fulfilled.match(result))
            return null;
    }

    state = store.getState();
    throw new Error(state.ideaList.error);
}