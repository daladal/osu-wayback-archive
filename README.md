# osu! puush archive index

An index of osu! replays, skins, beatmaps that were uploaded to puu.sh and captured by the Wayback Machine.
This data was collected on 2026-09-09. 

Every file should be downloadable through its `wayback_url` link.

This index was created after akozn published [their discovery](https://www.reddit.com/r/osugame/comments/1wbetqq/replay_found_niko_iconoclasm_perditus_paradisus/) of Niko's 2011 perditus paradisus DT replay on Reddit, demonstrating that there's potentially a huge amount of old osu! content archived on the Wayback Machine that was otherwise lost to time.

## Data collection

Every puu.sh URL captured by the Wayback Machine can be obtained by querying the [CDX index](https://github.com/internetarchive/wayback/tree/master/wayback-cdx-server) for octet-streams and zip files:

```
https://web.archive.org/cdx/search/cdx?url=puu.sh/4&matchType=prefix&filter=mimetype:application/octet-stream (mimetype:application/zip for zip files)
```

Each result gives a timestamp and puush ID, which is enough to download the capture and check whether it contains osu!-related files:

```
https://web.archive.org/web/{timestamp}id_/http://puu.sh/{id}
```

## Result

| type | rows | approx. distinct files | file |
|---|---|---|---|
| Replays (`.osr`) | 24,574 | 24,574 (one row per unique replay; 3,527 re-uploads folded into `copies`) | `replays_osr.jsonl` |
| Skins (`.osk` + skin `.zip`) | 2,658 | ~1,730 by filename, ~2,440 by filename+size | `skins_osk.jsonl`, `skins_zip.jsonl` |
| Beatmaps (`.osz` + beatmap `.zip`) | 25,960 | ~14,770 by filename, ~25,670 by filename+size | `beatmaps_osz.jsonl`, `beatmaps_zip.jsonl` |

- 5,502 distinct player names and 8,639 distinct beatmaps across the replays.
- 169 `.zip` archives containing 1,020 more `.osr` files (`replays_zip.jsonl`).
- 89 `.zip` archives containing `.osk` / `.osz` files inside them.

Many uploads share a name but differ in size (re-exports, edited skins, updated maps) and are counted separately. 

Please report any dead links for removal.
