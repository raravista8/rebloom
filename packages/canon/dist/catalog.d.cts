import React from 'react';
export { P as PdWebNav } from './web-nav-C_qaqoeg.cjs';

declare function PdCatalog({ platform, items, state, total, filters, onFiltersChange, stations, flowers, city, cityLoc, onCityChange, onLoadMore, onCardClick, cardHref, onLike, renderCard, onRetry, header, }: {
    platform?: string | undefined;
    items?: never[] | undefined;
    state?: string | undefined;
    total?: number | undefined;
    filters?: {
        metro: never[];
        flowers: never[];
        size: null;
        freshness: null;
        rating: null;
        priceMin: null;
        priceMax: null;
        sort: string;
    } | undefined;
    onFiltersChange: any;
    stations?: never[] | undefined;
    flowers?: never[] | undefined;
    city?: string | undefined;
    cityLoc?: string | undefined;
    onCityChange: any;
    onLoadMore: any;
    onCardClick: any;
    cardHref: any;
    onLike: any;
    renderCard: any;
    onRetry: any;
    header: any;
}): React.JSX.Element;

export { PdCatalog };
