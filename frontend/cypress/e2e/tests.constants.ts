export const baseUrl = 'http://192.168.50.151:3006';

export const timeout = 10000;

export const loginSuperAdmin = Cypress.env("REACT_APP_SUPER_ADMIN_LOGIN");
export const passwordSuperAdmin = Cypress.env("REACT_APP_SUPER_ADMIN_PASSWORD");
export const loginAdmin = Cypress.env("REACT_APP_ADMIN_LOGIN");
export const passwordAdmin = Cypress.env("REACT_APP_ADMIN_PASSWORD");
export const loginUser = Cypress.env("REACT_APP_USER_LOGIN");
export const passwordUser = Cypress.env("REACT_APP_USER_PASSWORD");
export const loginUser2 = Cypress.env("REACT_APP_USER2_LOGIN");
export const passwordUser2 = Cypress.env("REACT_APP_USER2_PASSWORD");
export const loginError = Cypress.env("REACT_APP_ERROR_LOGIN");
export const passwordError = Cypress.env("REACT_APP_ERROR_PASSWORD");

export const routes = {
    authors: '/authors',
    sources: '/sources',
    keywords: '/keywords',
    ideas: '/ideas',
    auth: '/auth',
    interconnections: '/interconnections',
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
    
export type SourceToAdd = {
    name: string;
    publicationYear: string;
    aboutSource: string;
};

export const sourceToAdd: SourceToAdd = {
    name: 'Cypress Test Source',
    publicationYear: '2025',
    aboutSource: 'Test About Source',
};

export type KeywordToAdd = {
    name: string;
    definition: string;
};

export const keywordToAdd: KeywordToAdd = {
    name: 'Cypress Test Keyword',
    definition: 'Test Definition',
};

export type IdeaToAdd = {
    name: string;
    original_text: string;
    content: string;
    SVG: string;
};

export const ideaToAdd: IdeaToAdd = {
    name: 'Cypress Test Idea',
    original_text: 'Test Original Text any original text about idea and words, many many words and text',
    content: 'Test Content any content about idea and words, many many words and text',
    SVG: "<svg width='15' height='15' viewBox='0 0 15 15' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M15 7.5L7.5 15L-3.27835e-07 7.5L7.5 -3.27835e-07L15 7.5Z' fill='#FFAB6B'/></svg>"
};

export const ideaToAdd2: IdeaToAdd = {
    name: 'Cypress Test Idea 2',
    original_text: '2 Test Original Text any original text about idea and words, many many words and text',
    content: '2 Test Content any content about idea and words, many many words and text',
    SVG: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="7.5" fill="white" stroke="#C7D0DA"/></svg>'
};

export type InterconnectionToAdd = {
    name_direct: string;
    name_reverse: string;
};

export const interconnectionToAdd: InterconnectionToAdd = {
    name_direct: 'Cypress Test Interconnection Direct',
    name_reverse: 'Cypress Test Interconnection Reverse',
};