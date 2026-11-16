---
id: zasada-pareto-skad-80-20
title: "Zasada Pareto: dlaczego świat tak często dzieli się na 80/20?"
hook: Mała część słów robi większość tekstu, garstka filmów zgarnia większość wpływów, a nieliczne błędy powodują większość awarii. Opisać ten wzór łatwo. Gorzej z odpowiedzią, skąd się bierze.
category: modele
format: open-question
tags:
  - pareto
  - rozkład potęgowy
  - nierówności
  - heurystyki
  - statystyka
confidence: debated
confidenceNote: To, że w wielu danych pojawiają się „ciężkie ogony”, jest pewne. Nie wiadomo jednak, jak wiele z nich to prawdziwe rozkłady potęgowe i który mechanizm działa w danym przypadku.
sources:
  - title: Pareto principle – Wikipedia
    url: https://en.wikipedia.org/wiki/Pareto_principle
  - title: Clauset, Shalizi, Newman – Power-law distributions in empirical data (SIAM Review, 2009)
    url: http://snap.stanford.edu/class/cs224w-readings/clauset09powerlaw.pdf
  - title: Broido, Clauset – Scale-free networks are rare (Nature Communications, 2019)
    url: https://www.nature.com/articles/s41467-019-08746-5
related:
  - prawo-benforda
  - prawo-goodharta
  - efekt-lindyego
quiz:
  question: Dlaczego mechanizm „bogaty się bogaci” (preferencyjne przyłączanie) prowadzi do skrajnych nierówności?
  options:
    - Bo szansa na kolejny zysk rośnie razem z tym, co już się ma, więc drobne przewagi narastają lawinowo
    - Bo zasoby są z góry rozdzielone w proporcji 80/20 i każdy dostaje swoją część
    - Bo nierówności powstają tylko wtedy, gdy uczestnicy mają z natury różne talenty
    - Bo każdy uczestnik zyskuje co roku tyle samo, a różnice wynikają tylko z wieku
  answer: 0
  explanation: W preferencyjnym przyłączaniu prawdopodobieństwo zdobycia nowego linku, cytowania czy klienta jest proporcjonalne do tego, co już się ma. Nawet przypadkowa wczesna przewaga zaczyna się wtedy kumulować i wyrasta długi, ciężki ogon rozkładu. Różnice w talencie nie są do tego potrzebne.
recall:
  question: Dlaczego zasada 80/20 to raczej heurystyka niż prawo natury?
  answer: Liczby 80 i 20 nie muszą się sumować do 100 i w realnych danych proporcje bywają zupełnie inne, np. 90/10 albo 70/30. Wspólne jest tylko to, że rozkład ma ciężki ogon. Do takich ogonów prowadzi kilka różnych mechanizmów, m.in. kumulacja przewagi, wzrost multiplikatywny i układy na granicy krytyczności. Statystycy pokazali też, że wiele rzekomych rozkładów potęgowych równie dobrze opisują inne rozkłady.
added: 2026-11-17
---

## Prosto

Często mała garstka czegoś odpowiada za większość efektu. Kilku piłkarzy strzela większość goli, kilka piosenek ma większość odtworzeń, kilka słów wypełnia większość książki. Ludzie nazwali to „zasadą 80/20”. Naukowcy wciąż się jednak spierają, dlaczego tak się dzieje i czy to zawsze ten sam mechanizm.

## Wyjaśnienie

Włoski ekonomista **Vilfredo Pareto** zauważył pod koniec XIX wieku, że mniej więcej 80% ziemi we Włoszech należy do 20% ludzi. Pół wieku później specjalista od jakości Joseph Juran uogólnił tę obserwację na „zasadę nielicznych istotnych”: większość wad w fabryce bierze się z niewielu przyczyn. Dziś „80/20” słychać wszędzie, od zarządzania czasem po programowanie.

**Co wiemy.** Za tą zasadą stoją **rozkłady z ciężkim ogonem**, zwłaszcza **rozkład potęgowy**. W rozkładzie normalnym, takim jak wzrost ludzi, skrajności są rzadkie. W potęgowym gigantów jest mało, ale zgarniają większość. Te dwie liczby nie muszą się też sumować do 100. Równie dobrze może wyjść 90/10 albo 99/1.

**Czego nie wiemy:** czemu takie rozkłady pojawiają się w tak różnych miejscach. Główne hipotezy są trzy:

- **Bogaty się bogaci** (preferencyjne przyłączanie). Popularne strony dostają nowe linki, bo już są popularne. Często cytowane prace są cytowane dalej. Drobna przewaga z początku narasta jak kula śniegowa.
- **Wzrost multiplikatywny.** Jeśli majątek czy firma rosną o procent, a nie o stałą kwotę, losowe wahania mnożą się i rozciągają rozkład.
- **Krytyczność i optymalizacja.** Niektóre układy, np. skorupa ziemska czy sieci energetyczne, same dochodzą do stanu, w którym drobne zdarzenia są codziennością, a wielkie katastrofy zdarzają się rzadko, ale wcale nie bardzo rzadko.

Jest też problem praktyczny: na wykresie wiele zjawisk tylko *wygląda* na potęgowe. Gdy statystycy porządnie przetestowali dziesiątki zbiorów danych, część z nich lepiej opisywały inne rozkłady.

Ta heurystyka nadal się przydaje. Każe szukać tych nielicznych przyczyn, które dają większość efektu. Traktuj ją jednak jako pytanie do zadania danym, nie jako prawo natury.

## Ekspert

Dokładne 80/20 daje rozkład Pareto z wykładnikiem α = log₄5 ≈ 1,16. Taki rozkład jest samopodobny: 80% z 80% to 64%, więc najlepsze 4% ma 64% całości. Rozkład potęgowy cytowań opisał Derek de Solla Price, nazywając mechanizm „skumulowaną przewagą”. Wcześniej podobne modele stworzyli Yule i Herbert Simon, a sieciom zastosował go model Barabásiego–Alberta. Wzrost multiplikatywny (prawo Gibrata) daje sam w sobie rozkład logarytmiczno-normalny, a dopiero z dodatkowymi warunkami, np. dolną barierą, rozkład potęgowy. M.E.J. Newman (2005) zebrał te mechanizmy w jednym przeglądzie. Clauset, Shalizi i Newman (2009) pokazali, że dopasowywanie prostej na wykresie log-log jest zawodne, i zaproponowali testy oparte na największej wiarygodności. Broido i Clauset (2019) przeanalizowali prawie tysiąc sieci i stwierdzili, że silnie bezskalowe są rzadkie. Rozkład logarytmiczno-normalny często pasował równie dobrze albo lepiej.

## Głębiej

Socjolog Robert Merton nazwał zjawisko kumulacji przewagi **efektem św. Mateusza** od zdania z Ewangelii: „każdemu, kto ma, będzie dodane”. Wynika z niego, że skrajne nierówności mogą powstać bez różnic w talencie. Wystarczą szczęśliwy start i sprzężenie zwrotne.

W informatyce zasada Pareto kryje się za **cache'owaniem**. Niewielka część danych odpowiada za większość odczytów, więc opłaca się trzymać ją w szybkiej pamięci. Podobnie jest z profilowaniem kodu: zwykle kilka funkcji zjada większość czasu procesora.

Przy budowaniu światów ten rozkład podpowiada, jak wypełnić mapę. Wielkości miast, popularność bóstw czy bogactwo rodów powinny wyglądać właśnie tak: jedna stolica, kilka średnich miast i mnóstwo wiosek, a nie dwadzieścia równych grodów.

Otwarte pytanie brzmi tak: czy „długi ogon” to jedno uniwersalne zjawisko, czy kilka różnych procesów, które przypadkiem dają podobne wykresy?
