---
id: paradoks-dnia-urodzin
title: Wystarczą 23 osoby, by dwie miały urodziny tego samego dnia
hook: W klasie 23 uczniów jest ponad 50% szans, że dwoje obchodzi urodziny w ten sam dzień. Intuicja podpowiada, że potrzeba ich ze 180.
category: matematyka
format: standard
tags: [prawdopodobieństwo, paradoks, intuicja, kryptografia]
confidence: established
sources:
  - title: "Wikipedia: Birthday problem"
    url: https://en.wikipedia.org/wiki/Birthday_problem
  - title: "Wikipedia: Birthday attack"
    url: https://en.wikipedia.org/wiki/Birthday_attack
related: [prawo-benforda, filtr-blooma, oddech-cezara]
quiz:
  question: Dlaczego wystarczy tak mało osób?
  options:
    - Bo więcej ludzi rodzi się latem
    - Bo liczy się liczba PAR osób, a ta rośnie bardzo szybko – przy 23 osobach to 253 pary
    - Bo rok przestępny ma 366 dni
    - Bo to tylko złudzenie i w praktyce nie działa
  answer: 1
  explanation: Nie pytamy, czy ktoś ma urodziny tego dnia co TY, tylko czy jakakolwiek para się zgadza. Par jest 23×22/2 = 253.
recall:
  question: Jak paradoks dnia urodzin wpływa na bezpieczeństwo w informatyce?
  answer: Wykorzystuje go „atak urodzinowy” na funkcje skrótu. Żeby znaleźć dowolną kolizję (dwa różne pliki o tym samym skrócie) w N możliwych wartościach, wystarczy ok. √N prób, a nie N. Dlatego skrót 128-bitowy daje tylko ok. 64 bity odporności na kolizje i używa się dłuższych skrótów.
added: 2026-11-02
---

## Prosto

Jeśli w pokoju są 23 osoby, to częściej niż w co drugim przypadku dwie z nich mają urodziny tego samego dnia. Brzmi dziwnie, ale nie chodzi o to, czy ktoś ma urodziny tak jak ty. Chodzi o to, czy jakakolwiek dwójka się zgadza, a takich dwójek jest bardzo dużo.

## Wyjaśnienie

To jeden z najsłynniejszych „paradoksów” prawdopodobieństwa. Nie jest prawdziwą sprzecznością, tylko pokazuje, że intuicja słabo radzi sobie z kombinacjami.

Pułapka polega na tym, że w głowie liczymy coś innego. Myślimy: „szansa, że ktoś ma urodziny tego samego dnia co **ja**”. Ta szansa przy 23 osobach jest rzeczywiście mała (ok. 6%). Ale pytanie brzmi: czy **jakakolwiek para** ma wspólne urodziny?

Przy 23 osobach par jest **253**. Każda z nich ma małą szansę na zgodność (1/365), ale prób jest bardzo dużo.

Łatwiej policzyć sytuację odwrotną, czyli że **wszyscy** mają różne urodziny:

- druga osoba musi trafić w jeden z 364 „wolnych” dni,
- trzecia w jeden z 363,
- i tak dalej.

Mnożąc 365/365 × 364/365 × 363/365 × … dla 23 osób, dostajemy ok. **49,3%**. Zatem szansa na co najmniej jedną parę wynosi **50,7%**. Przy 50 osobach to już 97%, a przy 70 – 99,9%.

## Ekspert

Dla n osób i d dni: P(brak kolizji) = ∏(1 − k/d) dla k = 0…n−1 ≈ exp(−n(n−1)/2d). Próg 50% osiągamy przy n ≈ √(2d·ln 2) ≈ 1,177√d. Stąd ogólna reguła: kolizje w przestrzeni o rozmiarze N pojawiają się po ok. √N losowaniach. Ma to bezpośrednie znaczenie w kryptografii (atak urodzinowy, odporność na kolizje = połowa długości skrótu w bitach) i przy projektowaniu identyfikatorów. Przy 122 losowych bitach w UUIDv4 kolizja staje się prawdopodobna (ok. 50%) dopiero przy ~2⁶¹, czyli ok. 2,3 tryliona identyfikatorów.

## Głębiej

W praktyce urodziny nie rozkładają się równomiernie. W wielu krajach widać wyraźne szczyty (np. ok. 9 miesięcy po świętach) i dołki w dni wolne, gdy rzadziej planuje się cesarskie cięcia. To *zwiększa* szansę na zgodność, więc 23 osoby wystarczają tym bardziej.

Dobry test na imprezę: w grupie ok. 30 osób zapytaj o urodziny. Szansa na trafienie to ok. 70%.
