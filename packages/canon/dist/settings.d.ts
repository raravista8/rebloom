import React from 'react';

declare function Switch({ on }: {
    on: any;
}): React.JSX.Element;
declare function SettingsHub({ plat }: {
    plat?: string | undefined;
}): React.JSX.Element;
declare function SettingsProfile({ plat, state }: {
    plat?: string | undefined;
    state?: string | undefined;
}): React.JSX.Element;
declare function SettingsLogins({ plat }: {
    plat?: string | undefined;
}): React.JSX.Element;
declare function SettingsNotifications({ plat }: {
    plat?: string | undefined;
}): React.JSX.Element;
declare function SettingsPrivacy({ plat }: {
    plat?: string | undefined;
}): React.JSX.Element;
declare function SettingsSecurity({ plat }: {
    plat?: string | undefined;
}): React.JSX.Element;
declare function SettingsDelete({ plat, state }: {
    plat?: string | undefined;
    state?: string | undefined;
}): React.JSX.Element;
declare function SettingsDesktop({ screen }: {
    screen?: string | undefined;
}): React.JSX.Element;

export { Switch as PdSwitch, SettingsDelete, SettingsDesktop, SettingsHub, SettingsLogins, SettingsNotifications, SettingsPrivacy, SettingsProfile, SettingsSecurity };
