# ADR-0009: Telegram bot egress via proxy/relay outside RF
Date: 2026-06-03
Status: Proposed (нужен выбор провайдера прокси)

## Context
`api.telegram.org` заблокирован с RF-VPS (факт из `vitrina`, OPERATIONS §4). Бот — обязательный канал. Прямой egress с прода невозможен.

## Decision
Egress бота к Telegram идёт через **прокси/relay вне РФ**. Варианты:
- (A) **Managed-прокси/SOCKS5/HTTPS вне РФ** — `TG_PROXY_URL` в конфиге aiogram; простейшее.
- (B) **Свой relay-узел вне РФ** (мини-VM + прокси) — больше контроля, свой security-периметр.
- (C) **Размещение bot-компонента на инфраструктуре с доступом к Telegram** — bot отдельно от RF-app, ходит в API по HTTPS.
Рекомендация для MVP: (A) или (C); (B) — если нужен полный контроль.

## Consequences
Positive: бот работает с прода.
Negative: прокси — доп. зависимость и точка отказа/безопасности (доступ к токену!). Прокси-узел — в периметре аудита; токен не логируется; канал шифрован.
Open: выбор конкретного провайдера/узла — за оператором.

## Verification
Бот подключается к Telegram только через `TG_PROXY_URL`; healthcheck бота проверяет доступность; токен не утекает в логи (SECURITY).
