import React from 'react';

declare const PD_THEMES: {
    id: string;
    name: string;
    sub: string;
}[];
declare function PdFeed({ theme, platform }: {
    theme?: string | undefined;
    platform?: string | undefined;
}): React.JSX.Element;
declare function Card({ d, variant }: {
    d: any;
    variant: any;
}): React.JSX.Element;
declare function Avatar({ seller, size }: {
    seller: any;
    size?: number | undefined;
}): React.JSX.Element;
declare function Freshness({ kind }: {
    kind: any;
}): React.JSX.Element;
declare function LikeBtn({ liked: init, count: c0, big }: {
    liked: any;
    count: any;
    big: any;
}): React.JSX.Element;
declare function SectionHead({ title, sub, action }: {
    title: any;
    sub: any;
    action: any;
}): React.JSX.Element;
declare function TopBar({ safeTop }: {
    safeTop: any;
}): React.JSX.Element;
declare function BottomNav({ safeBottom }: {
    safeBottom: any;
}): React.JSX.Element;
declare namespace Ic {
    function home(p: any): React.JSX.Element;
    function search(p: any): React.JSX.Element;
    function plus(p: any): React.JSX.Element;
    function deals(p: any): React.JSX.Element;
    function user(p: any): React.JSX.Element;
    function pin(p: any): React.JSX.Element;
    function star(p: any): React.JSX.Element;
    function chev(p: any): React.JSX.Element;
    function sliders(p: any): React.JSX.Element;
}
declare function Heart({ filled, className }: {
    filled: any;
    className: any;
}): React.JSX.Element;
declare function pdMoney(rub: any): string;
declare const PD_FRESH: ({
    id: string;
    photo: string;
    size: string;
    fresh: string;
    price: number;
    district: string;
    likes: number;
    liked: boolean;
    seller: {
        n: string;
        r: number;
        av: string;
    };
} | {
    id: string;
    photo: string;
    size: string;
    fresh: string;
    price: number;
    district: string;
    likes: number;
    liked: boolean;
    seller: {
        n: string;
        r: number;
        av?: undefined;
    };
})[];
declare const PD_LIKED: ({
    id: string;
    photo: string;
    size: string;
    fresh: string;
    price: number;
    district: string;
    likes: number;
    liked: boolean;
    seller: {
        n: string;
        r: number;
        av: string;
    };
    ar: string;
} | {
    id: string;
    photo: string;
    size: string;
    fresh: string;
    price: number;
    district: string;
    likes: number;
    liked: boolean;
    seller: {
        n: string;
        r: number;
        av?: undefined;
    };
    ar: string;
})[];

export { Avatar as A, BottomNav as B, Card as C, Freshness as F, Heart as H, Ic as I, LikeBtn as L, PD_FRESH as P, SectionHead as S, TopBar as T, PD_LIKED as a, PD_THEMES as b, PdFeed as c, pdMoney as p };
