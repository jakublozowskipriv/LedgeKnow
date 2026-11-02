---
id: problem-bizantyjskich-generalow
title: Problem bizantyjskich generałów, czyli jak ufać, gdy ktoś może kłamać
hook: Jak grupa komputerów ma podjąć wspólną decyzję, jeśli część z nich może być zepsuta – albo złośliwie kłamać? Odpowiedź napędza samoloty i kryptowaluty.
category: informatyka
format: standard
tags: [systemy, zaufanie, sieci, teoria-gier]
confidence: established
sources:
  - title: "Wikipedia: Byzantine fault"
    url: https://en.wikipedia.org/wiki/Byzantine_fault
  - title: "Lamport, Shostak, Pease (1982), The Byzantine Generals Problem"
    url: https://lamport.azurewebsites.net/pubs/byz.pdf
related: [sluzowiec-i-koleje-tokio, filtr-blooma, szczury-z-hanoi]
quiz:
  question: Ilu uczestników potrzeba (przy zwykłych, niepodpisanych wiadomościach), by tolerować f zdrajców?
  options:
    - f + 1
    - 2f
    - co najmniej 3f + 1
    - 10f
  answer: 2
  explanation: Przy jednym zdrajcy potrzeba co najmniej 4 uczestników. Z trzema nie da się odróżnić, kto kłamie.
recall:
  question: Czym „błąd bizantyjski” różni się od zwykłej awarii?
  answer: Zwykła awaria oznacza, że węzeł przestaje odpowiadać. Błąd bizantyjski oznacza, że węzeł zachowuje się dowolnie – może wysyłać sprzeczne informacje różnym odbiorcom, kłamać lub udawać, że działa poprawnie. Na to trudniej się przygotować.
added: 2026-11-02
---

## Prosto

Kilku generałów otacza miasto. Muszą wszyscy razem zaatakować albo wszyscy się wycofać. Wysyłają sobie wiadomości przez posłańców, ale niektórzy generałowie mogą być zdrajcami i kłamać. Jak mają się dogadać? Komputery w sieci mają dokładnie ten sam problem.

## Wyjaśnienie

W 1982 roku **Leslie Lamport**, Robert Shostak i Marshall Pease opisali problem w formie przypowieści. Kilka dywizji armii bizantyjskiej oblega miasto. Generałowie komunikują się tylko przez posłańców. Muszą uzgodnić wspólny plan: atak albo odwrót. Połowiczny atak oznacza klęskę. Część generałów może być **zdrajcami**, którzy celowo wysyłają różnym osobom sprzeczne wiadomości.

Najciekawszy wynik: przy zwykłych wiadomościach problem da się rozwiązać tylko wtedy, gdy uczciwych jest **więcej niż dwie trzecie**. Formalnie: liczba uczestników n ≥ 3f + 1, gdzie f to liczba zdrajców. Przy trzech generałach i jednym zdrajcy porozumienie jest niemożliwe. Uczciwy generał, który dostaje sprzeczne rozkazy, nie wie, czy kłamie dowódca, czy kolega.

Po co to komuś? Bo **komputery też „kłamią”**. Uszkodzony czujnik, wadliwa pamięć albo zhakowany serwer mogą wysyłać fałszywe dane. Dlatego:

- **samoloty i statki kosmiczne** mają po kilka komputerów pokładowych, które „głosują” nad decyzjami,
- **bazy danych w chmurze** muszą uzgadniać stan między serwerami,
- **Bitcoin** rozwiązuje wariant tego problemu dla tysięcy anonimowych uczestników, uzależniając „głos” od wykonanej pracy obliczeniowej (proof of work).

## Ekspert

Dla wiadomości ustnych (bez uwierzytelnienia) dolna granica n ≥ 3f + 1 jest ścisła, a algorytm OM(f) wymaga f + 1 rund wymiany wiadomości. Z podpisami cyfrowymi (wiadomości „pisemne”) wystarcza n ≥ f + 2 dla samego uzgodnienia. Wynik FLP (Fischer, Lynch, Paterson 1985) pokazuje, że w systemie w pełni asynchronicznym deterministyczny konsensus jest niemożliwy nawet przy jednej awarii typu crash. Praktyczne protokoły (PBFT, Tendermint, HotStuff) zakładają częściową synchroniczność. Nakamoto consensus daje probabilistyczną finalność zamiast deterministycznej.

## Głębiej

Pokrewny, prostszy **problem dwóch generałów** pokazuje coś jeszcze bardziej podstawowego. Przy zawodnym kanale komunikacji żadna liczba potwierdzeń nie daje pewności, że obie strony wiedzą, że druga strona wie. Dlatego protokoły internetowe (jak TCP) działają na zasadzie „wystarczająco pewne”, a nie „absolutnie pewne”.

Lamport dostał w 2013 roku Nagrodę Turinga, m.in. za prace nad systemami rozproszonymi. Przypowieść o generałach wymyślił celowo, bo zauważył, że problemy z „chwytliwą historią” są częściej cytowane.
