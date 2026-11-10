# LedgeKnow ✦

**Codzienna porcja losowej, ciekawej wiedzy** – mini-wykłady z kilkunastu dziedzin, podane krótko i tak, żeby naprawdę objaśniały koncepty. Webapp na telefon (PWA), ciemny vaporwave, działa offline i co tydzień dostaje paczkę nowych kart wygenerowanych i zweryfikowanych przez Claude'a – publikowanych w aplikacji po jednej dziennie.

---

## Co jest w środku

| Funkcja | Gdzie |
|---|---|
| **Karta dnia** – stała przez cały dzień, wybierana z nieprzeczytanych | Dziś |
| **Feed do przewijania** (pełnoekranowe karty, jak w apkach z krótkimi filmami) | Odkrywaj |
| **Wybór Claude'a** – tematy, które Claude uważa za fascynujące, z notką „dlaczego” | Claude |
| **3 poziomy wyjaśnienia**: Prosto / Normalnie / Ekspert + rozwijane „Głębiej” | każda karta |
| **Poziom pewności** (ustalone / dominująca hipoteza / trwa debata / spekulacja) i **źródła** | każda karta |
| **Quiz** + **„Wyjaśnij to sam”** (aktywne przypominanie) | każda karta |
| **Powtórki rozłożone w czasie** – przeczytane karty wracają po 1, 3, 7, 16, 35… dniach | Powtórki |
| **Królicza nora** – powiązane karty i „losuj kolejną” | koniec karty |
| **Reakcje 🤯 / 👍 / 😐** – lokalny algorytm uczy się, co lubisz | koniec karty |
| **Mapa wiedzy** – graf poznanych konceptów i tych „na horyzoncie” | Ja → Mapa |
| Seria dni, statystyki, postęp w dziedzinach | Ja |
| Zakładki i własne **kolekcje** | ikona zakładki / Ja |
| Formaty specjalne: **Obalamy mit**, **Otwarte pytanie**, **Szacowanie Fermiego**, **Tego dnia** | w treściach |
| **Tydzień tematyczny** (rotuje co tydzień) i **Świeżo dodane** | Dziś |
| **Udostępnianie karty jako grafiki** (1080×1350) | ikona udostępniania |
| **Czytanie na głos** (polski głos systemowy) | ikona głośnika |
| Wyszukiwarka i przeglądanie dziedzin | Odkrywaj → 🔍 |
| **Powiadomienia push** w losowych porach dnia (bez własnego serwera) | Ja → Powiadomienia |
| Offline, tryb aplikacji na ekranie głównym, eksport/import postępu | Ja → Ustawienia |

Postęp (przeczytane, reakcje, powtórki, kolekcje) jest zapisany **lokalnie w telefonie** – bez kont i bez śledzenia.

## Jak to działa

```
content/cards/*.md        ← karty wiedzy (Markdown + frontmatter YAML)
        │  npm run content (walidacja + Markdown → HTML)
        ▼
public/data/cards.json    ← paczka treści dla aplikacji
        │  vite build
        ▼
dist/                     ← statyczna PWA (GitHub Pages)

GitHub Actions:
  generate.yml  poniedziałki ~5:20 → Claude (z wyszukiwaniem w sieci) pisze 7 kart → commit → deploy
                                   (każda karta ma datę publikacji – aplikacja odsłania ok. 1 dziennie)
  notify.yml    co 2 h, 7–22      → „rzut kostką” → push z hakiem losowej karty (śr. ~3/dzień)
  deploy.yml    przy każdym pushu na main → build → GitHub Pages
```

Stack: **Preact + TypeScript + Vite + vite-plugin-pwa (Workbox)**, proceduralne okładki SVG, zero backendu.

---

## Uruchomienie – krok po kroku

### 1. Zmerguj gałąź do `main`

Workflowy (generator, powiadomienia, deploy) działają z gałęzi domyślnej.

### 2. Hosting na GitHub Pages

*Settings → Pages → Build and deployment → Source: **GitHub Actions***.

> ⚠️ Repozytorium jest **prywatne**. GitHub Pages dla prywatnych repo wymaga planu GitHub Pro/Team. Masz trzy opcje:
> - **upublicznić repo** (treści nie są tajne, a sekrety – klucz API, klucze VAPID, subskrypcja – nadal pozostają prywatne),
> - wykupić GitHub Pro,
> - albo podpiąć repo do **Cloudflare Pages / Netlify** (darmowe dla prywatnych repo): build command `npm run build`, output `dist`. Aplikacja używa ścieżek względnych, więc działa pod każdym adresem.

Po pierwszym deployu (zakładka *Actions → Deploy*) aplikacja będzie pod adresem typu `https://jakublozowskipriv.github.io/LedgeKnow/`.

### 3. Na iPhonie

Otwórz adres w **Safari** → *Udostępnij* → **Do ekranu początkowego**. Od teraz uruchamiaj LedgeKnow z ikony (pełny ekran, offline, powiadomienia).

> Aplikacja z ekranu głównego ma osobny magazyn danych niż karta w Safari – postęp zbierasz w tej z ikony.

### 4. Codzienne nowe karty (Claude API)

1. Załóż klucz w [Anthropic Console](https://console.anthropic.com/) i **ustaw limit wydatków** (Billing → Limits).
2. Repo → *Settings → Secrets and variables → Actions → Secrets* → **`ANTHROPIC_API_KEY`**.
3. Test: *Actions → „Nowe karty (Claude)” → Run workflow*.

Opcjonalne zmienne (*Variables*):

| Zmienna | Domyślnie | Opis |
|---|---|---|
| `LEDGEKNOW_CARDS` | `7` | ile kart w tygodniowej paczce (jedna to zawsze „Wybór Claude'a”) |
| `LEDGEKNOW_SPREAD_DAYS` | `7` | na ile dni rozłożyć publikację kart z paczki (`0` = wszystkie od razu) |
| `LEDGEKNOW_MODEL` | `claude-opus-5-5` | model; `claude-sonnet-5-5` jest ~2× tańszy |
| `LEDGEKNOW_EFFORT` | `high` | głębokość myślenia: `low` … `max` |

**Koszt:** generator działa raz w tygodniu. Pętla korzysta z prompt cachingu (kolejne tury czytają wcześniejszą rozmowę z cache po ułamku ceny), a log kroku „Generuj karty” na końcu podaje zużycie tokenów i liczbę wyszukiwań – z niego i z Console sprawdzisz realny koszt paczki. Dalsze dźwignie: mniej kart (`LEDGEKNOW_CARDS`), niższy `LEDGEKNOW_EFFORT` (np. `medium`) albo tańszy model (`claude-sonnet-5-5`) – każda z nich to już kompromis jakości, więc najlepiej zmieniać jedną naraz i porównać karty.

Generator: każda karta przechodzi walidację (schemat, długość, quiz, duplikaty), linki do źródeł są sprawdzane, a aplikacja musi się zbudować – dopiero wtedy idzie commit i deploy. Styl i zasady redakcyjne są w [`scripts/prompts/style.md`](scripts/prompts/style.md) – edytuj śmiało.

### 5. Powiadomienia push (opcjonalnie)

1. Wygeneruj klucze: `npx web-push generate-vapid-keys`
2. *Variables*: **`VAPID_PUBLIC_KEY`** (klucz publiczny), opcjonalnie `VAPID_SUBJECT` (np. `mailto:twoj@mail`).
   *Secrets*: **`VAPID_PRIVATE_KEY`** (klucz prywatny).
3. Przebuduj aplikację: *Actions → Deploy → Run workflow*.
4. Na iPhonie, w aplikacji z ekranu głównego: **Ja → Powiadomienia → Włącz** → **Kopiuj subskrypcję**.
5. Wklej ją jako sekret **`PUSH_SUBSCRIPTION`**.
6. Test: *Actions → „Powiadomienia” → Run workflow* (z „Wyślij na pewno”).

Częstotliwość zmienisz zmienną `NOTIFY_PROBABILITY` (domyślnie `0.4` × 8 slotów ≈ 3 dziennie) albo cronem w `notify.yml`.

> Minuty GitHub Actions w prywatnym repo (2000/mies. za darmo): powiadomienia ~250, generator ~30, deploy ~30 minut miesięcznie – mieści się z zapasem.

---

## Praca lokalna

```bash
npm install
npm run dev          # waliduje treści i startuje serwer deweloperski
npm run build        # pełny build produkcyjny (PWA)
npm run typecheck
npm run check-links  # sprawdza linki do źródeł
LEDGEKNOW_DRY_RUN=1 npm run generate   # podgląd planu i promptu bez wołania API
```

### Format karty

Każda karta to plik `content/cards/<id>.md`:

```markdown
---
id: moja-karta
title: Tytuł
hook: Jedno-dwa zdania, które wciągają.
category: psychologia        # patrz src/shared/constants.ts
format: standard             # standard | myth | open-question | fermi
tags: [umysł, pamięć]
confidence: established      # established | mainstream | debated | speculative
confidenceNote: (opcjonalnie)
sources:
  - title: "Wikipedia: ..."
    url: https://...
related: [id-innej-karty]
quiz:
  question: ...
  options: [A, B, C, D]
  answer: 1
  explanation: ...
recall:
  question: ...
  answer: ...
claudePick:                  # (opcjonalnie) – trafia do sekcji „Wybór Claude'a”
  why: ...
onThisDay: 03-23             # (opcjonalnie) MM-DD
added: 2026-11-02
---

## Prosto
…
## Wyjaśnienie
…
## Ekspert
…
## Głębiej
…
```

Wartości z dwukropkiem i spacją (`: `) w YAML-u trzeba wziąć w cudzysłów. `npm run content` wskaże dokładnie, co jest nie tak.

## Pomysły na kolejne wersje

- synchronizacja postępu między urządzeniami (np. prywatny gist albo mały backend),
- prawdziwe ilustracje/diagramy do wybranych kart,
- „zapytaj Claude'a” o kartę wprost z aplikacji,
- tryb dla znajomych: wspólne kolekcje, wyzwania quizowe.
