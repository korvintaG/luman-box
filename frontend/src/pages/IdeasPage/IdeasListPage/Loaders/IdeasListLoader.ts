import { fetchIdeas, fetchIdeasBySrcKw } from "../../../../features/ideas/store/IdeaSlice";
import store from "../../../../shared/services/store";

export async function ideasLoad({ request }: { request: Request }) {
    const url = new URL(request.url);
    const condSrc = url.searchParams.get("source_id");
    const condKw = url.searchParams.get("keyword_id");

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

    const state = store.getState();
    throw new Error(state.ideas.error);
}