---
id: filtr-blooma
title: "Filtr Blooma: struktura, która może się mylić – i dlatego jest genialna"
hook: Jak sprawdzić, czy element jest w zbiorze miliarda rzeczy, używając ułamka pamięci? Wystarczy pozwolić sobie czasem na „może”.
category: informatyka
format: standard
tags: [algorytmy, prawdopodobieństwo, struktury-danych, systemy]
confidence: established
sources:
  - title: "Wikipedia: Bloom filter"
    url: https://en.wikipedia.org/wiki/Bloom_filter
related: [paradoks-dnia-urodzin, problem-bizantyjskich-generalow, falszywe-wspomnienia]
quiz:
  question: Jaki błąd może popełnić filtr Blooma?
  options:
    - Może powiedzieć „na pewno nie ma”, gdy element jednak jest
    - Może powiedzieć „chyba jest”, gdy elementu w rzeczywistości nie ma
    - Może zgubić dodane elementy
    - Może mylić się w obie strony z równym prawdopodobieństwem
  answer: 1
  explanation: Filtr Blooma nie ma fałszywych negatywów. Jeśli mówi „nie ma”, to na pewno nie ma. Może się natomiast mylić, mówiąc „chyba jest”.
recall:
  question: Opisz w skrócie, jak działa filtr Blooma i gdzie się go używa.
  answer: To tablica bitów i kilka funkcji skrótu. Dodając element, zapalasz bity wskazane przez wszystkie funkcje. Sprawdzając, patrzysz, czy wszystkie te bity są zapalone – jeśli choć jeden jest zgaszony, elementu na pewno nie ma. Używa się go w bazach danych (żeby nie czytać dysku na próżno), w przeglądarkach do list złośliwych stron i w systemach rekomendacji („czy użytkownik już to widział?”).
added: 2026-11-02
---

## Prosto

Wyobraź sobie rząd żarówek. Kiedy zapamiętujesz słowo, zapalasz kilka żarówek wybranych według tego słowa. Kiedy sprawdzasz słowo, patrzysz na te same żarówki. Jeśli któraś jest zgaszona, słowa na pewno nie było. Jeśli wszystkie się świecą, słowo pewnie było – ale nie masz stuprocentowej pewności.

## Wyjaśnienie

W 1970 roku **Burton Bloom** zaproponował strukturę danych z zaskakującym kompromisem. Rezygnujemy z odrobiny pewności w zamian za ogromną oszczędność pamięci.

Jak to działa:

- Mamy **tablicę bitów** (początkowo same zera) i kilka **funkcji skrótu**, które zamieniają element na numer pozycji w tablicy.
- **Dodanie** elementu: liczymy wszystkie skróty i ustawiamy wskazane bity na 1.
- **Sprawdzenie**: liczymy te same skróty. Jeśli którykolwiek bit to 0, elementu **na pewno nie ma**. Jeśli wszystkie to 1, element **prawdopodobnie jest**, bo te bity mogły zostać zapalone przez inne elementy.

Najważniejsza właściwość: **brak fałszywych negatywów**. „Nie” zawsze znaczy „nie”. Pomyłki zdarzają się tylko w odpowiedzi „chyba tak”.

Dlaczego to genialne? Bo wiele systemów potrzebuje szybko odrzucić „na pewno nie”, zanim wykona kosztowną operację:

- **bazy danych** (np. Cassandra, HBase) sprawdzają filtr, zanim sięgną do dysku,
- **przeglądarki** sprawdzały w ten sposób listy złośliwych stron,
- **serwisy z treściami** szybko pomijają artykuły, które już widziałeś.

Przy ok. **10 bitach na element** odsetek fałszywych alarmów wynosi ok. **1%**, niezależnie od tego, jak duże są same elementy.

## Ekspert

Dla m bitów, n elementów i k funkcji skrótu prawdopodobieństwo fałszywego pozytywu wynosi ok. (1 − e^(−kn/m))^k. Minimalizuje je k = (m/n)·ln 2, co daje p ≈ 0,6185^(m/n). Dla p = 1% potrzeba ok. 9,6 bita na element i k ≈ 7. Warianty: **counting Bloom filter** (pozwala usuwać elementy), **filtry kukułcze** (cuckoo filters, lepsze przy niskim p i obsługują usuwanie), **filtry XOR i binary fuse** (bliżej teoretycznego minimum log₂(1/p) bitów). Filtry Blooma to przykład szerszej klasy struktur probabilistycznych, obok HyperLogLog i Count-Min Sketch.

## Głębiej

Filtr Blooma ma ciekawą analogię z ludzką pamięcią. Znasz uczucie „to brzmi znajomo”, choć nie umiesz sobie przypomnieć szczegółów? Rozpoznawanie, czy coś już widzieliśmy, bywa tanie i szybkie, ale podatne na fałszywe „tak”. Dokładne przypomnienie kosztuje więcej.

Dobra praktyczna lekcja z tej struktury: jeśli pozwolisz sobie na kontrolowany, mały odsetek błędów, często dostajesz rozwiązanie nieporównanie tańsze.
