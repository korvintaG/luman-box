import {fetchAuthors, selectError, selectAuthors, selectSliceState, setSliceStatus } from "./store/AuthorListSlice";
import {AuthorListPage} from "./pages/AuthorListPage";
import {AuthorDetailsPage} from "./pages/AuthorDetailsPage";
import { AuthorShort } from "./types/author-type";
import { authorLoad } from "./loaders/AuthorDetailsLoader";
import { authorsLoad } from "./loaders/AuthorListLoader";

export {
    fetchAuthors,
    selectAuthors,
    selectSliceState,
    selectError,
    setSliceStatus,
    AuthorListPage,
    AuthorDetailsPage,
    authorLoad,
    authorsLoad
}

export type {
    AuthorShort
}

