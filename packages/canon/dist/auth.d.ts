import React from 'react';

declare function OAuthBtn({ k, primary }: {
    k: any;
    primary: any;
}): React.JSX.Element;
declare function OauthList({ plat }: {
    plat: any;
}): React.JSX.Element;
declare function AuthChooser({ plat }: {
    plat?: string | undefined;
}): React.JSX.Element;
declare function AuthOAuthSheet({ plat, prov }: {
    plat?: string | undefined;
    prov?: string | undefined;
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
declare function AuthDesktopChooser(): React.JSX.Element;
declare function AuthDesktopOAuth(): React.JSX.Element;
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

export { AuthBlocked, AuthChooser, AuthDesktopChooser, AuthDesktopOAuth, AuthDesktopOtp, AuthDesktopPhone, AuthDesktopRegister, AuthDesktopWelcome, AuthError, AuthLink, AuthOAuthSheet, AuthOtp, AuthPhone, AuthRegister, AuthWelcome, OAuthBtn, OauthList };
