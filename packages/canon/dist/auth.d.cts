import React from 'react';

declare function OAuthBtn({ k, primary, slot }: {
    k: any;
    primary: any;
    slot: any;
}): React.JSX.Element;
declare function OauthList({ plat, slots }: {
    plat: any;
    slots: any;
}): React.JSX.Element;
declare function AuthChooser({ plat, slots }: {
    plat?: string | undefined;
    slots: any;
}): React.JSX.Element;
declare function AuthOAuthSheet({ plat, prov, slots }: {
    plat?: string | undefined;
    prov?: string | undefined;
    slots: any;
}): React.JSX.Element;
declare function AuthPhone({ plat, state }: {
    plat?: string | undefined;
    state?: string | undefined;
}): React.JSX.Element;
declare function AuthOtp({ plat, state }: {
    plat?: string | undefined;
    state?: string | undefined;
}): React.JSX.Element;
declare function AuthRegister({ plat, state }: {
    plat?: string | undefined;
    state?: string | undefined;
}): React.JSX.Element;
declare function AuthLink({ plat }: {
    plat?: string | undefined;
}): React.JSX.Element;
declare function AuthWelcome({ plat }: {
    plat?: string | undefined;
}): React.JSX.Element;
declare function AuthError({ plat, offline }: {
    plat?: string | undefined;
    offline?: boolean | undefined;
}): React.JSX.Element;
declare function AuthBlocked({ plat }: {
    plat?: string | undefined;
}): React.JSX.Element;
declare function AuthDesktopChooser({ slots }: {
    slots: any;
}): React.JSX.Element;
declare function AuthDesktopOAuth({ prov, slots }: {
    prov?: string | undefined;
    slots: any;
}): React.JSX.Element;
declare function AuthDesktopPhone({ state }: {
    state?: string | undefined;
}): React.JSX.Element;
declare function AuthDesktopOtp({ state }: {
    state?: string | undefined;
}): React.JSX.Element;
declare function AuthDesktopRegister({ state }: {
    state?: string | undefined;
}): React.JSX.Element;
declare function AuthDesktopWelcome(): React.JSX.Element;
declare function AuthDesktopLink(): React.JSX.Element;
declare function AuthDesktopError({ offline }: {
    offline?: boolean | undefined;
}): React.JSX.Element;
declare function AuthDesktopBlocked(): React.JSX.Element;

export { AuthBlocked, AuthChooser, AuthDesktopBlocked, AuthDesktopChooser, AuthDesktopError, AuthDesktopLink, AuthDesktopOAuth, AuthDesktopOtp, AuthDesktopPhone, AuthDesktopRegister, AuthDesktopWelcome, AuthError, AuthLink, AuthOAuthSheet, AuthOtp, AuthPhone, AuthRegister, AuthWelcome, OAuthBtn, OauthList };
