import React from 'react';

declare function PdLanding({ platform, auth }: {
    platform?: string | undefined;
    auth?: boolean | undefined;
}): React.JSX.Element;
declare namespace PdLanding {
    export { LandingNav as _navComp };
}
declare function PdLandingNav({ auth, desk }: {
    auth?: boolean | undefined;
    desk?: boolean | undefined;
}): React.JSX.Element;

declare function LandingNav({ auth, desk }: {
    auth?: boolean | undefined;
    desk?: boolean | undefined;
}): React.JSX.Element;

export { PdLanding, PdLandingNav };
