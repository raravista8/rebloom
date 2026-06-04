# ADR-0011: Server-side image pipeline with Pillow (validate, re-encode, EXIF-strip)

Date: 2026-06-04
Status: Accepted

## Context
Listing photos are untrusted uploads (SECURITY T-04): they may be oversized, polyglot, SVG-XSS, or carry EXIF/GPS that doxxes the seller (FR-011, ФЗ-152). We must validate, re-encode to a safe raster format, strip all metadata, and generate CDN variants (thumb/card/full) — without trusting the client's content-type.

## Decision
Use **Pillow** (PIL fork) for image processing. The pipeline: open the bytes with Pillow (this rejects non-images and SVG, which Pillow won't decode), enforce size/dimension caps, re-encode every variant to **WebP** (a fresh encode that carries **no** source EXIF/GPS), and store variants under random keys via an `ObjectStorage` port. Processing is synchronous on upload for MVP (images are small); moving it to an RQ worker is a later optimization behind the same port.

Image **content** moderation (faces/contacts) needs a model we don't have at MVP — that gap is accepted (SECURITY AR-3), compensated by the dispute window + manual reports + the moderation queue. Technically-valid photos are marked `approved`.

## Alternatives considered
- **ImageMagick / wand** — heavier native dep, larger CVE surface, no benefit over Pillow here.
- **Trust client content-type + serve as-is** — rejected: no EXIF strip, polyglot/SVG-XSS risk.
- **Presigned direct-to-storage only (no re-encode)** — rejected: can't strip EXIF or validate magic bytes server-side.

## Consequences
Positive: EXIF/GPS removed by construction; non-images/SVG rejected; consistent WebP variants for the CDN; storage backend pluggable (local FS in dev, S3 in prod) via the port.
Negative: CPU on the app node for encoding (mitigated: small images, future RQ worker + autoscale).
Neutral: Pillow is MIT-CMU licensed (allowlist OK), actively maintained.

## Verification
`tests/security/test_upload_fuzz.py`: non-image / SVG / oversize rejected; re-encoded output has no EXIF. Pillow pinned in `poetry.lock`.
