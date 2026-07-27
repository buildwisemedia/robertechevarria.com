# Speaking Reel Audio Remediation

Date: 2026-07-27  
Project: `PROJ-SPEAK-001`  
Scope: horizontal and vertical 63-second speaker reels

## Problem

The published staging reel used distant room and phone-derived source audio. The three selected clips also had materially different source bitrates and room-noise profiles, which made Robert's voice sound thin and inconsistent.

## Processing

All processing ran locally. No event audio was uploaded to an external enhancement service.

1. Extracted the finished reel audio as 48 kHz PCM.
2. Applied DeepFilterNet `0.5.6` speech enhancement with an 18 dB attenuation limit to reduce room and phone noise without fully stripping the live-room character.
3. Applied a speech-focused mastering chain:
   - 75 Hz high-pass filter
   - modest 180 Hz warmth
   - 420 Hz boxiness reduction
   - 3 kHz presence restoration
   - gentle 7 kHz clarity
   - 15.5 kHz low-pass filter
   - RMS compression
4. Balanced the three source cuts to within approximately 1.1 LU before applying a `-1.5 dBTP` ceiling.
5. Normalized the full master to approximately `-16.5 LUFS` integrated.
6. Replaced only the AAC audio streams in both reels. The H.264 video streams were copied bit-for-bit.

## Verification

- Horizontal video-stream SHA-256 before/after: `82e28612f149448fa7e2eb1c4937aa5434ac3483ca9a3cab95f5fa17e7690911`.
- Vertical video-stream SHA-256 before/after: `c31389c05edb6d9accb63068c12a737a89588071e56df5651f8531bb6b41a20f`.
- Final audio: AAC stereo, 48 kHz, approximately 195 kbps.
- Final measured loudness after AAC encoding: `-16.53 LUFS`.
- Final measured true peak after AAC encoding: `-1.49 dBTP`.
- Source-cut loudness after mastering: `-17.16`, `-16.87`, and `-16.02 LUFS`.
- Audio and video both start at `0.000000`.
- Video duration: `63.233333` seconds.
- Audio duration: `63.233000` seconds.
- End-to-end speech transcription completed without fallback.
