import { FC } from "react";
import { AboutCardsList } from "../../features/about/components/AboutCardsList/AboutCardsList";
import { Helmet } from 'react-helmet-async';

/**
 * Страница "о системе"
 */

export const AboutPage: FC = () => <>
    <Helmet>
        <title>О сети идей Sferatum</title>
    </Helmet>
    <AboutCardsList/>
    </>; 
