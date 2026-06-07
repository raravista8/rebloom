import React from 'react';

declare function PdWebNav({ active, authed, city, cityLoc, user, links, onPublish }: {
    active: any;
    authed?: boolean | undefined;
    city?: string | undefined;
    cityLoc?: string | undefined;
    user?: {
        n: string;
        r: number;
    } | undefined;
    links?: {
        label: string;
        sub: string;
        href: string;
        Icon: (p: any) => any;
    }[] | undefined;
    onPublish: any;
}): React.JSX.Element;

export { PdWebNav as P };
