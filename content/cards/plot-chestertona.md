---
id: plot-chestertona
title: "Płot Chestertona: zanim coś usuniesz, dowiedz się, po co jest"
hook: Na środku drogi stoi płot bez widocznego celu. Reformator chce go zburzyć. Mądrzejszy mówi – najpierw sprawdź, czemu ktoś go postawił.
category: modele
format: standard
tags: [myślenie, systemy, decyzje, programowanie]
confidence: established
confidenceNote: To heurystyka, a nie prawo przyrody – jest powszechnie ceniona, ale ma też swoje ograniczenia.
sources:
  - title: "Wikipedia: G. K. Chesterton – Chesterton's fence"
    url: https://en.wikipedia.org/wiki/G._K._Chesterton#Chesterton's_fence
related: [szczury-z-hanoi, efekt-lindyego, wielki-smrod-londynu]
quiz:
  question: Co dokładnie zaleca zasada płotu Chestertona?
  options:
    - Nigdy niczego nie zmieniać
    - Nie usuwać istniejącej reguły czy rozwiązania, dopóki nie zrozumiesz, dlaczego powstało
    - Zawsze budować nowe płoty
    - Usuwać wszystko, czego cel nie jest oczywisty
  answer: 1
  explanation: Chesterton nie bronił każdego płotu. Twierdził, że ciężar wyjaśnienia spoczywa na reformatorze – najpierw zrozum, potem decyduj.
recall:
  question: Jakie są ograniczenia zasady płotu Chestertona?
  answer: Może prowadzić do paraliżu i obrony status quo, bo nie każda reguła miała kiedykolwiek dobry powód albo powód mógł się zdezaktualizować. Ustalenie przyczyny bywa kosztowne lub niemożliwe. Rozsądne użycie – im bardziej szkodliwe może być usunięcie i im tańsze sprawdzenie, tym bardziej warto szukać przyczyny przed zmianą.
added: 2026-11-02
---

## Prosto

Jeśli widzisz coś, co wygląda na niepotrzebne – na przykład dziwną zasadę w szkole albo płot na polu – nie wyrzucaj tego od razu. Najpierw zapytaj, po co ktoś to zrobił. Może jest dobry powód, którego jeszcze nie widzisz.

## Wyjaśnienie

W 1929 roku angielski pisarz **G.K. Chesterton** opisał w książce *„The Thing”* prostą przypowieść. Na drodze stoi płot albo brama. Pierwszy reformator mówi: *„Nie widzę sensu tego płotu, usuńmy go”*. Mądrzejszy odpowiada: *„Skoro nie widzisz jego sensu, z pewnością nie pozwolę ci go usunąć. Idź i się dowiedz. Kiedy wrócisz i powiesz mi, po co go postawiono, może pozwolę ci go zburzyć”*.

Logika jest taka: ktoś włożył wysiłek w postawienie płotu. Ludzie rzadko robią to bez powodu. Powód mógł być dobry (płot zatrzymuje bydło, chroni przed osuwiskiem), mógł być zły albo się zdezaktualizować. Ale **nie wiedząc**, ryzykujesz, że usuniesz coś ważnego.

Zasada jest bardzo przydatna w:

- **programowaniu** – dziwny fragment „starego” kodu często obsługuje rzadki przypadek, o którym nikt już nie pamięta,
- **firmach** – „biurokratyczna” procedura bywa śladem dawnego kryzysu,
- **polityce i prawie** – usunięcie regulacji może uwolnić problem, przed którym chroniła,
- **ekologii** – usunięcie „bezużytecznego” gatunku może zaburzyć ekosystem.

To samo działa w drugą stronę. Kiedy tworzysz nowy „płot”, **opisz, po co jest**. Komentarz w kodzie albo uzasadnienie przepisu oszczędzi pracy przyszłym reformatorom.

## Ekspert

Zasada to szczególny przypadek rozumowania w warunkach niepełnej wiedzy o systemach złożonych. Instytucje i konwencje mogą kodować wiedzę rozproszoną i milczącą, czego nikt w pojedynkę nie rozumie (wątek obecny m.in. u Hayeka i Burke'a). Łączy się z ideą asymetrii ryzyka: koszt sprawdzenia jest zwykle ograniczony, a koszt usunięcia ważnego zabezpieczenia może być ogromny i nieodwracalny. Kontrargumentem jest błąd status quo i inercja instytucjonalna. Praktycznym kompromisem są zmiany odwracalne i stopniowe, np. „wyłącz na próbę i obserwuj” zamiast „usuń na zawsze”.

## Głębiej

Inżynierowie oprogramowania mają na to anegdotyczny przykład. W starym systemie znaleziono komentarz: *„Nie usuwać tej linii. Nikt nie wie, co robi, ale bez niej wszystko się sypie”*. To płot Chestertona w czystej postaci – i jednocześnie dowód, że ktoś zapomniał zapisać powód.

Pokrewna jest zasada **„Primum non nocere”** (po pierwsze nie szkodzić) w medycynie. Zanim zaczniesz interweniować w złożony system, upewnij się, że rozumiesz, co on właściwie robi.
