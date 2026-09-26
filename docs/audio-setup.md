# Real voices for Papaya

Papaya can read every word with a real, clear, kid-friendly voice instead of the
phone's built-in one. The voice files are made once with a script and shipped with
the app, so playing them costs nothing and sounds the same on every device.

## One-time setup (about 15 minutes)

1. Make a free Azure account at portal.azure.com and create a **Speech** resource
   (search "Speech" in the portal, region `eastus` is fine, pricing tier **S0**).
   The F0 free tier works for testing, but its terms do not allow shipping the
   audio, and S0 costs well under one dollar for all of Papaya's clips.
2. In the Speech resource, open **Keys and Endpoint** and copy Key 1 and the region.
3. In a terminal inside the project:

```bash
AZURE_SPEECH_KEY=your-key AZURE_SPEECH_REGION=eastus npx tsx scripts/generate-audio.mts
```

4. Wait a few minutes. It writes about 700 small MP3 files into `public/audio/`
   (roughly 10 MB) and a `manifest.json` that lists them.
5. Commit and push. Vercel ships the files with the app. Done: every speaker
   button now plays the recorded voice, and the phone voice is only used for lines
   that have no file.

Re-run the script whenever words or stories are added. It skips files that exist.

## Voices

- Spanish: `es-CO-GonzaloNeural`, a Colombian male voice, read a little slower and a
  touch higher so it sounds young and friendly. Try `es-CO-SalomeNeural` (female) by
  running with `VOICE_ES=es-CO-SalomeNeural`.
- English: `en-US-AnaNeural`, Azure's child voice. Try `VOICE_EN=en-US-JennyNeural`
  for an adult voice.

## The dream version

The nicest possible narrator is Andre. ElevenLabs can clone your own voice from a
few minutes of recording (their terms allow cloning your own voice only), and the
script can be pointed at it later. Kids would hear Papá teaching them Spanish.

See `docs/research/voices.md` for the full comparison of services and costs.
