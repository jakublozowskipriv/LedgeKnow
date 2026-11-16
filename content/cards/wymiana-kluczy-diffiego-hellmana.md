---
id: wymiana-kluczy-diffiego-hellmana
title: Jak uzgodnić tajne hasło, gdy wszyscy podsłuchują? Diffie–Hellman
hook: Dwie osoby, które nigdy się nie spotkały, krzyczą do siebie przez zatłoczoną salę i po chwili znają wspólny sekret, którego nie odgadnie nikt ze słuchających. Twoja przeglądarka robi to przy niemal każdym otwarciu strony.
category: informatyka
format: standard
tags:
  - kryptografia
  - bezpieczeństwo
  - matematyka
  - internet
  - https
confidence: established
sources:
  - title: Diffie–Hellman key exchange – Wikipedia
    url: https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange
  - title: ACM – Whitfield Diffie, A.M. Turing Award Laureate
    url: https://amturing.acm.org/award_winners/diffie_8371646.cfm
  - title: Logjam (computer security) – Wikipedia
    url: https://en.wikipedia.org/wiki/Logjam_(computer_security)
related:
  - problem-bizantyjskich-generalow
  - filtr-blooma
  - dlaczego-0-1-plus-0-2
quiz:
  question: Na czym opiera się bezpieczeństwo wymiany kluczy Diffiego–Hellmana?
  options:
    - Na tym, że łatwo podnieść liczbę do potęgi modulo p, ale bardzo trudno odtworzyć wykładnik z wyniku
    - Na tym, że obie strony wcześniej spotkały się osobiście i wymieniły wspólne hasło
    - Na tym, że liczba pierwsza p i podstawa g są utrzymywane w tajemnicy
    - Na tym, że sekret przesyła się w kilku częściach różnymi kanałami
  answer: 0
  explanation: Liczby p i g są jawne, wymieniane wartości też. Podsłuchujący musiałby z g^a mod p odzyskać a, czyli rozwiązać problem logarytmu dyskretnego. Dla dostatecznie dużych liczb nie umiemy tego zrobić w rozsądnym czasie. To właśnie dlatego wcześniejsze spotkanie nie jest potrzebne.
recall:
  question: Wyjaśnij wymianę Diffiego–Hellmana za pomocą analogii z farbami i powiedz, przed czym ona nie chroni.
  answer: Obie strony biorą jawny wspólny kolor i każda dodaje do niego swój tajny odcień. Wymieniają się mieszankami, a potem każda dolewa do cudzej mieszanki swój sekret. Obie dostają identyczny kolor, a podglądający nie umie „rozmieszać” farb, by wydobyć sekrety. Sam protokół nie potwierdza jednak, z kim rozmawiasz, więc bez uwierzytelnienia nie chroni przed atakiem człowieka pośrodku.
added: 2026-11-18
---

## Prosto

Weźmy dwie osoby, Alicję i Bartka. Każde ma tajny kolor farby i oboje znają jeden wspólny, jawny kolor. Każde miesza swój sekret ze wspólnym kolorem i posyła mieszankę drugiemu, a potem dolewa do niej swój sekret. Oboje dostają ten sam końcowy kolor, a podglądacz, który widział tylko mieszanki, nie umie go odtworzyć, bo farb nie da się rozmieszać.

## Wyjaśnienie

Przez tysiące lat szyfrowanie miało słaby punkt: żeby rozmawiać tajnie, trzeba było najpierw *spotkać się* i ustalić klucz. Na wojnie wymagało to kurierów z książkami kodów, a w internecie, gdzie łączysz się z obcymi serwerami, byłoby niewykonalne. W 1976 roku Whitfield Diffie i Martin Hellman opisali sposób na uzgodnienie wspólnego sekretu przez kanał, który wszyscy podsłuchują. Ten pomysł to **wymiana kluczy Diffiego–Hellmana**.

**Mechanizm** opiera się na **funkcji jednokierunkowej**, czyli operacji łatwej w jedną stronę i bardzo trudnej w drugą. Tutaj jest nią potęgowanie „na zegarze” (**arytmetyka modularna**):

1. Wszyscy znają liczbę pierwszą p (np. 23) i podstawę g (np. 5).
2. Alicja wybiera tajne a = 4 i wysyła 5⁴ mod 23 = **4**.
3. Bartek wybiera tajne b = 3 i wysyła 5³ mod 23 = **10**.
4. Alicja liczy 10⁴ mod 23 = 18. Bartek liczy 4³ mod 23 = 18. Wspólny sekret to 18.

Podsłuchujący widzi 23, 5, 4 i 10. Żeby dostać 18, musiałby z wyniku odgadnąć wykładnik, czyli rozwiązać problem **logarytmu dyskretnego**. Przy małych liczbach to łatwe. Przy liczbach mających setki cyfr najlepsze znane algorytmy potrzebowałyby niewyobrażalnie dużo czasu.

**Haczyk:** protokół nie mówi, *z kim* uzgadniasz sekret. Ktoś pośrodku może udawać Bartka przed Alicją i Alicję przed Bartkiem. Dlatego w praktyce łączy się go z **certyfikatami i podpisami cyfrowymi**. Kłódka w przeglądarce oznacza zwykle właśnie taki duet: Diffie–Hellman tworzy klucz, a certyfikat potwierdza, kto jest po drugiej stronie.

## Ekspert

Publikacja nosiła tytuł *New Directions in Cryptography* (1976). Hellman podkreśla wkład Ralpha Merkle'a, którego „łamigłówki” wyprzedziły ten pomysł, i proponuje nazwę Diffie–Hellman–Merkle. Diffie i Hellman dostali za tę pracę Nagrodę Turinga za 2015 rok. Później okazało się, że w brytyjskim GCHQ Malcolm Williamson wymyślił ten sam schemat kilka lat wcześniej, ale pozostawał on tajny. Dziś stosuje się głównie wariant na **krzywych eliptycznych** (ECDH, np. X25519), który daje to samo bezpieczeństwo przy znacznie krótszych kluczach. Wersje efemeryczne, z nowym kluczem na każdą sesję, zapewniają tzw. *forward secrecy*: kradzież klucza serwera nie odszyfruje dawnych rozmów. Atak **Logjam** (2015) pokazał, że miliony serwerów używały tych samych liczb pierwszych, co pozwalało raz wykonać kosztowne obliczenia i potem łamać wiele połączeń. Algorytm Shora na dużym komputerze kwantowym złamałby DH całkowicie, dlatego wdraża się hybrydy z postkwantowym ML-KEM.

## Głębiej

Asymetria „łatwo zmieszać, trudno rozdzielić” przypomina **entropię**. Rozlane mleko łatwo wmieszać w kawę, ale wyjąć je z powrotem jest praktycznie niemożliwe. W kryptografii nie chodzi jednak o prawa fizyki, tylko o brak znanego algorytmu. Nikt nie udowodnił, że logarytm dyskretny musi być trudny. Wiąże się to z otwartym problemem P vs NP.

Pomysł zmienił też historię społeczną. Szyfrowanie przestało być monopolem państw i wojska, a stało się podstawą handlu internetowego i komunikatorów. Rząd USA traktował wtedy silną kryptografię jak broń i ograniczał jej eksport. To z tych regulacji wzięły się słabe klucze „eksportowe” z lat 90., które dekady później wykorzystał Logjam.

W światotwórstwie podobny trik pozwoliłby dwóm magom ustalić wspólne zaklęcie ochronne na oczach wrogiego dworu. Wystarczy, że ich magia ma operację łatwą do wykonania i niemożliwą do odwrócenia.
