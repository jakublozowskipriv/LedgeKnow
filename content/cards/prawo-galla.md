---
id: prawo-galla
title: "Prawo Galla: każdy działający złożony system zaczynał jako prosty"
hook: FBI wydało ok. 170 mln dolarów na system zaprojektowany od zera, po czym go porzuciło. Linux zaczął się od hobbystycznego projektu studenta. Prawo Galla wyjaśnia, dlaczego to nie przypadek.
category: modele
format: standard
tags:
  - systemy
  - projektowanie
  - oprogramowanie
  - ewolucja
  - heurystyki
confidence: mainstream
confidenceNote: To heurystyka oparta na doświadczeniu i anegdotach, a nie twierdzenie potwierdzone systematycznymi badaniami. Słowa „zawsze” i „nigdy” traktuj jako przesadę.
sources:
  - title: John Gall (author) – Wikipedia
    url: https://en.wikipedia.org/wiki/John_Gall_(author)
  - title: John Gall – Wikiquote (cytat z General Systemantics)
    url: https://en.wikiquote.org/wiki/John_Gall
  - title: "The FBI Virtual Case File: A Case Study"
    url: https://scholarworks.lib.csusb.edu/ciima/vol10/iss2/1/
related:
  - plot-chestertona
  - efekt-lindyego
  - sluzowiec-i-koleje-tokio
quiz:
  question: Dlaczego według prawa Galla prosty, działający system jest lepszym punktem wyjścia niż szczegółowy projekt dużego systemu?
  options:
    - Bo prosty system jest zawsze tańszy w utrzymaniu
    - Bo jest sprawdzoną w praktyce wiedzą o tym, jakie zależności działają, a każdą rozbudowę można przetestować małym krokiem
    - Bo użytkownicy z zasady wolą proste produkty od złożonych
    - Bo złożone systemy są z definicji niestabilne i należy ich unikać
  answer: 1
  explanation: Prawo Galla nie potępia złożoności. Mówi, że złożoności nie da się w pełni zaprojektować na papierze, więc trzeba do niej dochodzić stopniowo, zaczynając od czegoś, co już działa w rzeczywistości.
recall:
  question: Wyjaśnij, dlaczego złożony system zaprojektowany od zera tak często zawodzi, nawet gdy każda jego część jest dobrze wykonana.
  answer: Bo problemy pojawiają się w interakcjach między częściami, a tych nie da się w pełni przewidzieć na etapie projektu. Gdy wszystko rusza naraz, błędów jest wiele i trudno ustalić, skąd się biorą. System rozwijany od prostej działającej wersji odkrywa takie problemy po jednym, w małych, testowalnych krokach.
added: 2026-11-05
---

## Prosto

Duże, skomplikowane rzeczy, które działają, prawie zawsze wyrosły z małych rzeczy, które działały. Jeśli od razu budujesz coś wielkiego według planu, zwykle coś się zepsuje w miejscu, którego nie przewidziano. Lepiej zacząć od małej wersji, która działa, i dokładać kolejne kawałki.

## Wyjaśnienie

John Gall, amerykański pediatra, wydał w 1975 roku przewrotną książkę „General Systemantics” o tym, jak systemy działają, a zwłaszcza jak zawodzą. Najsłynniejsza myśl z niej brzmi mniej więcej tak: złożony system, który działa, niezmiennie okazuje się wyewoluowany z prostego systemu, który działał. A złożony system zaprojektowany od zera nigdy nie działa i nie da się go naprawić. Trzeba zacząć od nowa, od prostego systemu, który działa.

**Dlaczego tak jest?** Złożony system to sieć wzajemnych zależności, których nie da się w pełni przewidzieć na papierze. Każda część może być dobrze zrobiona, a całość i tak zawiedzie, bo problemy rodzą się na stykach. Prosty działający system jest czymś więcej niż prototypem. To **sprawdzona w praktyce wiedza** o tym, co naprawdę działa. Każda kolejna rozbudowa jest małym krokiem, który łatwo przetestować, a błąd łatwo namierzyć.

Dwa przykłady:

- **Linux** zaczął się w 1991 roku od ogłoszenia fińskiego studenta, że pisze system „tylko hobbystycznie”. Dekady drobnych ulepszeń później jego jądro działa w każdym telefonie z Androidem i na ogromnej części serwerów.
- **Virtual Case File** miał od razu zastąpić FBI cały system obsługi spraw. Po pięciu latach i ok. 170 mln dolarów projekt porzucono.

W gruncie rzeczy prawo Galla mówi, że tam, gdzie nie rozumiemy wszystkich zależności, **ewolucja wygrywa z projektem**. Z tej samej intuicji wyrasta idea **MVP** (minimalnego działającego produktu) i zwinne metody tworzenia oprogramowania: najpierw coś małego, co naprawdę działa, potem kolejne wersje.

Praktyczna lekcja: planując coś dużego, czy to aplikację, firmę, czy zestaw nawyków, zastanów się, jak wygląda najmniejsza wersja, która już działa. I od niej zacznij.

## Ekspert

Gall nie nazwał tej myśli „prawem”. Etykietę dodali później czytelnicy. Książka była pisana pół żartem, w duchu prawa Murphy'ego i zasady Petera, a kolejne wydania nosiły tytuły „Systemantics” i „The Systems Bible”.

Formalnie to heurystyka, a nie twierdzenie. Słowa „niezmiennie” i „nigdy” są przesadą, a dowody mają charakter anegdotyczny. Do tego działa tu **efekt ocalałego**: widzimy działające systemy i ich historię, a porzucone projekty rzadziej trafiają do analiz.

Idea dobrze pasuje do innych obserwacji inżynierii oprogramowania. Fred Brooks w „Mitycznym osobomiesiącu” opisał **efekt drugiego systemu**, czyli skłonność do przeładowania funkcjami drugiej, ambitnej wersji projektu. Często wskazuje się też bliskie pokrewieństwo prawa Galla ze zwinnym (agile) wytwarzaniem oprogramowania.

## Głębiej

Najlepszą ilustracją jest biologia. Oko kręgowców nie powstało według jednego projektu, tylko przez szereg etapów: od światłoczułej plamki po soczewkę. Każdy z nich musiał działać i dawać przewagę sam w sobie, bo ewolucja nie planuje na zapas. Internet też zaczynał jako mała sieć ARPANET łącząca kilka ośrodków.

W światotwórstwie to dobra rada dla autorów. Zamiast projektować od razu całą kosmologię, system magii i politykę dziesięciu królestw, zacznij od jednego miasta i jednego konfliktu, który działa w opowieści, a świat rozbudowuj wokół nich.

Prawo Galla działa też jako narzędzie diagnozy. Gdy wielka reforma albo przepisanie systemu „od zera” ma ruszyć od razu w całości, wiadomo, gdzie szukać ryzyka. Łączy się to z płotem Chestertona: stare, działające systemy kryją wiedzę, której nie widać w żadnym projekcie.
