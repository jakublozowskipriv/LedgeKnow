---
id: sluzowiec-i-koleje-tokio
title: Organizm bez mózgu zaprojektował sieć kolejową Tokio
hook: Śluzowiec – jedna gigantyczna komórka – w ciągu doby odtworzył układ, nad którym inżynierowie pracowali dekady.
category: biologia
format: standard
tags: [sieci, algorytmy, inteligencja, systemy]
confidence: established
sources:
  - title: "Tero i in. (2010), Rules for Biologically Inspired Adaptive Network Design, Science"
    url: https://doi.org/10.1126/science.1177894
  - title: "Wikipedia: Physarum polycephalum"
    url: https://en.wikipedia.org/wiki/Physarum_polycephalum
related: [osmiornica-mysli-ramionami, problem-bizantyjskich-generalow, filtr-blooma]
quiz:
  question: Jaka prosta reguła pozwala śluzowcowi budować wydajne sieci?
  options:
    - Zapamiętuje mapę terenu w swoim mózgu
    - Rurki, przez które płynie dużo cytoplazmy, grubieją, a nieużywane zanikają
    - Kopiuje trasy, którymi poruszają się mrówki
    - Losowo łączy wszystkie punkty i nic nie zmienia
  answer: 1
  explanation: To dodatnie sprzężenie zwrotne – używane ścieżki się wzmacniają, nieużywane zanikają. Z tej lokalnej reguły powstaje globalnie dobra sieć.
recall:
  question: Jak wyglądał eksperyment z Tokio i co wykazał?
  answer: Badacze ułożyli płatki owsiane w miejscach odpowiadających miastom wokół Tokio, a w centrum umieścili śluzowca. Światłem symulowali góry i wybrzeże, których śluzowiec unika. Po ok. 26 godzinach śluzowiec utworzył sieć rurek porównywalną z prawdziwą siecią kolejową pod względem długości, wydajności i odporności na awarie.
added: 2026-11-02
---

## Prosto

Śluzowiec to żółta, galaretowata „plama”, która żyje w lesie i szuka jedzenia. Nie ma mózgu ani nerwów. Naukowcy położyli mu jedzenie w miejscach miast wokół Tokio, a on połączył je siecią rurek bardzo podobną do prawdziwych linii kolejowych.

## Wyjaśnienie

**Physarum polycephalum** to śluzowiec – ani roślina, ani zwierzę, ani grzyb. Przez większość życia jest **jedną komórką** z milionami jąder, która może rozrosnąć się do rozmiarów talerza. Porusza się, rozlewając sieć rurek, przez które pulsuje cytoplazma.

W 2010 roku japońsko-brytyjski zespół ułożył **płatki owsiane** w miejscach odpowiadających 36 miastom wokół Tokio. Śluzowca umieścili w punkcie „Tokio”. Ponieważ śluzowiec unika światła, oświetlili obszary gór i morza, odtwarzając przeszkody, które musieli omijać prawdziwi inżynierowie.

Najpierw śluzowiec rozlał się wszędzie. Potem zaczął przycinać sieć: rurki, przez które płynęło dużo cytoplazmy, **grubiały**, a te mało używane **zanikały**. Po ok. 26 godzinach powstała sieć, która **pod względem kosztu, wydajności i odporności na przerwanie** była porównywalna z siecią kolejową Tokio.

Kluczowy wniosek: do rozwiązania trudnego problemu optymalizacji **nie potrzeba centralnego planisty**. Wystarczy prosta lokalna reguła powtarzana miliony razy. Badacze opisali ją matematycznie, a powstały model inspiruje dziś prace nad projektowaniem odpornych sieci – od transportu po telekomunikację.

## Ekspert

Model matematyczny Tero i in. opisuje każdą rurkę jako przewodnik o przepływie Q zależnym od różnicy ciśnień (prawo Hagena-Poiseuille'a). Przewodność D zmienia się zgodnie z dD/dt = f(|Q|) − γD, gdzie f to rosnąca funkcja przepływu. Przy f sigmoidalnym sieć zbiega do kompromisu między minimalnym drzewem rozpinającym (tanie, ale kruche) a grafem pełnym (odporne, ale drogie). To heurystyka podobna w duchu do algorytmów mrówkowych, ale działająca w sposób ciągły i w pełni rozproszony.

## Głębiej

Ten sam zespół (Nakagaki i in.) już w 2000 roku pokazał, że śluzowiec **rozwiązuje labirynt**, wybierając najkrótszą drogę do jedzenia. Przyniosło im to w 2008 roku satyryczną nagrodę Ig Nobla, a za sieć kolejową – drugą, w 2010 roku.

Śluzowce mają też coś w rodzaju „pamięci zewnętrznej”: zostawiają ślad śluzu i unikają miejsc, które już przeszukały. Przypomina to trochę sposób, w jaki my zapisujemy notatki zamiast trzymać wszystko w głowie.
