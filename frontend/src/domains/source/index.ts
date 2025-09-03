import {fetchSources, selectError, selectSources, selectSliceState, setSliceStatus } from "./store/SourceListSlice";
import {SourceListPage} from "./pages/SourceListPage";
import {SourceDetailsPage} from "./pages/SourceDetailsPage";
import { SourceShort } from "./types/source-type";
import { sourceAddLoad } from "./loaders/SourceDetailsAddLoader";
import { sourceEditLoad } from "./loaders/SourceDetailsEditLoader";
import { sourceListLoad } from "./loaders/SourceListLoader";

export {
    fetchSources,
    selectSources,
    selectSliceState,
    selectError,
    setSliceStatus,
    SourceListPage,
    SourceDetailsPage,
    sourceAddLoad,
    sourceEditLoad,
    sourceListLoad as sourcesLoad
}

export type {
    SourceShort
}

