---
id: dlaczego-0-1-plus-0-2
title: Dlaczego komputer twierdzi, że 0,1 + 0,2 ≠ 0,3
hook: Wpisz w konsolę przeglądarki 0.1 + 0.2. Wynik 0.30000000000000004 to nie błąd – to cena za zapisywanie ułamków w systemie dwójkowym.
category: informatyka
format: standard
tags: [liczby, programowanie, błędy, systemy]
confidence: established
sources:
  - title: "Wikipedia: Floating-point arithmetic"
    url: https://en.wikipedia.org/wiki/Floating-point_arithmetic
  - title: "0.30000000000000004.com"
    url: https://0.30000000000000004.com/
related: [problem-stopu, prawo-benforda, filtr-blooma]
quiz:
  question: Dlaczego liczby 0,1 nie da się zapisać dokładnie w systemie dwójkowym?
  options:
    - Bo komputery mają za mało pamięci
    - Bo 1/10 w systemie dwójkowym to ułamek okresowy, tak jak 1/3 w dziesiętnym
    - Bo 0,1 jest liczbą niewymierną
    - Bo procesory zaokrąglają wszystko do liczb całkowitych
  answer: 1
  explanation: 10 = 2 × 5, a piątki nie da się „wyrazić” w potęgach dwójki. Dlatego 0,1 w dwójkowym to 0,000110011001100… w nieskończoność.
recall:
  question: Jak programiści powinni przechowywać kwoty pieniędzy i dlaczego?
  answer: Jako liczby całkowite w najmniejszej jednostce (np. grosze) albo w specjalnych typach dziesiętnych (decimal). Zwykłe liczby zmiennoprzecinkowe zapisują ułamki dziesiętne w przybliżeniu, a przy wielu operacjach błędy się kumulują i grosze zaczynają się „gubić”.
added: 2026-11-02
---

## Prosto

Komputer liczy tylko zerami i jedynkami. Niektórych zwykłych ułamków, takich jak 0,1, nie da się zapisać zerami i jedynkami dokładnie. Komputer zapisuje je więc w malutkim przybliżeniu. Kiedy dodaje dwa przybliżenia, wynik też jest przybliżony.

## Wyjaśnienie

Spróbuj zapisać **1/3** jako ułamek dziesiętny: 0,3333… Nie da się skończyć, więc w którymś miejscu musisz uciąć i dostajesz przybliżenie.

Komputery mają ten sam problem, tylko w **systemie dwójkowym**. Tam „ładnie” zapisują się tylko ułamki, których mianownik jest potęgą dwójki: 1/2 = 0,1₂, 1/4 = 0,01₂, 3/8 = 0,011₂. A **1/10**? Dziesiątka zawiera czynnik 5, więc w dwójkowym 0,1 to ułamek okresowy: 0,0001100110011…₂.

Większość języków programowania przechowuje liczby niecałkowite w standardzie **IEEE 754** – 64 bity, z których 52 to „cyfry znaczące”. Okres zostaje ucięty, więc:

- 0,1 w pamięci to tak naprawdę **0,1000000000000000055511151231257827…**
- 0,2 to **0,200000000000000011102230246251565…**
- ich suma, zaokrąglona do najbliższej możliwej liczby, wychodzi **odrobinę ponad 0,3**.

Dlatego w kodzie nie porównuje się takich liczb przez `==`, tylko sprawdza, czy różnica jest „wystarczająco mała”. A pieniądze trzyma się w **groszach jako liczbach całkowitych** albo w specjalnych typach dziesiętnych.

## Ekspert

Liczba binary64 ma postać (−1)^s × 1.m × 2^(e−1023) z 52-bitową mantysą, co daje ok. 15–17 cyfr znaczących. Najbliższa reprezentowalna wartość dla 0,1 to 3602879701896397 / 2⁵⁵. Suma 0,1 + 0,2 jest zaokrąglana do wartości odległej o 1 ULP od najbliższej reprezentacji 0,3. Dodawanie zmiennoprzecinkowe nie jest łączne: (a+b)+c ≠ a+(b+c), co ma znaczenie np. przy równoległym sumowaniu. Stąd algorytmy takie jak sumowanie Kahana. Formatowanie „najkrótszej reprezentacji” (np. algorytm Ryu) sprawia, że 0,1 wyświetla się jako „0.1”, choć w pamięci nią nie jest.

## Głębiej

Błędy reprezentacji potrafią mieć dramatyczne skutki. W 1991 roku w Dhahranie system przeciwrakietowy **Patriot** liczył czas w dziesiątych częściach sekundy, zapisując 0,1 z ucięciem w 24-bitowym rejestrze. Po 100 godzinach pracy błąd urósł do ok. 0,34 s, co przy prędkości rakiety Scud dało ok. pół kilometra przesunięcia. System nie przechwycił rakiety, która zabiła 28 żołnierzy.

Mniej tragicznie: w grach wideo daleko od środka mapy fizyka zaczyna „wariować”, bo liczby zmiennoprzecinkowe są tam mniej precyzyjne. Gracze Minecrafta znają to jako zjawiska przy „Far Lands”.
