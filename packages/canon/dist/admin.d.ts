import React from 'react';

declare function Side({ active }: {
    active: any;
}): React.JSX.Element;
declare function AdminShell({ active, title, top, overlay, children }: {
    active: any;
    title: any;
    top: any;
    overlay: any;
    children: any;
}): React.JSX.Element;
declare function AdminToast({ kind, children }: {
    kind?: string | undefined;
    children: any;
}): React.JSX.Element;
declare function aic(Fn: any, cls?: string): any;
declare function AdminDashboard(): React.JSX.Element;
declare function AdminModeration(): React.JSX.Element;
declare function Spark({ pts, color }: {
    pts: any;
    color: any;
}): React.JSX.Element;

declare function AdminUsers({ state, bulk, overlay }: {
    state?: string | undefined;
    bulk?: boolean | undefined;
    overlay: any;
}): React.JSX.Element;
declare function AdminUserDrill(): React.JSX.Element;
declare function AdminListings({ state }: {
    state?: string | undefined;
}): React.JSX.Element;
declare function AdminDeals({ state, overlay }: {
    state?: string | undefined;
    overlay: any;
}): React.JSX.Element;
declare function AdminDealConfirm({ phase }: {
    phase?: string | undefined;
}): React.JSX.Element;
declare function AdminFinance({ state }: {
    state?: string | undefined;
}): React.JSX.Element;
declare function AdminFraud({ state }: {
    state?: string | undefined;
}): React.JSX.Element;
declare function AdminReports({ state }: {
    state?: string | undefined;
}): React.JSX.Element;

declare function AdminMobileLogin({ step }: {
    step?: string | undefined;
}): React.JSX.Element;
declare function AdminMobileDash(): React.JSX.Element;
declare function AdminMobileMod(): React.JSX.Element;
declare function AdminMobileModReject(): React.JSX.Element;
declare function AdminMobileDeals(): React.JSX.Element;
declare function AdminMobileDealCancel(): React.JSX.Element;
declare function AdminMobileDispute(): React.JSX.Element;
declare function AdminMobileFraud(): React.JSX.Element;
declare function AdminMobileFraudDrill(): React.JSX.Element;
declare function AdminMobileMore(): React.JSX.Element;
declare function AdminMobileUsers(): React.JSX.Element;
declare function AdminMobileUserDrill(): React.JSX.Element;
declare function AdminMobileBlock(): React.JSX.Element;
declare function AdminMobileListings(): React.JSX.Element;
declare function AdminMobileFinance(): React.JSX.Element;
declare function AdminMobileReports(): React.JSX.Element;

export { AdminDashboard, AdminDealConfirm, AdminDeals, AdminFinance, AdminFraud, AdminListings, AdminMobileBlock, AdminMobileDash, AdminMobileDealCancel, AdminMobileDeals, AdminMobileDispute, AdminMobileFinance, AdminMobileFraud, AdminMobileFraudDrill, AdminMobileListings, AdminMobileLogin, AdminMobileMod, AdminMobileModReject, AdminMobileMore, AdminMobileReports, AdminMobileUserDrill, AdminMobileUsers, AdminModeration, AdminReports, AdminShell, Side as AdminSide, Spark as AdminSpark, AdminToast, AdminUserDrill, AdminUsers, aic as adminIc };
