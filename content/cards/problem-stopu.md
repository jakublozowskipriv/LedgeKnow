---
id: problem-stopu
title: Istnieją pytania, na które żaden komputer nigdy nie odpowie
hook: W 1936 roku Alan Turing udowodnił, że nie da się napisać programu, który dla każdego programu powie, czy ten się kiedyś zatrzyma.
category: informatyka
format: standard
tags: [granice, logika, paradoks, algorytmy]
confidence: established
sources:
  - title: "Wikipedia: Halting problem"
    url: https://en.wikipedia.org/wiki/Halting_problem
  - title: "Wikipedia: Busy beaver"
    url: https://en.wikipedia.org/wiki/Busy_beaver
related: [problem-collatza, dlaczego-0-1-plus-0-2, statek-tezeusza]
quiz:
  question: Na jakim triku opiera się dowód Turinga?
  options:
    - Na pomiarze czasu pracy procesora
    - Na zbudowaniu programu, który robi odwrotnie, niż przewiduje „wyrocznia” – zapytany o samego siebie prowadzi do sprzeczności
    - Na sprawdzeniu wszystkich możliwych programów
    - Na fizycznych ograniczeniach pamięci
  answer: 1
  explanation: To argument przekątniowy, podobny do paradoksu kłamcy („to zdanie jest fałszywe”). Założenie, że wyrocznia istnieje, prowadzi do sprzeczności.
recall:
  question: Jakie praktyczne konsekwencje ma nierozstrzygalność problemu stopu?
  answer: Nie istnieje idealny analizator kodu – narzędzie, które zawsze bezbłędnie wykryje każdy błąd, nieskończoną pętlę albo złośliwe zachowanie programu (twierdzenie Rice'a). Dlatego antywirusy i analizatory statyczne działają heurystycznie i mają fałszywe alarmy lub przeoczenia.
added: 2026-11-02
---

## Prosto

Wyobraź sobie magiczny program, który patrzy na inny program i mówi: „ten kiedyś skończy” albo „ten będzie działał w nieskończoność”. Alan Turing udowodnił, że takiego magicznego programu nie da się zbudować, nawet na najlepszym komputerze świata.

## Wyjaśnienie

W 1936 roku, zanim powstały prawdziwe komputery, **Alan Turing** zadał pytanie: czy istnieje ogólna metoda, która dla *dowolnego* programu i danych wejściowych powie, czy ten program kiedyś się **zatrzyma**, czy będzie działał w nieskończoność?

Jego odpowiedź brzmiała: **nie** – i to nie z braku mocy obliczeniowej, tylko z powodów logicznych. Dowód jest zaskakująco krótki:

1. Załóżmy, że mamy program-wyrocznię `ZATRZYMA(P, X)`, który zawsze poprawnie odpowiada, czy program P zatrzyma się na danych X.
2. Budujemy złośliwy program `PRZEKORA(P)`: *zapytaj wyrocznię, czy P zatrzyma się, gdy dostanie samego siebie. Jeśli tak – wejdź w nieskończoną pętlę. Jeśli nie – zatrzymaj się.*
3. Co się stanie, gdy uruchomimy `PRZEKORA(PRZEKORA)`? Jeśli się zatrzyma, to wyrocznia powiedziała, że się nie zatrzyma. Jeśli się nie zatrzyma, wyrocznia powiedziała, że się zatrzyma.

**Sprzeczność.** Wyrocznia nie może istnieć.

To przypomina paradoks kłamcy: „To zdanie jest fałszywe”. Wniosek jest głęboki: istnieją dobrze postawione pytania, na które **żaden algorytm nigdy nie odpowie**. Nie dlatego, że jeszcze nie wymyśliliśmy jak, tylko dlatego, że to niemożliwe.

## Ekspert

Problem stopu jest rekurencyjnie przeliczalny (można potwierdzić „tak”, uruchamiając program), ale nie rozstrzygalny. **Twierdzenie Rice'a** uogólnia to na dowolną nietrywialną własność semantyczną programów. Turing odpowiedział w ten sposób negatywnie na Entscheidungsproblem Hilberta (niezależnie od Churcha). Z nierozstrzygalnością wiąże się funkcja **Busy Beaver** BB(n), która rośnie szybciej niż jakakolwiek funkcja obliczalna. W 2024 roku społeczność bbchallenge udowodniła formalnie (w asystencie dowodzenia Coq), że BB(5) = 47 176 870. Dla n = 6 wartości przekraczają wyobrażalne skale.

## Głębiej

Turing napisał tę pracę jako 24-latek. Przy okazji zdefiniował **maszynę Turinga** – abstrakcyjny model komputera, którego używamy do dziś, żeby mówić o tym, co w ogóle da się obliczyć.

Gdyby problem stopu był rozstrzygalny, rozwiązalibyśmy automatycznie wiele słynnych problemów matematyki. Wystarczyłoby napisać program, który szuka kontrprzykładu np. dla problemu Collatza albo hipotezy Goldbacha, i zapytać wyrocznię, czy kiedyś się zatrzyma.
