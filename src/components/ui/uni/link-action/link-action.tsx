import { Link, LinkProps } from 'react-router-dom';
import {FC, SyntheticEvent, PropsWithChildren} from 'react';

export type LinkActionUIProps =  PropsWithChildren<LinkProps & React.RefAttributes<HTMLAnchorElement> & {
    actionHandle: (e: SyntheticEvent) => void;
}>;


export const LinkActionUI : FC<LinkActionUIProps> = ({children,actionHandle,...args} ) => {
    return <Link {...args}>
        <div onClick={actionHandle}>
            {children}
        </div>
    </Link>
}
