import {fetchAuthors, selectError, selectAuthors, selectSliceState, setSliceStatus } from "./store/AuthorListSlice";
import {AuthorListPage} from "./pages/author-list-page";
import {AuthorDetailsPage} from "./pages/author-details-page";
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

