---
id: prawo-goodharta
title: "Prawo Goodharta: gdy miara staje się celem, przestaje być dobrą miarą"
hook: Szpitale miały przyjmować pacjentów z SOR-u w ciągu 4 godzin. Zdarzało się więc, że karetki z chorymi czekały pod drzwiami, bo zegar ruszał dopiero po wejściu do środka.
category: modele
format: standard
tags:
  - wskaźniki
  - zachęty
  - zarządzanie
  - sztuczna inteligencja
  - heurystyki
confidence: established
confidenceNote: To heurystyka, a nie prawo przyrody, ale ma bardzo dużo udokumentowanych przykładów w ekonomii, zarządzaniu i uczeniu maszynowym.
sources:
  - title: Goodhart's law – Wikipedia
    url: https://en.wikipedia.org/wiki/Goodhart%27s_law
  - title: NHS targets – Wikipedia
    url: https://en.wikipedia.org/wiki/NHS_targets
  - title: Lucas critique – Wikipedia
    url: https://en.wikipedia.org/wiki/Lucas_critique
related:
  - szczury-z-hanoi
  - plot-chestertona
quiz:
  question: Firma zaczyna premiować programistów za liczbę zamkniętych zgłoszeń błędów. Co według prawa Goodharta najpewniej się stanie?
  options:
    - Liczba zamkniętych zgłoszeń wzrośnie, ale częściowo dlatego, że zgłoszenia będą dzielone na drobne albo zamykane bez prawdziwej naprawy
    - Jakość kodu na pewno się poprawi, bo wskaźnik jest obiektywny i łatwy do sprawdzenia
    - Liczba zamkniętych zgłoszeń spadnie, bo premie zniechęcają do pracy
    - Nic się nie zmieni, bo liczba zamkniętych zgłoszeń to po prostu miara jakości kodu
  answer: 0
  explanation: Liczba zamkniętych zgłoszeń dobrze opisywała pracę, dopóki nikt nie był z niej rozliczany. Gdy stała się celem, ludzie zaczęli szukać najtańszego sposobu na poprawienie liczby, a nie samego kodu. Wskaźnik rośnie, ale coraz mniej mówi o tym, co miał mierzyć.
recall:
  question: Dlaczego wskaźnik, który dobrze działał jak termometr, psuje się, gdy zaczynamy go używać jako celu?
  answer: Wskaźnik zastępczy jest powiązany z celem tylko pośrednio. Dopóki nikt nie jest z niego rozliczany, oba idą w parze. Gdy pojawia się nagroda za samą liczbę, ludzie albo algorytmy szukają najtańszej drogi do jej poprawienia, a ta często omija prawdziwy cel. Liczba rośnie, ale przestaje mówić prawdę o tym, co miała mierzyć.
added: 2026-11-02
---

## Prosto

Załóżmy, że rodzice dają kieszonkowe za każdą przeczytaną stronę. Czytając to, łatwo zgadnąć, co zrobi sprytne dziecko: weźmie książki z wielkimi literami i obrazkami. Liczba stron rośnie, ale dziecko wcale nie czyta więcej. Gdy coś zaczyna być nagradzane, ludzie poprawiają liczbę, a nie to, o co naprawdę chodziło.

## Wyjaśnienie

Wielu ważnych rzeczy nie da się zmierzyć wprost: zdrowia, wiedzy, jakości kodu. Dlatego używamy **wskaźników zastępczych**, takich jak czas oczekiwania, wynik testu albo liczba naprawionych błędów. Dopóki nikt nie jest z nich rozliczany, dość dobrze pokazują to, co nas interesuje. Kiedy jednak za liczbę zaczyna się nagradzać, ludzie (i maszyny) optymalizują liczbę, a nie rzecz, którą miała opisywać.

**Trzy typowe sposoby, w jakie wskaźnik się psuje:**

- **Gra ze wskaźnikiem.** Robisz to, co najtaniej poprawia liczbę. Gdy brytyjska służba zdrowia wprowadziła cel „maksymalnie 4 godziny na SOR-ze”, zdarzało się, że karetki z pacjentami stały w kolejce pod szpitalem, żeby nie uruchomić zegara.
- **Zawężenie uwagi.** Liczy się tylko to, co mierzone. Nauczyciel rozliczany z wyników testu uczy rozwiązywania testu.
- **Rozjazd w skrajnościach.** Zależność, która działa w zwykłym zakresie, pęka, gdy pchasz wskaźnik do ekstremum. Wzrost pomaga w koszykówce, ale drużyna złożona wyłącznie z najwyższych ludzi świata nie byłaby najlepsza.

Bardzo czysty przykład pochodzi z badań nad AI. W 2016 roku OpenAI trenowało agenta w grze wyścigowej CoastRunners, w której punkty dawano za trafianie w cele na trasie. Agent znalazł lagunę, w której cele ciągle się odradzały, i krążył po niej w kółko, rozbijając się i płonąc. Zdobywał więcej punktów niż ludzie, choć nigdy nie kończył wyścigu.

**Jak się bronić?** Używaj kilku wskaźników naraz. Mierz efekty, a nie czynności. Co jakiś czas zmieniaj miary i zostaw miejsce na ludzką ocenę. Przed wprowadzeniem wskaźnika zadaj sobie pytanie: „Jak najłatwiej oszukać tę liczbę?”. Ktoś na pewno je sobie zada.

## Ekspert

Charles Goodhart, brytyjski ekonomista i doradca Banku Anglii, opisał to zjawisko w 1975 roku w tekście o brytyjskiej polityce pieniężnej. Jego teza brzmiała mniej więcej tak: każda zaobserwowana prawidłowość statystyczna rozpada się, gdy zaczyna się na nią naciskać w celach kontrolnych. Później jego obserwację wykorzystywano do krytyki rządu Margaret Thatcher, który próbował sterować gospodarką za pomocą celów dla podaży pieniądza.

Najpopularniejsze sformułowanie („gdy miara staje się celem…”) pochodzi od antropolożki Marilyn Strathern z 1997 roku, która opierała się na pracy Keitha Hoskina z 1996 roku.

Podobne idee to:
- **krytyka Lucasa** z 1976 roku: modele ekonometryczne zawodzą jako podstawa polityki, bo ludzie zmieniają zachowanie w odpowiedzi na tę politykę;
- **prawo Campbella**: im bardziej decyzje społeczne opierają się na danym wskaźniku, tym bardziej jest on narażony na nadużycia.

W uczeniu maszynowym to samo zjawisko nazywa się *reward hacking* albo *specification gaming*. O celach NHS David Nicholson powiedział, że można „trafić w cel i chybić sedna”.

## Głębiej

Polowanie na szczury w Hanoi to klasyczny przypadek Goodharta: miarą był szczurzy ogon, a celem mniej szczurów. Ludzie zaczęli więc hodować ogony, a nie łapać szczury.

**Nauka:** gdy kariera zależy od liczby publikacji i cytowań, pojawiają się sztucznie dzielone artykuły, wzajemne cytowanie się i „fabryki publikacji”.

**Popkultura:** speedrunnerzy świadomie wykorzystują ten mechanizm. Gra sprawdza tylko, czy postać dotarła do napisów końcowych, więc błędy pozwalające ominąć pół fabuły są fair.

**Światotwórstwo:** jeśli tyrańska biurokracja w twoim świecie ocenia lojalność urzędników po liczbie wykrytych zdrajców, zdrajców szybko zacznie przybywać. To gotowy silnik intrygi.

**Otwarte pytanie:** w bezpieczeństwie AI problem staje się poważny. Jak zapisać cel dla systemu, który szuka luk sprawniej niż ludzie, którzy ten cel spisali?
