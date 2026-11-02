---
id: ilu-stroicieli-fortepianow-w-warszawie
title: Ilu stroicieli fortepianów pracuje w Warszawie?
hook: Nie wiesz? Ja też nie. Ale w trzy minuty, kartką i rozsądkiem, dojdziemy do wyniku, który nie pomyli się o więcej niż kilka razy.
category: modele
format: fermi
tags: [szacowanie, liczby, skala, myślenie]
confidence: established
confidenceNote: Sama metoda jest dobrze sprawdzona. Konkretne liczby to oczywiście szacunki – chodzi o rząd wielkości.
sources:
  - title: "Wikipedia: Fermi problem"
    url: https://en.wikipedia.org/wiki/Fermi_problem
related: [oddech-cezara, paradoks-fermiego, plot-chestertona]
fermi:
  - step: Mieszkańcy Warszawy
    value: ~1,8 mln
  - step: Gospodarstwa domowe (ok. 2,2 osoby na gospodarstwo)
    value: ~800 tys.
  - step: Gospodarstwa z pianinem lub fortepianem (ok. 1 na 50)
    value: ~16 tys.
  - step: Szkoły muzyczne, sale koncertowe, kościoły, hotele
    value: +~4 tys.
  - step: Strojeń rocznie (średnio co ok. 1,5 roku)
    value: ~13 tys.
  - step: Strojeń na stroiciela rocznie (3 dziennie × ~220 dni)
    value: ~650
  - step: Stroiciele (13 000 / 650)
    value: ~20
quiz:
  question: Dlaczego szacowanie Fermiego działa lepiej, niż można by się spodziewać?
  options:
    - Bo wszystkie szacunki są zawsze dokładne
    - Bo błędy w poszczególnych krokach częściowo się znoszą – niektóre zawyżamy, inne zaniżamy
    - Bo zawsze używa się danych z internetu
    - Bo wynik zaokrągla się do zera
  answer: 1
  explanation: Jeśli nie popełniamy systematycznych błędów w jedną stronę, zawyżenia i zaniżenia w kolejnych krokach mają tendencję do wzajemnego znoszenia się.
recall:
  question: Opisz trzy kroki metody Fermiego na dowolnym przykładzie.
  answer: (1) Rozbij pytanie na czynniki, które da się oszacować (np. liczba osób × odsetek × częstotliwość). (2) Oszacuj każdy czynnik z rozsądnym zaokrągleniem, najlepiej do rzędu wielkości. (3) Pomnóż lub podziel i sprawdź, czy wynik ma sens. Jeśli możesz, porównaj go z jakąś znaną wielkością.
added: 2026-11-02
---

## Prosto

Czasem nie znamy odpowiedzi, ale możemy ją dobrze zgadnąć. Dzielimy wielkie pytanie na małe pytania, na które umiemy odpowiedzieć, na przykład: ilu jest ludzi, ile domów ma pianino, ile pianin jeden człowiek nastroi w ciągu dnia. Potem to mnożymy i dzielimy.

## Wyjaśnienie

Enrico Fermi, laureat Nobla z fizyki, uwielbiał zadawać studentom pytania takie jak **„Ilu stroicieli fortepianów jest w Chicago?”**. Nikt nie zna odpowiedzi z głowy. Chodziło o to, żeby nauczyć się **rozkładać problem na kawałki**, które da się oszacować.

Zróbmy to dla Warszawy (kroki są obok):

1. W Warszawie mieszka ok. **1,8 mln** osób, czyli ok. **800 tys.** gospodarstw domowych.
2. Pianino lub fortepian ma może **1 na 50** gospodarstw – ok. 16 tys. Do tego szkoły muzyczne, uczelnie, sale koncertowe, hotele, kościoły – powiedzmy **20 tys.** instrumentów łącznie.
3. Instrumenty stroi się średnio **co rok–dwa** (koncertowe dużo częściej, domowe dużo rzadziej). Wychodzi ok. **13 tys. strojeń rocznie**.
4. Jedno strojenie z dojazdem to ok. 2–3 godziny, więc stroiciel robi ok. **3 dziennie**, ok. **650 rocznie**.
5. 13 000 / 650 ≈ **20 stroicieli**.

Czy to dokładnie 20? Na pewno nie. Ale wynik rzędu **kilkunastu–kilkudziesięciu** jest bardzo prawdopodobny. Na pewno nie 2 i na pewno nie 2000. Na tym polega siła tej metody: zamiast „nie wiem”, dostajesz rozsądny przedział i wiesz, które założenie najbardziej na niego wpływa.

## Ekspert

Statystycznie metoda działa, bo logarytm wyniku to suma logarytmów czynników. Jeśli błędy szacunków są niezależne i nieobciążone, ich wariancje się sumują, a odchylenie standardowe rośnie jak √n, a nie liniowo. Przy 5–7 czynnikach, z których każdy znamy z dokładnością do czynnika ~2, wynik zwykle mieści się w granicach czynnika ~3–5. Kluczowe jest unikanie błędów skorelowanych (np. systematycznego optymizmu we wszystkich krokach) oraz „analiza wrażliwości”, czyli sprawdzenie, który czynnik dominuje niepewność.

## Głębiej

Sam Fermi oszacował siłę pierwszego wybuchu jądrowego (test Trinity, 1945), puszczając skrawki papieru w chwili nadejścia fali uderzeniowej i mierząc, jak daleko je zdmuchnęło. Jego wynik, ok. 10 kiloton TNT, był w tym samym rzędzie wielkości co późniejsze dokładne pomiary (ok. 20 kiloton).

Ta umiejętność przydaje się na co dzień: ile naprawdę kosztuje mnie subskrypcja w skali 10 lat, ile czasu tracę w korkach rocznie, czy dana statystyka w wiadomościach w ogóle ma sens.
