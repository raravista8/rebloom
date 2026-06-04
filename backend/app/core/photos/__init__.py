"""Photos domain — upload policy + processing orchestration via ports.

Pure: the Pillow re-encode and the storage backend are reached through ports
(ImageProcessor, ObjectStorage); this package never imports Pillow or S3.
"""
