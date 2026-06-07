export { P as PdWebNav } from './web-nav-BfYXI_sK.js';
import React from 'react';

declare function PdLanding({ platform, auth }: {
    platform?: string | undefined;
    auth?: boolean | undefined;
}): React.JSX.Element;
declare namespace PdLanding {
    export { LandingNav as _navComp };
    export { Footer as _footComp };
    export { MobileMenu as _menuComp };
}
declare function PdLandingNav({ auth, desk }: {
    auth?: boolean | undefined;
    desk?: boolean | undefined;
}): React.JSX.Element;
declare function PdLandingFooter({ desk }: {
    desk: any;
}): React.JSX.Element;
declare function PdMobileMenu({ open, auth, city: cityProp, onClose }: {
    open: any;
    auth?: boolean | undefined;
    city?: string | undefined;
    onClose: any;
}): React.JSX.Element;

declare function LandingNav({ auth, desk }: {
    auth?: boolean | undefined;
    desk?: boolean | undefined;
}): React.JSX.Element;
declare function Footer({ desk }: {
    desk: any;
}): React.JSX.Element;
declare function MobileMenu({ open, auth, city: cityProp, onClose }: {
    open: any;
    auth?: boolean | undefined;
    city?: string | undefined;
    onClose: any;
}): React.JSX.Element;

declare function nbsp(s: any): any;
declare function PdGeoPage({ platform, data, menuLinks }: {
    platform?: string | undefined;
    data?: {
        id: string;
        nom: string;
        loc: string;
        gen: string;
        count: number;
        metro: boolean;
        districts: (string | number)[][];
    } | undefined;
    menuLinks: any;
}): React.JSX.Element;
declare function PdSafeDeal({ platform, menuLinks }: {
    platform?: string | undefined;
    menuLinks: any;
}): React.JSX.Element;
declare function PdBlogIndex({ platform, menuLinks }: {
    platform?: string | undefined;
    menuLinks: any;
}): React.JSX.Element;
declare function PdBlogArticle({ platform, article, menuLinks }: {
    platform?: string | undefined;
    article?: {
        id: string;
        tag: string;
        img: string;
        title: string;
        excerpt: string;
        read: string;
    } | undefined;
    menuLinks: any;
}): React.JSX.Element;
declare function PdSeoMeta({ url, title, description, h1, alt, label }: {
    url: any;
    title: any;
    description: any;
    h1: any;
    alt: any;
    label?: string | undefined;
}): React.JSX.Element;
declare const CITIES_FULL: {
    id: string;
    nom: string;
    loc: string;
    gen: string;
    count: number;
    metro: boolean;
    districts: (string | number)[][];
}[];

export { CITIES_FULL as PD_GEO_CITIES, PdBlogArticle, PdBlogIndex, PdGeoPage, PdLanding, PdLandingFooter, PdLandingNav, PdMobileMenu, PdSafeDeal, PdSeoMeta, nbsp };
