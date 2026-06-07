import React from 'react';

declare function PdFeed({ theme, platform }: {
    theme?: string | undefined;
    platform?: string | undefined;
}): React.JSX.Element;
declare function Card({ d, variant, onLike }: {
    d: any;
    variant: any;
    onLike: any;
}): React.JSX.Element;
declare function Avatar({ seller, size }: {
    seller: any;
    size?: number | undefined;
}): React.JSX.Element;
declare function Freshness({ kind }: {
    kind: any;
}): React.JSX.Element;
declare function LikeBtn({ liked: init, count: c0, big, onToggle }: {
    liked: any;
    count: any;
    big: any;
    onToggle: any;
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
    roseLabel: string;
    size: string;
    fresh: string;
    price: number;
    city: string;
    metro: string;
    district: string;
    flowers: string[];
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
    city: string;
    metro: string;
    district: string;
    flowers: string[];
    likes: number;
    liked: boolean;
    seller: {
        n: string;
        r: number;
        av: string;
    };
    roseLabel?: undefined;
} | {
    id: string;
    photo: string;
    size: string;
    fresh: string;
    price: number;
    city: string;
    metro: string;
    district: string;
    flowers: string[];
    likes: number;
    liked: boolean;
    seller: {
        n: string;
        r: number;
        av?: undefined;
    };
    roseLabel?: undefined;
})[];
declare const PD_LIKED: ({
    id: string;
    photo: string;
    roseLabel: string;
    size: string;
    fresh: string;
    price: number;
    city: string;
    metro: string;
    district: string;
    flowers: string[];
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
    city: string;
    metro: string;
    district: string;
    flowers: string[];
    likes: number;
    liked: boolean;
    seller: {
        n: string;
        r: number;
        av: string;
    };
    ar: string;
    roseLabel?: undefined;
} | {
    id: string;
    photo: string;
    size: string;
    fresh: string;
    price: number;
    city: string;
    metro: string;
    district: string;
    flowers: string[];
    likes: number;
    liked: boolean;
    seller: {
        n: string;
        r: number;
        av?: undefined;
    };
    ar: string;
    roseLabel?: undefined;
})[];
declare function MetroDots({ lines, size }: {
    lines: any;
    size?: number | undefined;
}): React.JSX.Element;
declare function MetroLabel({ station, lines, className, dotSize }: {
    station: any;
    lines: any;
    className: any;
    dotSize: any;
}): React.JSX.Element;
declare function pdMetroLines(station: any): any;
declare namespace PD_METRO {
    let msk: {
        n: string;
        l: string[];
    }[];
    let spb: {
        n: string;
        l: string[];
    }[];
}
declare const PD_METRO_LINES: {
    '1': string;
    '2': string;
    '3': string;
    '4': string;
    '5': string;
    '6': string;
    '7': string;
    '8': string;
    '9': string;
    '10': string;
    '11': string;
    sp1: string;
    sp2: string;
    sp3: string;
    sp4: string;
    sp5: string;
};
declare const PD_METRO_INDEX: {};
declare const PD_CITY_METRO: {
    Москва: string;
    '\u0421\u0430\u043D\u043A\u0442-\u041F\u0435\u0442\u0435\u0440\u0431\u0443\u0440\u0433': string;
    Казань: string;
    Екатеринбург: string;
    Новосибирск: string;
    '\u041D\u0438\u0436\u043D\u0438\u0439 \u041D\u043E\u0432\u0433\u043E\u0440\u043E\u0434': string;
    Самара: string;
};
declare const PD_FLOWERS: string[];
declare const PD_FLOWER_FILTERS: string[];
declare namespace PD_FRESH_META {
    namespace today {
        let label: string;
        let short: string;
        let dot: string;
    }
    namespace d1_2 {
        let label_1: string;
        export { label_1 as label };
        let short_1: string;
        export { short_1 as short };
        let dot_1: string;
        export { dot_1 as dot };
    }
    namespace d3_plus {
        let label_2: string;
        export { label_2 as label };
        let short_2: string;
        export { short_2 as short };
        let dot_2: string;
        export { dot_2 as dot };
    }
}
declare const PD_THEMES: {
    id: string;
    name: string;
    sub: string;
}[];

export { Avatar as A, BottomNav as B, Card as C, Freshness as F, Heart as H, Ic as I, LikeBtn as L, MetroDots as M, PD_CITY_METRO as P, SectionHead as S, TopBar as T, PD_FLOWERS as a, PD_FLOWER_FILTERS as b, PD_FRESH as c, PD_FRESH_META as d, PD_LIKED as e, PD_METRO as f, PD_METRO_INDEX as g, PD_METRO_LINES as h, PD_THEMES as i, PdFeed as j, MetroLabel as k, pdMoney as l, pdMetroLines as p };
