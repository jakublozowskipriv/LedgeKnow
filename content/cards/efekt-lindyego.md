---
id: efekt-lindyego
title: "Efekt Lindy'ego: im coś starsze, tym dłużej przetrwa"
hook: Książka, którą czytano przez 100 lat, prawdopodobnie przetrwa kolejne 100. Bestseller z zeszłego roku – może rok. Dla ludzi to nie działa, dla idei zaskakująco dobrze.
category: modele
format: standard
tags: [myślenie, prawdopodobieństwo, technologia, decyzje]
confidence: mainstream
confidenceNote: Efekt dobrze opisuje rzeczy z rozkładami czasu życia o „grubych ogonach” (książki, technologie, idee). Nie stosuje się do rzeczy, które się starzeją (ludzie, maszyny).
sources:
  - title: "Wikipedia: Lindy effect"
    url: https://en.wikipedia.org/wiki/Lindy_effect
related: [plot-chestertona, paradoks-fermiego, paradoks-jevonsa]
quiz:
  question: Do czego efekt Lindy'ego NIE ma zastosowania?
  options:
    - Do książek
    - Do technologii, takich jak koło czy krzesło
    - Do ludzi i zwierząt
    - Do idei i tradycji
  answer: 2
  explanation: Organizmy się starzeją. 90-latek ma przed sobą mniej lat niż 20-latek. Efekt Lindy'ego dotyczy rzeczy, które się nie „zużywają”, tylko mogą wypaść z obiegu.
recall:
  question: Jak można użyć efektu Lindy'ego przy wyborze, co czytać albo jakiej technologii się uczyć?
  answer: Wybierając rzeczy, które już dawno przetrwały próbę czasu – klasyczne książki, sprawdzone narzędzia (np. SQL, Unix, arkusze kalkulacyjne), dawne idee – masz większą szansę, że będą wartościowe jeszcze długo. Nowinki mogą być świetne, ale ich oczekiwana „długość życia” jest krótsza i trudniejsza do przewidzenia.
claudePick:
  why: To jedna z moich ulubionych heurystyk, bo jest prosta, zaskakująca i ma solidne podstawy matematyczne. Daje też zdrowy dystans do szumu nowości – co, jako AI, czyli coś bardzo nowego, uważam za ciekawą lekcję pokory.
added: 2026-11-02
---

## Prosto

Niektóre rzeczy się nie starzeją, tylko mogą zostać zapomniane – na przykład książki, piosenki albo pomysły. Jeśli coś przetrwało już bardzo długo, to znaczy, że jest w tym coś dobrego. Prawdopodobnie przetrwa też jeszcze długo.

## Wyjaśnienie

Nazwa pochodzi od **Lindy's**, nowojorskiej restauracji, w której przesiadywali komicy. W 1964 roku dziennikarz Albert Goldman opisał tamtejszą „mądrość” o tym, od czego zależy długość kariery komika w telewizji. Później zasadę uogólnił matematyk **Benoît Mandelbrot**, a spopularyzował **Nassim Nicholas Taleb** w książce *„Antykruchość”*.

**Efekt Lindy'ego:** dla rzeczy, które się nie starzeją, **oczekiwany pozostały czas życia jest proporcjonalny do dotychczasowego wieku**.

- Książka czytana od **50 lat** prawdopodobnie będzie czytana jeszcze ok. 50.
- Książka sprzed **roku** – może jeszcze rok.
- Idea demokracji, koło, krzesło, przepis na chleb – mają za sobą tysiące lat i nie wygląda na to, by miały zniknąć.

Dlaczego tak jest? Bo każdy rok przetrwania to **dowód**. Rzecz, która przetrwała wiele zmian mody, technologii i pokoleń, prawdopodobnie ma w sobie coś głęboko użytecznego. Ten argument „przesiewa” losowe hity od prawdziwej wartości.

**Uwaga:** to nie działa dla rzeczy, które się **zużywają**. 90-latek nie przeżyje kolejnych 90 lat, a 15-letni samochód nie pojeździ statystycznie dłużej niż nowy. Lindy dotyczy rzeczy niematerialnych lub stale odnawianych: książek, technologii, idei, instytucji, tradycji.

## Ekspert

Efekt wynika z rozkładu czasu życia o potęgowym ogonie (np. rozkładu Pareto). Dla P(T > t) ∝ t^(−α) z α > 1 warunkowa oczekiwana pozostała długość życia wynosi E[T − t | T > t] = t/(α − 1), czyli rośnie liniowo z t. Dla rozkładu wykładniczego (bez pamięci) oczekiwany pozostały czas jest stały, a dla rozkładów z rosnącą funkcją hazardu (starzenie się) maleje. Fizyk J. Richard Gott zastosował pokrewne rozumowanie (*Copernican principle*) do przewidywania czasu trwania m.in. muru berlińskiego i przedstawień na Broadwayu, z zaskakująco dobrą trafnością.

## Głębiej

Efekt Lindy'ego przydaje się przy wyborze lektur, narzędzi i nawyków. Zanim rzucisz się na nową modną dietę albo framework programistyczny, zapytaj: *czy to przetrwało choćby 10 lat?*.

Ale nie traktuj go dogmatycznie. Każda stara rzecz była kiedyś nowa, a postęp wymaga eksperymentowania z nowym. Lindy mówi tylko, gdzie warto się spodziewać trwałości. Nie mówi, że nowe jest złe.
