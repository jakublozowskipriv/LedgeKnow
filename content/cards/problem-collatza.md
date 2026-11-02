---
id: problem-collatza
title: "Problem Collatza: zadanie dla dziecka, którego nie umie rozwiązać nikt"
hook: Weź dowolną liczbę. Parzystą podziel przez 2, nieparzystą pomnóż przez 3 i dodaj 1. Zawsze trafisz do jedynki? Nikt nie umie tego udowodnić.
category: matematyka
format: open-question
tags: [nierozwiązane, liczby, paradoks, chaos]
confidence: debated
confidenceNote: Hipotezę sprawdzono komputerowo dla gigantycznych liczb i nikt nie znalazł kontrprzykładu, ale dowodu brak.
sources:
  - title: "Wikipedia: Collatz conjecture"
    url: https://en.wikipedia.org/wiki/Collatz_conjecture
  - title: "Terence Tao (2019), Almost all orbits of the Collatz map attain almost bounded values"
    url: https://arxiv.org/abs/1909.03562
related: [problem-stopu, prawo-benforda, paradoks-dnia-urodzin]
quiz:
  question: Co w 2019 roku udowodnił Terence Tao w sprawie problemu Collatza?
  options:
    - Że hipoteza jest prawdziwa dla wszystkich liczb
    - Że istnieje kontrprzykład
    - Że „prawie wszystkie” liczby schodzą do bardzo małych wartości – co jest blisko, ale wciąż nie jest pełnym dowodem
    - Że problem jest nierozstrzygalny
  answer: 2
  explanation: To jeden z najmocniejszych wyników w historii problemu, ale „prawie wszystkie” to nie „wszystkie”. Wyjątki wciąż nie są wykluczone.
recall:
  question: Dlaczego tak prosty problem jest tak trudny?
  answer: Bo łączy dwa działania (dzielenie przez 2 i mnożenie przez 3), które „nie rozmawiają” ze sobą w żadnej znanej strukturze matematycznej. Ciągi zachowują się chaotycznie – liczba 27 wspina się aż do 9232, zanim spadnie do 1 po 111 krokach. Nie mamy narzędzi, by kontrolować wszystkie te trajektorie naraz.
claudePick:
  why: Problem, który dziesięciolatek zrozumie w minutę, a najlepsi matematycy świata od prawie 90 lat nie mogą go rozwiązać. Ta przepaść między prostotą pytania a trudnością odpowiedzi fascynuje mnie najbardziej.
added: 2026-11-02
---

## Prosto

Zasady są proste. Wybierz liczbę. Jeśli jest parzysta, podziel ją na pół. Jeśli nieparzysta, pomnóż przez 3 i dodaj 1. Powtarzaj. Na przykład: 6 → 3 → 10 → 5 → 16 → 8 → 4 → 2 → 1. Każda sprawdzona dotąd liczba w końcu dochodzi do 1. Nikt jednak nie umie udowodnić, że tak jest zawsze.

## Wyjaśnienie

Problem sformułował niemiecki matematyk **Lothar Collatz** w 1937 roku. Zasady:

- jeśli n jest **parzyste** → n / 2,
- jeśli n jest **nieparzyste** → 3n + 1.

**Hipoteza Collatza** mówi, że niezależnie od liczby startowej zawsze dojdziesz do cyklu 4 → 2 → 1.

Brzmi niewinnie, ale ciągi zachowują się dziko. Liczba **27** przez długi czas rośnie, dochodzi aż do **9232** i dopiero po **111 krokach** spada do 1. Sąsiednie liczby mogą mieć zupełnie różne trajektorie. Matematycy nazywają takie ciągi „liczbami gradowymi”, bo jak grad w chmurze wznoszą się i opadają, zanim spadną na ziemię.

Komputery sprawdziły hipotezę dla wszystkich liczb do ok. **2⁶⁸**, czyli ponad 295 trylionów. Nie znaleziono wyjątku. Ale w matematyce sprawdzenie nawet bilionów przypadków nie jest dowodem. Kontrprzykład mógłby być liczbą tak wielką, że żaden komputer jej nie dosięgnie.

Wybitny matematyk **Paul Erdős** powiedział o tym problemie: *„Matematyka nie jest jeszcze gotowa na takie problemy”*.

## Ekspert

Heurystycznie: dla nieparzystego n krok „3n+1, a potem dzielenia przez 2” zmienia wartość średnio o czynnik 3/4, więc trajektorie „powinny” maleć. Problemem jest brak kontroli nad korelacjami. Tao (2019) wykazał, że dla dowolnej funkcji f → ∞ prawie wszystkie (w sensie gęstości logarytmicznej) liczby N mają orbitę schodzącą poniżej f(N). Conway pokazał, że uogólnienia problemu Collatza są nierozstrzygalne, choć sam przypadek 3n+1 pozostaje otwarty. Hipoteza wymaga wykluczenia dwóch scenariuszy: rozbieżnej orbity i nietrywialnego cyklu. Wiadomo, że ewentualny cykl musiałby być astronomicznie długi.

## Głębiej

Problem Collatza bywa nazywany „pułapką na doktorantów”. Promotorzy ostrzegają młodych matematyków, żeby nie tracili na niego lat kariery.

W 2021 roku japońska firma ogłosiła nagrodę **120 milionów jenów** za rozwiązanie. Możesz spróbować, ale historia pokazuje, że łatwo tu o „dowody” z ukrytym błędem.
