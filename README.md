# osu! wayback machine archive

[Website](https://osu-wayback-archive.pages.dev/)

An index of osu! replays, skins, and beatmap files that were uploaded to puu.sh and captured by the Wayback Machine. This data was collected on 2026-09-09.

Every file should be downloadable through its `wayback_url` link.

This index was created after akozn published [their discovery](https://www.reddit.com/r/osugame/comments/1wbetqq/replay_found_niko_iconoclasm_perditus_paradisus/) of Niko's 2011 perditus paradisus DT replay on Reddit, demonstrating that there's potentially a huge amount of old osu! content archived on the Wayback Machine that was otherwise lost to time.


## Data collection

Every URL captured by the Wayback Machine can be obtained by querying the [CDX index](https://github.com/internetarchive/wayback/tree/master/wayback-cdx-server) for octet-streams, zip files, or plain text:

```
https://web.archive.org/cdx/search/cdx?url=puu.sh/4&matchType=prefix&filter=mimetype:application/octet-stream
```

Each result gives a timestamp and puush ID, which is enough to download the capture and check whether it contains osu!-related files:

```
https://web.archive.org/web/{timestamp}id_/http://puu.sh/{id}
```

## Result

### puu.sh (`puush/`)

| type | rows | approx. distinct files | file |
|---|---|---|---|
| Replays (`.osr`) | 24,574 | 24,574 (one row per unique replay; 3,527 re-uploads folded into `copies`) | `replays_osr.jsonl` |
| Skins (`.osk` + skin `.zip`) | 2,682 | ~1,710 by filename, ~2,460 by filename+size | `skins_osk.jsonl`, `skins_zip.jsonl` |
| Skins (`.rar`) | 3,378 | ~1,920 by filename, ~2,980 by filename+size | `skins_rar.jsonl` |
| Skins (`.7z`) | 147 | ~100 by filename, ~140 by filename+size | `skins_7z.jsonl` |
| Beatmaps (`.osz` + beatmap `.zip`) | 27,804 | ~14,370 by filename, ~25,620 by filename+size | `beatmaps_osz.jsonl`, `beatmaps_zip.jsonl` |
| Beatmaps (`.rar`) | 7,603 | ~5,120 by filename, ~7,240 by filename+size | `beatmaps_rar.jsonl` |
| Beatmaps (`.7z`) | 175 | ~150 by filename, ~170 by filename+size | `beatmaps_7z.jsonl` |
| Beatmap files (`.osu`) | 75 | 64 by filename, 70 by filename+size | `beatmaps_osu.jsonl` |

- 5,501 distinct player names and 8,639 distinct beatmaps across the replays.
- 169 `.zip`, 503 `.rar` and 14 `.7z` archives containing 2,668 more `.osr` files (`replays_zip.jsonl`, `replays_rar.jsonl`, `replays_7z.jsonl`).
- 168 archives containing `.osk` / `.osz` files inside them (`nested_archives.jsonl`).

### a.pomf.se (`pomf/`)

| type | rows | approx. distinct files | file |
|---|---|---|---|
| Replays (`.osr`) | 1,018 | 1,018 (17 re-uploads folded into `copies`) | `replays_osr.jsonl` |
| Skins (`.osk` + skin `.zip`) | 744 | 744 | `skins_osk.jsonl`, `skins_zip.jsonl` |
| Skins (`.rar` + `.7z`) | 14 | 14 | `skins_rar.jsonl`, `skins_7z.jsonl` |
| Beatmaps (`.osz` + beatmap `.zip`) | 650 | 650 | `beatmaps_osz.jsonl`, `beatmaps_zip.jsonl` |
| Beatmap files (`.osu`) | 121 | 121 | `beatmaps_osu.jsonl` |

- 315 distinct player names and 769 distinct beatmaps across the replays.
- 1 archive containing an `.osz` inside it (`nested_archives.jsonl`).
- pomf filenames are random host ids, so every row is a distinct upload; over 98% of these files are not on puush.

### up.ppy.sh (`upppy/`)

| type | rows | approx. distinct files | file |
|---|---|---|---|
| Skins (`.osk` + skin `.zip`) | 18 | 18 | `skins_osk.jsonl`, `skins_zip.jsonl` |
| Skins (`.rar`) | 18 | 18 | `skins_rar.jsonl` |
| Beatmaps (`.osz` + beatmap `.zip`) | 2 | 2 | `beatmaps_osz.jsonl` |
| Beatmaps (`.rar`) | 2 | 2 | `beatmaps_rar.jsonl` |
| Beatmap files (`.osu`) | 9 | 9 | `beatmaps_osu.jsonl` |

- No replays were found on up.ppy.sh.

Many uploads share a name but differ in size (re-exports, edited skins, updated maps) and are counted separately.

Please report any dead links for removal or reach out if you discover content that should not be displayed.
