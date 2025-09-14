export const baseUrl = 'http://192.168.50.151:3006';

export const routes = {
    authors: '/authors',
    sources: '/sources',
    keywords: '/keywords',
    ideas: '/ideas',
    auth: '/auth',
};

export type AuthorToAdd = {
    name: string;
    birthDate: string;
    birthPlace: string;
    about: string;
};

export const authorToAdd: AuthorToAdd = {
    name: 'Cypress Test Author',
    birthDate: '1990-01-01',
    birthPlace: 'Test Place',
    about: 'Test About',
};
    