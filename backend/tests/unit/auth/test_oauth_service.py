"""OAuth (Auth-Code + PKCE) domain policy — AUTH_HANDOFF §4, SECURITY §10.

Covers the security-critical invariants: state is anti-CSRF + single-use (no
replay), unconfigured providers fail closed, the profile exchange is fail-closed,
and identities resolve to exactly one user (new on first sight)."""

from __future__ import annotations

from app.core.auth.oauth import OAuthService
from app.core.auth.oauth_config import ProviderConfig
from app.core.auth.oauth_ports import OAuthProfile, StoredState
from app.core.errors import NOT_FOUND, OAUTH_FAILED, VALIDATION_ERROR
from app.core.result import Err, Ok

REDIRECT = "https://peredarim.ru/login"


def _cfg(*, client_id: str = "cid", client_secret: str = "sec") -> ProviderConfig:
    return ProviderConfig(
        client_id=client_id,
        client_secret=client_secret,
        authorize_url="https://oauth.yandex.ru/authorize",
        token_url="https://oauth.yandex.ru/token",
        userinfo_url="https://login.yandex.ru/info",
        scope="login:info login:email",
        subject_field="id",
        email_field="default_email",
        name_field="real_name",
        redirect_allowlist=(REDIRECT,),
    )


class FakeStates:
    def __init__(self) -> None:
        self.d: dict[str, StoredState] = {}

    def put(self, state: str, *, provider: str, verifier: str, redirect_uri: str, ttl: int) -> None:
        self.d[state] = StoredState(provider, verifier, redirect_uri)

    def take(self, state: str) -> StoredState | None:
        return self.d.pop(state, None)  # single-use


class FakeClient:
    def __init__(self, profile: OAuthProfile | None) -> None:
        self.profile = profile
        self.calls = 0

    def fetch_profile(
        self, provider: str, *, code: str, verifier: str, redirect_uri: str
    ) -> OAuthProfile | None:
        self.calls += 1
        return self.profile


class FakeIdentities:
    def __init__(self) -> None:
        self.map: dict[tuple[str, str], str] = {}

    def login_or_create(
        self, *, provider: str, subject: str, email: str | None, name: str | None
    ) -> tuple[str, bool]:
        key = (provider, subject)
        if key in self.map:
            return self.map[key], False
        uid = f"u{len(self.map) + 1}"
        self.map[key] = uid
        return uid, True


def _svc(
    *,
    cfg: ProviderConfig | None = None,
    profile: OAuthProfile | None = None,
    states: FakeStates | None = None,
    client: FakeClient | None = None,
    identities: FakeIdentities | None = None,
) -> tuple[OAuthService, FakeStates, FakeClient, FakeIdentities]:
    states = states or FakeStates()
    client = client or FakeClient(profile)
    identities = identities or FakeIdentities()
    svc = OAuthService(
        {"yandex": cfg or _cfg()},
        states,
        client,
        identities,
        state_factory=lambda: "STATE1",
        verifier_factory=lambda: "VERIFIER1",
    )
    return svc, states, client, identities


def test_start_builds_authorize_url_and_persists_state() -> None:
    svc, states, _, _ = _svc()
    res = svc.start("yandex", REDIRECT)
    assert isinstance(res, Ok)
    url = res.value.authorize_url
    assert url.startswith("https://oauth.yandex.ru/authorize?")
    assert "client_id=cid" in url and "state=STATE1" in url
    assert "code_challenge=" in url and "code_challenge_method=S256" in url
    assert "response_type=code" in url
    # verifier persisted under the state (single-use store)
    assert states.d["STATE1"].verifier == "VERIFIER1"


def test_start_unknown_provider_is_not_found() -> None:
    svc, *_ = _svc()
    res = svc.start("evilprov", REDIRECT)
    assert isinstance(res, Err) and res.error.code == NOT_FOUND


def test_start_unconfigured_provider_fails_closed() -> None:
    svc, *_ = _svc(cfg=_cfg(client_id="", client_secret=""))
    res = svc.start("yandex", REDIRECT)
    assert isinstance(res, Err) and res.error.code == OAUTH_FAILED


def test_start_rejects_redirect_uri_off_allowlist() -> None:
    svc, *_ = _svc()
    res = svc.start("yandex", "https://attacker.example/callback")
    assert isinstance(res, Err) and res.error.code == VALIDATION_ERROR


def test_callback_creates_user_on_first_sight() -> None:
    svc, _, _, _ = _svc(profile=OAuthProfile(subject="ya-123", email="a@x.ru", name="Аня"))
    svc.start("yandex", REDIRECT)
    res = svc.callback("yandex", "CODE", "STATE1")
    assert isinstance(res, Ok)
    assert res.value.is_new is True and res.value.user_id == "u1"


def test_callback_logs_in_existing_identity() -> None:
    identities = FakeIdentities()
    identities.map[("yandex", "ya-123")] = "u9"
    svc, _, _, _ = _svc(profile=OAuthProfile(subject="ya-123"), identities=identities)
    svc.start("yandex", REDIRECT)
    res = svc.callback("yandex", "CODE", "STATE1")
    assert isinstance(res, Ok) and res.value.is_new is False and res.value.user_id == "u9"


def test_callback_rejects_unknown_state_without_calling_provider() -> None:
    svc, _, client, _ = _svc(profile=OAuthProfile(subject="x"))
    res = svc.callback("yandex", "CODE", "FORGED_STATE")
    assert isinstance(res, Err) and res.error.code == OAUTH_FAILED
    assert client.calls == 0  # never reached the provider


def test_callback_state_is_single_use_no_replay() -> None:
    svc, _, _, _ = _svc(profile=OAuthProfile(subject="ya-123"))
    svc.start("yandex", REDIRECT)
    assert isinstance(svc.callback("yandex", "CODE", "STATE1"), Ok)
    # replaying the same state must fail (taken/deleted)
    replay = svc.callback("yandex", "CODE", "STATE1")
    assert isinstance(replay, Err) and replay.error.code == OAUTH_FAILED


def test_callback_state_bound_to_its_provider() -> None:
    svc = OAuthService(
        {"yandex": _cfg(), "vk": _cfg()},
        states := FakeStates(),
        FakeClient(OAuthProfile(subject="x")),
        FakeIdentities(),
        state_factory=lambda: "STATE1",
        verifier_factory=lambda: "V",
    )
    svc.start("yandex", REDIRECT)
    # state minted for yandex cannot be used on vk's callback
    res = svc.callback("vk", "CODE", "STATE1")
    assert isinstance(res, Err) and res.error.code == OAUTH_FAILED
    assert "STATE1" not in states.d  # consumed


def test_callback_failed_exchange_fails_closed() -> None:
    svc, _, _, _ = _svc(profile=None)  # provider returns no profile
    svc.start("yandex", REDIRECT)
    res = svc.callback("yandex", "CODE", "STATE1")
    assert isinstance(res, Err) and res.error.code == OAUTH_FAILED
