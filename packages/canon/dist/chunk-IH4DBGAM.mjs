import { PdWebNav } from './chunk-LQL6AJYF.mjs';
import { Ic, PdMetroPicker, Card } from './chunk-VLZGX7EA.mjs';
import React from 'react';
import { jsxs, jsx } from 'react/jsx-runtime';

var PdCatalog = /* @__PURE__ */ (function() {
  const PRICE_BUCKETS = [
    { id: "lt1k", label: "\u0434\u043E 1 000 \u20BD", min: null, max: 1e3 },
    { id: "1k2k", label: "1 000\u20132 000 \u20BD", min: 1e3, max: 2e3 },
    { id: "gt2k", label: "2 000 \u20BD+", min: 2e3, max: null }
  ];
  const FRESH_OPTS = [["today", "\u0421\u0432\u0435\u0436\u0438\u0439"], ["d1_2", "1\u20132 \u0434\u043D\u044F"], ["d3_plus", "3+ \u0434\u043D\u044F"]];
  const RATING_OPTS = [["45", "4,5+"], ["48", "4,8+"], ["5", "5,0"]];
  const SIZE_OPTS = [["S", "S \xB7 \u0434\u043E 7"], ["M", "M \xB7 7\u201315"], ["L", "L \xB7 15\u201325"], ["XL", "XL \xB7 25+"]];
  const SORTS = [["fresh", "\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0441\u0432\u0435\u0436\u0438\u0435"], ["cheap", "\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0434\u0435\u0448\u0435\u0432\u043B\u0435"], ["exp", "\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0434\u043E\u0440\u043E\u0436\u0435"], ["rating", "\u041F\u043E \u0440\u0435\u0439\u0442\u0438\u043D\u0433\u0443"]];
  const Sliders = (p) => /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", ...p, fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", children: [
    /* @__PURE__ */ jsx("path", { d: "M4 7h16M4 12h16M4 17h16" }),
    /* @__PURE__ */ jsx("circle", { cx: "9", cy: "7", r: "2.3", fill: "currentColor", stroke: "none" }),
    /* @__PURE__ */ jsx("circle", { cx: "15", cy: "12", r: "2.3", fill: "currentColor", stroke: "none" }),
    /* @__PURE__ */ jsx("circle", { cx: "8", cy: "17", r: "2.3", fill: "currentColor", stroke: "none" })
  ] });
  const ChevD = (p) => /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", ...p, fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("path", { d: "m6 9 6 6 6-6" }) });
  const CloseX = (p) => /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", ...p, fill: "none", stroke: "currentColor", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("path", { d: "m6 6 12 12M18 6 6 18" }) });
  const ico = (Fn, cls) => Fn ? Fn({ className: cls, fill: "none", stroke: "currentColor" }) : null;
  function SortDropdown({ sort, setSort }) {
    const [open, setOpen] = React.useState(false);
    const ref = React.useRef(null);
    React.useEffect(() => {
      if (!open) return;
      const o = (e) => {
        if (ref.current && !ref.current.contains(e.target)) setOpen(false);
      };
      document.addEventListener("mousedown", o);
      return () => document.removeEventListener("mousedown", o);
    }, [open]);
    const cur = SORTS.find(([v]) => v === sort);
    return /* @__PURE__ */ jsxs("div", { className: "pdc-sortdd" + (open ? " open" : ""), ref, children: [
      /* @__PURE__ */ jsxs("button", { type: "button", className: "pdc-sortdd-btn", onClick: () => setOpen((o) => !o), children: [
        /* @__PURE__ */ jsx("span", { className: "l", children: "\u0421\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u043A\u0430:" }),
        /* @__PURE__ */ jsx("span", { className: "v", children: cur ? cur[1] : "" }),
        /* @__PURE__ */ jsx(ChevD, { className: "chev pd-i16" })
      ] }),
      open && /* @__PURE__ */ jsx("div", { className: "pdc-sortdd-menu", children: SORTS.map(([v, l]) => /* @__PURE__ */ jsx("button", { type: "button", className: "pdc-sortdd-row" + (sort === v ? " on" : ""), onClick: () => {
        setSort(v);
        setOpen(false);
      }, children: l }, v)) })
    ] });
  }
  return function PdCatalog2({
    platform = "desktop",
    items = [],
    state = "loaded",
    total = 0,
    filters = { metro: [], flowers: [], size: null, freshness: null, rating: null, priceMin: null, priceMax: null, sort: "fresh" },
    onFiltersChange,
    stations = [],
    flowers = [],
    city = "\u041C\u043E\u0441\u043A\u0432\u0430",
    cityLoc = "\u041C\u043E\u0441\u043A\u0432\u0435",
    onCityChange,
    onLoadMore,
    onCardClick,
    cardHref,
    onLike,
    renderCard,
    onRetry,
    header
  }) {
    const desk = platform === "desktop";
    const Card2 = Card, Ic2 = Ic, MetroPicker = PdMetroPicker;
    const [sheet, setSheet] = React.useState(false);
    const f = filters;
    const patch = (p) => onFiltersChange && onFiltersChange({ ...f, ...p });
    const single = (key, val) => patch({ [key]: f[key] === val ? null : val });
    const togglePrice = (b) => {
      const on = f.priceMin === b.min && f.priceMax === b.max;
      patch({ priceMin: on ? null : b.min, priceMax: on ? null : b.max });
    };
    const priceOn = (b) => f.priceMin === b.min && f.priceMax === b.max;
    const toggleFlower = (id) => patch({ flowers: f.flowers.includes(id) ? f.flowers.filter((x) => x !== id) : [...f.flowers, id] });
    const toggleMetro = (id) => patch({ metro: id === null ? [] : f.metro.includes(id) ? f.metro.filter((x) => x !== id) : [...f.metro, id] });
    const reset = () => onFiltersChange && onFiltersChange({ metro: [], flowers: [], size: null, freshness: null, rating: null, priceMin: null, priceMax: null, sort: "fresh" });
    const active = f.metro.length + f.flowers.length + (f.size ? 1 : 0) + (f.freshness ? 1 : 0) + (f.rating ? 1 : 0) + (f.priceMin != null || f.priceMax != null ? 1 : 0);
    const stationName = (id) => {
      const s = stations.find((x) => x.id === id);
      return s ? s.name : id;
    };
    const ssChip = (key, val, lab, star) => /* @__PURE__ */ jsxs("button", { className: "pdc-fchip" + (f[key] === val ? " on" : ""), onClick: () => single(key, val), children: [
      star && /\d/.test(lab) ? /* @__PURE__ */ jsx("span", { className: "st", children: "\u2605" }) : null,
      lab
    ] }, val);
    const priceChip = (b) => /* @__PURE__ */ jsx("button", { className: "pdc-fchip" + (priceOn(b) ? " on" : ""), onClick: () => togglePrice(b), children: b.label }, b.id);
    const flowerChip = (x) => /* @__PURE__ */ jsx("button", { className: "pdc-fchip" + (f.flowers.includes(x.id) ? " on" : ""), onClick: () => toggleFlower(x.id), children: x.label }, x.id);
    const MetroGroup = ({ tag = "h4" }) => /* @__PURE__ */ jsxs(React.Fragment, { children: [
      React.createElement(tag, null, "\u041C\u0435\u0442\u0440\u043E"),
      /* @__PURE__ */ jsx(MetroPicker, { options: stations, idMode: true, multi: true, values: f.metro, onToggle: toggleMetro, placeholder: "\u041B\u044E\u0431\u044B\u0435 \u0441\u0442\u0430\u043D\u0446\u0438\u0438" }),
      f.metro.length > 0 && /* @__PURE__ */ jsx("div", { className: "pdc-metrotags", children: f.metro.map((m) => /* @__PURE__ */ jsxs("button", { className: "pdc-metrotag", onClick: () => toggleMetro(m), children: [
        "\u043C. ",
        stationName(m),
        /* @__PURE__ */ jsx(CloseX, { className: "pd-i12" })
      ] }, m)) })
    ] });
    const groups = (cls) => /* @__PURE__ */ jsxs(React.Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: cls, children: [
        /* @__PURE__ */ jsx("h4", { children: "\u0426\u0435\u043D\u0430" }),
        /* @__PURE__ */ jsx("div", { className: "pdc-fopts", children: PRICE_BUCKETS.map(priceChip) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: cls, children: [
        /* @__PURE__ */ jsx("h4", { children: "\u0421\u0432\u0435\u0436\u0435\u0441\u0442\u044C" }),
        /* @__PURE__ */ jsx("div", { className: "pdc-fopts", children: FRESH_OPTS.map(([v, l]) => ssChip("freshness", v, l)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: cls, children: [
        /* @__PURE__ */ jsx("h4", { children: "\u0422\u0438\u043F \u0446\u0432\u0435\u0442\u043E\u0432" }),
        /* @__PURE__ */ jsx("div", { className: "pdc-fopts", children: flowers.map(flowerChip) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: cls, children: [
        /* @__PURE__ */ jsx("h4", { children: "\u0420\u0435\u0439\u0442\u0438\u043D\u0433 \u043F\u0440\u043E\u0434\u0430\u0432\u0446\u0430" }),
        /* @__PURE__ */ jsx("div", { className: "pdc-fopts", children: RATING_OPTS.map(([v, l]) => ssChip("rating", v, l, true)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: cls, children: [
        /* @__PURE__ */ jsx("h4", { children: "\u0420\u0430\u0437\u043C\u0435\u0440 \u0431\u0443\u043A\u0435\u0442\u0430" }),
        /* @__PURE__ */ jsx("div", { className: "pdc-fopts", children: SIZE_OPTS.map(([v, l]) => ssChip("size", v, l)) })
      ] })
    ] });
    const renderOne = (d) => {
      if (renderCard) return renderCard(d);
      const card = /* @__PURE__ */ jsx(Card2, { d, variant: "grid", onLike });
      if (cardHref) return /* @__PURE__ */ jsx("a", { className: "pdc-cardlink", href: cardHref(d), children: card });
      if (onCardClick) return /* @__PURE__ */ jsx("div", { className: "pdc-cardlink", role: "link", tabIndex: 0, onClick: () => onCardClick(d), children: card });
      return card;
    };
    const ordered = React.useMemo(() => {
      if (f.sort === "cheap") return items.slice().sort((a, b) => a.price - b.price);
      if (f.sort === "exp") return items.slice().sort((a, b) => b.price - a.price);
      if (f.sort === "rating") return items.slice().sort((a, b) => (b.seller && b.seller.r || 0) - (a.seller && a.seller.r || 0));
      return items;
    }, [items, f.sort]);
    const hasMore = items.length < total;
    const skelN = desk ? 8 : 6;
    const Collection = () => {
      if (state === "loading") return /* @__PURE__ */ jsx("div", { className: "pdc-grid", children: Array.from({ length: skelN }).map((_, i) => /* @__PURE__ */ jsx("div", { className: "pdc-skel", "aria-hidden": "true" }, i)) });
      if (state === "error" || state === "offline") return /* @__PURE__ */ jsxs("div", { className: "pdc-state", children: [
        /* @__PURE__ */ jsx("span", { className: "pdc-state-ico", children: state === "offline" ? ico(Ic2.pin, "pd-i24") : "!" }),
        /* @__PURE__ */ jsx("b", { children: state === "offline" ? "\u041D\u0435\u0442 \u0441\u043E\u0435\u0434\u0438\u043D\u0435\u043D\u0438\u044F" : "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C" }),
        /* @__PURE__ */ jsx("span", { className: "pdc-state-sub", children: state === "offline" ? "\u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0438\u043D\u0442\u0435\u0440\u043D\u0435\u0442 \u2014 \u0438 \u043F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0441\u043D\u043E\u0432\u0430." : "\u0427\u0442\u043E-\u0442\u043E \u043F\u043E\u0448\u043B\u043E \u043D\u0435 \u0442\u0430\u043A \u043D\u0430 \u043D\u0430\u0448\u0435\u0439 \u0441\u0442\u043E\u0440\u043E\u043D\u0435." }),
        /* @__PURE__ */ jsx("button", { className: "pdc-state-btn", onClick: onRetry, children: "\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u044C" })
      ] });
      if (state === "empty") return /* @__PURE__ */ jsxs("div", { className: "pdc-state", children: [
        /* @__PURE__ */ jsx("b", { children: "\u041F\u043E\u043A\u0430 \u043D\u0435\u0442 \u0431\u0443\u043A\u0435\u0442\u043E\u0432" }),
        /* @__PURE__ */ jsxs("span", { className: "pdc-state-sub", children: [
          "\u0412 ",
          cityLoc,
          " \u0441\u0435\u0439\u0447\u0430\u0441 \u043D\u0435\u0442 \u0441\u0432\u0435\u0436\u0438\u0445 \u0431\u0443\u043A\u0435\u0442\u043E\u0432. \u0417\u0430\u0433\u043B\u044F\u043D\u0438\u0442\u0435 \u0447\u0443\u0442\u044C \u043F\u043E\u0437\u0436\u0435 \u2014 \u0438\u0445 \u0434\u043E\u0431\u0430\u0432\u043B\u044F\u044E\u0442 \u043A\u0430\u0436\u0434\u044B\u0439 \u0434\u0435\u043D\u044C."
        ] })
      ] });
      if (state === "no-results" || items.length === 0) return /* @__PURE__ */ jsxs("div", { className: "pdc-empty", children: [
        /* @__PURE__ */ jsx("b", { children: "\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0448\u043B\u043E\u0441\u044C" }),
        "\u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0441\u043C\u044F\u0433\u0447\u0438\u0442\u044C \u0444\u0438\u043B\u044C\u0442\u0440\u044B \u2014 \u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440, \u0440\u0430\u0441\u0448\u0438\u0440\u0438\u0442\u044C \u0446\u0435\u043D\u0443 \u0438\u043B\u0438 \u0441\u0432\u0435\u0436\u0435\u0441\u0442\u044C.",
        active ? /* @__PURE__ */ jsx("div", { className: "pdc-empty-act", children: /* @__PURE__ */ jsx("button", { className: "pdc-reset", onClick: reset, children: "\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0444\u0438\u043B\u044C\u0442\u0440\u044B" }) }) : null
      ] });
      return /* @__PURE__ */ jsxs(React.Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: "pdc-grid", children: ordered.map((d) => /* @__PURE__ */ jsx("div", { className: "pd-rise", children: renderOne(d) }, d._id || d.id)) }),
        state === "loading-more" && /* @__PURE__ */ jsxs("div", { className: "pdc-morestate", children: [
          /* @__PURE__ */ jsx("span", { className: "pdc-spin" }),
          "\u0417\u0430\u0433\u0440\u0443\u0436\u0430\u0435\u043C \u0435\u0449\u0451\u2026"
        ] }),
        state === "end" && /* @__PURE__ */ jsxs("div", { className: "pdc-end", children: [
          /* @__PURE__ */ jsx("span", {}),
          "\u041F\u043E\u043A\u0430\u0437\u0430\u043B\u0438 \u0432\u0441\u0435 \u0431\u0443\u043A\u0435\u0442\u044B \u043F\u043E \u0432\u0430\u0448\u0435\u043C\u0443 \u0437\u0430\u043F\u0440\u043E\u0441\u0443"
        ] }),
        state === "loaded" && hasMore && /* @__PURE__ */ jsx("div", { className: "pdc-loadmore", children: /* @__PURE__ */ jsx("button", { onClick: onLoadMore, children: "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0435\u0449\u0451" }) })
      ] });
    };
    const busy = state === "loading" || state === "error" || state === "offline" || state === "empty";
    return /* @__PURE__ */ jsxs("div", { className: "pd-root pd-web pdc" + (desk ? " pdc--desk" : ""), "data-pd-theme": "a", children: [
      header || /* @__PURE__ */ jsx(PdWebNav, { active: "\u041A\u0430\u0442\u0430\u043B\u043E\u0433", city, cityLoc }),
      /* @__PURE__ */ jsxs("main", { className: "pd-scroll pdw-scroll", children: [
        /* @__PURE__ */ jsxs("div", { className: "pdc-head", children: [
          /* @__PURE__ */ jsxs("p", { className: "pdc-crumbs", children: [
            /* @__PURE__ */ jsx("a", { href: "\u041F\u0435\u0440\u0435\u0434\u0430\u0440\u0438\u043C \xB7 \u041B\u0435\u043D\u0434\u0438\u043D\u0433 peredarim.ru.html", children: "\u0413\u043B\u0430\u0432\u043D\u0430\u044F" }),
            " \xB7 \u041A\u0430\u0442\u0430\u043B\u043E\u0433 \xB7 ",
            city
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "pdc-titlerow", children: [
            /* @__PURE__ */ jsxs("h1", { className: "pdc-title", children: [
              "\u0421\u0432\u0435\u0436\u0438\u0435 \u0431\u0443\u043A\u0435\u0442\u044B \u0432 ",
              cityLoc
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "pdc-count", children: [
              /* @__PURE__ */ jsx("span", { className: "d" }),
              state === "loading" ? "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430\u2026" : `${total} \u0431\u0443\u043A\u0435\u0442\u043E\u0432`,
              active && !busy ? ` \xB7 \u0444\u0438\u043B\u044C\u0442\u0440\u043E\u0432: ${active}` : ""
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pdc-body", children: [
          /* @__PURE__ */ jsxs("aside", { className: "pdc-side", children: [
            /* @__PURE__ */ jsx("div", { className: "pdc-fblock", children: /* @__PURE__ */ jsx(MetroGroup, {}) }),
            /* @__PURE__ */ jsxs("div", { className: "pdc-fblock", children: [
              /* @__PURE__ */ jsx("h4", { children: "\u0426\u0435\u043D\u0430" }),
              /* @__PURE__ */ jsx("div", { className: "pdc-fopts", children: PRICE_BUCKETS.map(priceChip) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pdc-fblock", children: [
              /* @__PURE__ */ jsx("h4", { children: "\u0421\u0432\u0435\u0436\u0435\u0441\u0442\u044C" }),
              /* @__PURE__ */ jsx("div", { className: "pdc-fopts", children: FRESH_OPTS.map(([v, l]) => ssChip("freshness", v, l)) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pdc-fblock", children: [
              /* @__PURE__ */ jsx("h4", { children: "\u0422\u0438\u043F \u0446\u0432\u0435\u0442\u043E\u0432" }),
              /* @__PURE__ */ jsx("div", { className: "pdc-fopts", children: flowers.map(flowerChip) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pdc-fblock", children: [
              /* @__PURE__ */ jsx("h4", { children: "\u0420\u0435\u0439\u0442\u0438\u043D\u0433 \u043F\u0440\u043E\u0434\u0430\u0432\u0446\u0430" }),
              /* @__PURE__ */ jsx("div", { className: "pdc-fopts", children: RATING_OPTS.map(([v, l]) => ssChip("rating", v, l, true)) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pdc-fblock", children: [
              /* @__PURE__ */ jsx("h4", { children: "\u0420\u0430\u0437\u043C\u0435\u0440 \u0431\u0443\u043A\u0435\u0442\u0430" }),
              /* @__PURE__ */ jsx("div", { className: "pdc-fopts", children: SIZE_OPTS.map(([v, l]) => ssChip("size", v, l)) })
            ] }),
            /* @__PURE__ */ jsx("button", { className: "pdc-reset", onClick: reset, children: "\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0444\u0438\u043B\u044C\u0442\u0440\u044B" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "pdc-main", children: [
            /* @__PURE__ */ jsxs("div", { className: "pdc-mbar", children: [
              /* @__PURE__ */ jsxs("button", { className: "pdc-mchip pdc-mchip--filters", onClick: () => setSheet(true), children: [
                /* @__PURE__ */ jsx(Sliders, { className: "pd-i16" }),
                "\u0424\u0438\u043B\u044C\u0442\u0440\u044B",
                active ? ` \xB7 ${active}` : ""
              ] }),
              /* @__PURE__ */ jsxs("button", { className: "pdc-mchip" + (f.metro.length ? " on" : ""), onClick: () => setSheet(true), children: [
                ico(Ic2.pin, "pd-i14"),
                f.metro.length ? f.metro.length === 1 ? `\u043C. ${stationName(f.metro[0])}` : `\u041C\u0435\u0442\u0440\u043E \xB7 ${f.metro.length}` : "\u041C\u0435\u0442\u0440\u043E"
              ] }),
              PRICE_BUCKETS.slice(1).map((b) => /* @__PURE__ */ jsx("button", { className: "pdc-mchip" + (priceOn(b) ? " on" : ""), onClick: () => togglePrice(b), children: b.label }, b.id)),
              /* @__PURE__ */ jsx("button", { className: "pdc-mchip" + (f.freshness === "today" ? " on" : ""), onClick: () => single("freshness", "today"), children: "\u0421\u0432\u0435\u0436\u0438\u0439" }),
              flowers.slice(0, 3).map((x) => /* @__PURE__ */ jsx("button", { className: "pdc-mchip" + (f.flowers.includes(x.id) ? " on" : ""), onClick: () => toggleFlower(x.id), children: x.label }, x.id)),
              /* @__PURE__ */ jsx("button", { className: "pdc-mchip" + (f.rating === "48" ? " on" : ""), onClick: () => single("rating", "48"), children: "\u2605 4,8+" })
            ] }),
            sheet && /* @__PURE__ */ jsxs("div", { className: "pdc-panel", children: [
              /* @__PURE__ */ jsxs("div", { className: "pdc-panel-head", children: [
                /* @__PURE__ */ jsx("span", { children: "\u0412\u0441\u0435 \u0444\u0438\u043B\u044C\u0442\u0440\u044B" }),
                /* @__PURE__ */ jsx("button", { className: "pdc-panel-x", onClick: () => setSheet(false), "aria-label": "\u0421\u0432\u0435\u0440\u043D\u0443\u0442\u044C", children: /* @__PURE__ */ jsx(CloseX, { className: "pd-i18" }) })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "pdc-panel-grp", children: /* @__PURE__ */ jsx(MetroGroup, {}) }),
              groups("pdc-panel-grp"),
              /* @__PURE__ */ jsxs("div", { className: "pdc-panel-foot", children: [
                /* @__PURE__ */ jsxs("button", { className: "pdc-sheet-reset", onClick: reset, children: [
                  "\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C",
                  active ? ` (${active})` : ""
                ] }),
                /* @__PURE__ */ jsxs("button", { className: "pdc-sheet-apply", onClick: () => setSheet(false), children: [
                  "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C ",
                  total,
                  " \u0431\u0443\u043A\u0435\u0442\u043E\u0432"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pdc-toolbar", children: [
              /* @__PURE__ */ jsxs("span", { className: "pdc-count", style: { fontSize: 13 }, children: [
                total,
                " \u0431\u0443\u043A\u0435\u0442\u043E\u0432"
              ] }),
              /* @__PURE__ */ jsx(SortDropdown, { sort: f.sort, setSort: (v) => patch({ sort: v }) }),
              /* @__PURE__ */ jsxs("div", { className: "pdc-sort pdc-sort--desk", children: [
                /* @__PURE__ */ jsx("span", { className: "l", children: "\u0421\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u043A\u0430:" }),
                /* @__PURE__ */ jsx("div", { className: "pdc-sortsel", children: SORTS.map(([v, l]) => /* @__PURE__ */ jsx("button", { className: "pdc-sortbtn" + (f.sort === v ? " on" : ""), onClick: () => patch({ sort: v }), children: l }, v)) })
              ] })
            ] }),
            /* @__PURE__ */ jsx(Collection, {})
          ] })
        ] })
      ] })
    ] });
  };
})();

export { PdCatalog };
