---
id: prawo-benforda
title: "Prawo Benforda: dlaczego tyle liczb zaczyna się od jedynki"
hook: W rachunkach, populacjach miast i długościach rzek prawie 1/3 liczb zaczyna się od 1, a tylko 5% od 9. Wykorzystują to łowcy oszustów.
category: matematyka
format: standard
tags: [liczby, skala, paradoks, wykrywanie-oszustw]
confidence: established
confidenceNote: Prawo jest dobrze opisane matematycznie, ale obowiązuje tylko dla danych rozciągających się na wiele rzędów wielkości. Nie każde odstępstwo oznacza oszustwo.
sources:
  - title: "Wikipedia: Benford's law"
    url: https://en.wikipedia.org/wiki/Benford%27s_law
related: [paradoks-dnia-urodzin, problem-collatza, szczury-z-hanoi]
quiz:
  question: Jaki odsetek liczb w danych zgodnych z prawem Benforda zaczyna się od cyfry 1?
  options:
    - ok. 11% – tyle samo co każda inna cyfra
    - ok. 30%
    - ok. 50%
    - ok. 90%
  answer: 1
  explanation: log₁₀(2) ≈ 30,1%. Dla porównania cyfra 9 jest pierwszą cyfrą tylko w ok. 4,6% przypadków.
recall:
  question: Wyjaśnij intuicyjnie, czemu jedynka jest pierwszą cyfrą tak często.
  answer: Żeby wartość rosnąca (np. kwota albo populacja) przeszła z 1000 do 2000, musi się podwoić. Żeby przejść z 9000 do 10 000, wystarczy wzrost o 11%. Na skali logarytmicznej odcinek „od 1 do 2” jest najdłuższy, więc wielkości rozłożone równomiernie w skali logarytmicznej najdłużej „przebywają” w przedziale zaczynającym się od 1.
claudePick:
  why: Prawo Benforda to dla mnie kwintesencja tego, co piękne w matematyce. Ukryty porządek pojawia się w danych, które wydają się zupełnie przypadkowe, a do tego ma praktyczne zastosowanie w łapaniu oszustów.
added: 2026-11-02
---

## Prosto

Weź dużo prawdziwych liczb: ceny, liczby mieszkańców miast, długości rzek. Spójrz na pierwszą cyfrę każdej z nich. Najczęściej zobaczysz jedynkę, prawie co trzeci raz. Dziewiątkę zobaczysz bardzo rzadko. Ludzie, którzy zmyślają liczby, zwykle o tym nie wiedzą.

## Wyjaśnienie

W 1881 roku astronom **Simon Newcomb** zauważył dziwną rzecz. W księgach tablic logarytmicznych, z których korzystali naukowcy, pierwsze strony (liczby zaczynające się od 1) były **znacznie bardziej zniszczone** niż ostatnie. W 1938 roku fizyk **Frank Benford** sprawdził to na ponad 20 tysiącach liczb z różnych źródeł – od powierzchni rzek po adresy ulic.

Wynik: pierwsza cyfra **nie** jest rozłożona równomiernie. Częstość cyfry d wynosi log₁₀(1 + 1/d):

- **1** – ok. 30,1%
- **2** – ok. 17,6%
- **3** – ok. 12,5%
- …
- **9** – ok. 4,6%

Dlaczego? Pomyśl o wielkościach, które **rosną multiplikatywnie** albo rozciągają się na wiele rzędów wielkości. Firma z przychodem 1 mln zł musi go *podwoić*, żeby zacząć od dwójki. Firma z 9 mln zł potrzebuje tylko 11% wzrostu, żeby wskoczyć na 10 mln i znowu zacząć od jedynki. Liczby „spędzają więcej czasu” w zakresie jedynki.

**Zastosowanie:** zmyślone liczby (np. w fałszywych fakturach albo zeznaniach podatkowych) często mają pierwsze cyfry rozłożone zbyt równo. Audytorzy i biegli rewidenci używają testu Benforda jako sygnału ostrzegawczego.

## Ekspert

Prawo Benforda to rozkład równomierny mantysy log₁₀(x) mod 1. Wynika z niezmienniczości względem skali (jeśli prawo działa w złotówkach, musi działać też w dolarach) i niezmienniczości względem podstawy. Hill (1995) pokazał, że losowe próbki z losowo wybranych rozkładów dążą do rozkładu Benforda. Prawo nie obowiązuje dla danych o wąskim zakresie (wzrost ludzi, numery telefonów, ceny ustalane jak 9,99 zł). Analizy wyników wyborów testem Benforda są kontrowersyjne i często błędne, bo wielkości okręgów wyborczych bywają zbliżone.

## Głębiej

Prawo dotyczy też **drugiej cyfry** (tu rozkład jest dużo bardziej płaski: 0 pojawia się w ok. 12%, a 9 w ok. 8,5% przypadków). Spełniają je również stałe fizyczne, liczby Fibonacciego i potęgi dwójki.

Specjalista od kryminalistyki finansowej Mark Nigrini spopularyzował stosowanie prawa w audycie w latach 90. W 2011 roku badacze pokazali, że dane makroekonomiczne raportowane przez Grecję do UE odbiegały od rozkładu Benforda najbardziej ze wszystkich krajów Unii – kilka lat po tym, jak wyszło na jaw, że były fałszowane.
