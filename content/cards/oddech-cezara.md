---
id: oddech-cezara
title: W twoim wdechu jest cząsteczka z ostatniego oddechu Cezara
hook: Prosty rachunek pokazuje, że prawie każdy twój wdech zawiera atom, który był w płucach Juliusza Cezara.
category: fizyka
format: fermi
tags: [skala, liczby, atmosfera, szacowanie]
confidence: established
confidenceNote: To szacunek rzędu wielkości – zakłada pełne wymieszanie atmosfery. Wynik „około jednej cząsteczki” jest jednak odporny na rozsądne zmiany założeń.
sources:
  - title: "Wikipedia: Fermi problem"
    url: https://en.wikipedia.org/wiki/Fermi_problem
  - title: "Wikipedia: Atmosphere of Earth"
    url: https://en.wikipedia.org/wiki/Atmosphere_of_Earth
related: [ilu-stroicieli-fortepianow-w-warszawie, paradoks-dnia-urodzin]
fermi:
  - step: Objętość jednego wdechu
    value: ~0,5 l
  - step: Cząsteczek w jednym wdechu (0,5 l / 22,4 l × 6×10²³)
    value: ~1×10²²
  - step: Masa atmosfery Ziemi
    value: ~5×10¹⁸ kg
  - step: Cząsteczek w atmosferze (masa / 29 g/mol × 6×10²³)
    value: ~1×10⁴⁴
  - step: Jaka część atmosfery to oddech Cezara (10²² / 10⁴⁴)
    value: ~1×10⁻²²
  - step: Ile „cząsteczek Cezara” w twoim wdechu (10²² × 10⁻²²)
    value: ~1
quiz:
  question: Dlaczego wynik wychodzi bliski jedności?
  options:
    - Bo Cezar miał wyjątkowo duże płuca
    - Bo liczba cząsteczek w jednym oddechu jest podobnego rzędu co liczba oddechów mieszczących się w atmosferze
    - Bo atmosfera jest bardzo cienka
    - Bo to zwykły zbieg okoliczności bez fizycznego znaczenia
  answer: 1
  explanation: Jeden oddech ma ~10²² cząsteczek, a atmosfera ma ich ~10⁴⁴, czyli mieści ~10²² oddechów. Te dwie liczby są przypadkowo bardzo podobne, więc wynik wynosi ~1.
recall:
  question: Jakie jest najważniejsze założenie tego szacunku i czemu jest rozsądne?
  answer: Że cząsteczki wydychane przez Cezara wymieszały się równomiernie w całej atmosferze. Ponad 2000 lat to bardzo długo, a wiatry mieszają atmosferę w skali tygodni do lat. Azot (78% powietrza) jest też chemicznie mało aktywny i w większości przetrwał.
added: 2026-11-02
---

## Prosto

Powietrze składa się z niewyobrażalnie wielu malutkich cząsteczek, a wiatry mieszają je po całym świecie. Jeden oddech ma tyle cząsteczek, że po dwóch tysiącach lat mieszania mniej więcej jedna z nich trafia do każdego twojego wdechu.

## Wyjaśnienie

To klasyczny przykład **szacowania Fermiego**, czyli dochodzenia do sensownego wyniku przez rozbicie problemu na proste kroki, z których każdy da się oszacować z grubsza.

Krok 1: **ile cząsteczek jest w jednym oddechu?** Wdech to ok. pół litra. Mol gazu (6×10²³ cząsteczek) zajmuje ok. 22 litry. Jeden oddech to więc ok. 10²² cząsteczek. To dziesięć tysięcy trylionów.

Krok 2: **ile cząsteczek ma cała atmosfera?** Waży ona ok. 5×10¹⁸ kg, a średnia masa molowa powietrza to 29 g/mol. Wychodzi ok. 10⁴⁴ cząsteczek.

Krok 3: **mieszanie.** Od śmierci Cezara w 44 r. p.n.e. minęło ponad 2000 lat. Wiatry, burze i prądy dawno rozprowadziły jego ostatni oddech po całej planecie. Cząsteczki Cezara stanowią więc ok. 10²² / 10⁴⁴ = **10⁻²² całej atmosfery**.

Krok 4: każdy twój wdech ma 10²² cząsteczek, z czego 10⁻²² to „cząsteczki Cezara”. Daje to **średnio około jednej**.

Ten sam rachunek działa dla każdej postaci historycznej i każdego oddechu sprzed paru lat. Wszyscy dosłownie oddychamy wspólnym powietrzem.

## Ekspert

Precyzyjniej: wynik zależy od tego, które cząsteczki liczymy. Tlen wymienia się z biosferą (fotosynteza, oddychanie) i oceanami, a CO₂ i para wodna krążą jeszcze szybciej. **Azot** i **argon** są niemal obojętne, a azot zostaje w atmosferze średnio przez miliony lat. Wymieszanie międzypółkulowe zajmuje ok. 1–2 lat, więc po 2000 lat założenie jednorodności jest bardzo dobre. Dokładniejsze liczby dają wynik rzędu 1–10 cząsteczek, zależnie od przyjętej objętości oddechu. To typowa „odporność” szacunku Fermiego na szczegóły.

## Głębiej

Takie zadanie przypisuje się często fizykowi Jamesowi Jeansowi, a spopularyzował je m.in. Sam Kean w książce *„Caesar's Last Breath”*.

Szacowanie Fermiego to świetna umiejętność na co dzień. Na rozmowach rekrutacyjnych pada np. pytanie „ile piłek golfowych zmieści się w autobusie?”. Rekruterów nie obchodzi dokładna liczba, tylko to, czy umiesz rozłożyć problem na kroki i nie pomylić się o kilka rzędów wielkości.
