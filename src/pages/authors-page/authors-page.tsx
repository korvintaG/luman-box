import { FC, useEffect, useState } from 'react';
import { getAuthors } from '../../utils/luman-emu-api';
import { Author } from '../../utils/type';
import { Link } from 'react-router-dom';

export const Authors: FC = () => {

    const [authors, setAuthors] = useState<Author[]>([]);

    useEffect(() => {
        getAuthors().then((data) => setAuthors(data))
    }, []);

    return (
        <main>
            <ul>
                {authors.length === 0 ? 
                    <p>Тут будут авторы</p> 
                    : authors.map((author) => (<li key={author.id}>
                                <Link
                                 to={`/authors/${author.id}`} >
                                {author.name}
                                </Link>
                                </li>))
                }

            </ul>
        </main>

    );
};
