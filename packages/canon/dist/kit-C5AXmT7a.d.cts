import React from 'react';

declare function PdBtn({ variant, block, lg, loading, icon, children, ...rest }: {
    [x: string]: any;
    variant?: string | undefined;
    block: any;
    lg: any;
    loading: any;
    icon: any;
    children: any;
}): React.JSX.Element;
declare function PdField({ label, opt, hint, error, counter, children }: {
    label: any;
    opt: any;
    hint: any;
    error: any;
    counter: any;
    children: any;
}): React.JSX.Element;
declare function PdInput({ state, prefix, icon, value, placeholder, textarea, rows }: {
    state: any;
    prefix: any;
    icon: any;
    value: any;
    placeholder: any;
    textarea: any;
    rows?: number | undefined;
}): React.JSX.Element;
declare function PdOtp({ value, cur, state }: {
    value?: string | undefined;
    cur: any;
    state: any;
}): React.JSX.Element;
declare function PdSeg({ options, value }: {
    options: any;
    value: any;
}): React.JSX.Element;
declare function PdSizeSel({ value }: {
    value: any;
}): React.JSX.Element;
declare function PdChip({ on, children, icon }: {
    on: any;
    children: any;
    icon: any;
}): React.JSX.Element;
declare function PdStepper({ status }: {
    status: any;
}): React.JSX.Element;
declare function PdBubble({ kind, children, time }: {
    kind?: string | undefined;
    children: any;
    time: any;
}): React.JSX.Element;
declare function PdStars({ value, input }: {
    value?: number | undefined;
    input: any;
}): React.JSX.Element;
declare function PdNotice({ kind, icon, children }: {
    kind?: string | undefined;
    icon: any;
    children: any;
}): React.JSX.Element;
declare function PdEmpty({ glyph, title, text, children }: {
    glyph: any;
    title: any;
    text: any;
    children: any;
}): React.JSX.Element;
declare function PdSkelCard(): React.JSX.Element;
declare function PdGallery({ photos, count, idx }: {
    photos: any;
    count: any;
    idx?: number | undefined;
}): React.JSX.Element;
declare function PdScreen({ title, center, back, action, onBg, footer, banner, children, safeTop, noScroll }: {
    title: any;
    center: any;
    back?: boolean | undefined;
    action: any;
    onBg: any;
    footer: any;
    banner: any;
    children: any;
    safeTop?: number | undefined;
    noScroll: any;
}): React.JSX.Element;
declare function PdToast({ kind, children }: {
    kind?: string | undefined;
    children: any;
}): React.JSX.Element;

export { PdBtn as P, PdChip as a, PdGallery as b, PdEmpty as c, PdField as d, PdInput as e, PdNotice as f, PdOtp as g, PdSeg as h, PdSizeSel as i, PdSkelCard as j, PdStars as k, PdToast as l, PdBubble as m, PdScreen as n, PdStepper as o };
