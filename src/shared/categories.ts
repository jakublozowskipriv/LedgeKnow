import type { CategoryId } from './schema';

export interface CategoryMeta {
  id: CategoryId;
  name: string;
  short: string;
  /** dwa kolory gradientu okładki */
  colors: [string, string];
  /** waga przy losowaniu kategorii przez generator (ulubione dziedziny mają więcej) */
  weight: number;
  /** opis dla generatora: czego szukać w tej dziedzinie */
  brief: string;
}

export const CATEGORIES: Record<CategoryId, CategoryMeta> = {
  psychologia: {
    id: 'psychologia',
    name: 'Psychologia i umysł',
    short: 'Psychologia',
    colors: ['#ff2a6d', '#7a04eb'],
    weight: 3,
    brief: 'mechanizmy poznawcze, błędy myślenia, pamięć, emocje, eksperymenty psychologiczne i ich krytyka',
  },
  informatyka: {
    id: 'informatyka',
    name: 'Informatyka i technologia',
    short: 'Informatyka',
    colors: ['#05d9e8', '#3a0ca3'],
    weight: 3,
    brief: 'algorytmy, struktury danych, granice obliczalności, historia komputerów, sieci, kryptografia, AI',
  },
  swiatotworstwo: {
    id: 'swiatotworstwo',
    name: 'Światotwórstwo',
    short: 'Światotwórstwo',
    colors: ['#ff9e64', '#b5179e'],
    weight: 3,
    brief: 'wiedza przydatna przy budowaniu fikcyjnych światów: klimat, geografia, ekonomia, biologia stworzeń, ewolucja języków i kultur, logika magii i technologii',
  },
  popkultura: {
    id: 'popkultura',
    name: 'Popkultura i media',
    short: 'Popkultura',
    colors: ['#f72585', '#4cc9f0'],
    weight: 3,
    brief: 'film, gry, seriale, muzyka popularna, internet, memy – a zwłaszcza mechanizmy i triki stojące za nimi',
  },
  fizyka: {
    id: 'fizyka',
    name: 'Fizyka',
    short: 'Fizyka',
    colors: ['#4361ee', '#f72585'],
    weight: 2,
    brief: 'zjawiska codzienne wyjaśnione fizyką, paradoksy, mechanika kwantowa i względność bez wzorów',
  },
  chemia: {
    id: 'chemia',
    name: 'Chemia',
    short: 'Chemia',
    colors: ['#80ffdb', '#7400b8'],
    weight: 1,
    brief: 'reakcje i materiały wokół nas, chemia kuchni i ciała, dziwne substancje',
  },
  kosmos: {
    id: 'kosmos',
    name: 'Kosmos',
    short: 'Kosmos',
    colors: ['#7209b7', '#05d9e8'],
    weight: 2,
    brief: 'astronomia, planety, gwiazdy, kosmologia, eksploracja kosmosu',
  },
  biologia: {
    id: 'biologia',
    name: 'Biologia i życie',
    short: 'Biologia',
    colors: ['#06d6a0', '#7209b7'],
    weight: 2,
    brief: 'zwierzęta, rośliny, grzyby, ewolucja, zachowania, ekosystemy',
  },
  medycyna: {
    id: 'medycyna',
    name: 'Ciało i medycyna',
    short: 'Medycyna',
    colors: ['#ff4d6d', '#560bad'],
    weight: 2,
    brief: 'jak działa ciało, mózg, sen, odżywianie, historia medycyny, mity zdrowotne',
  },
  matematyka: {
    id: 'matematyka',
    name: 'Matematyka',
    short: 'Matematyka',
    colors: ['#4cc9f0', '#b5179e'],
    weight: 2,
    brief: 'paradoksy, prawdopodobieństwo, nierozwiązane problemy, piękne dowody, liczby w codzienności',
  },
  historia: {
    id: 'historia',
    name: 'Historia (mechanizmy, nie daty)',
    short: 'Historia',
    colors: ['#ffb703', '#9d0208'],
    weight: 2,
    brief: 'wydarzenia jako przyczyny i skutki: dlaczego coś się stało, jaki mechanizm pokazuje – nie kalendarium dat',
  },
  ekonomia: {
    id: 'ekonomia',
    name: 'Ekonomia i społeczeństwo',
    short: 'Ekonomia',
    colors: ['#ffd60a', '#7209b7'],
    weight: 2,
    brief: 'zachęty, rynki, paradoksy ekonomiczne, socjologia, teoria gier',
  },
  jezyk: {
    id: 'jezyk',
    name: 'Język',
    short: 'Język',
    colors: ['#f15bb5', '#00bbf9'],
    weight: 2,
    brief: 'etymologie, jak języki się zmieniają, językoznawstwo, pismo, ciekawostki polszczyzny',
  },
  filozofia: {
    id: 'filozofia',
    name: 'Filozofia',
    short: 'Filozofia',
    colors: ['#9b5de5', '#fee440'],
    weight: 2,
    brief: 'eksperymenty myślowe, paradoksy, etyka, filozofia umysłu i nauki',
  },
  modele: {
    id: 'modele',
    name: 'Modele mentalne',
    short: 'Modele',
    colors: ['#00f5d4', '#f15bb5'],
    weight: 2,
    brief: 'prawa i heurystyki przydatne w myśleniu i decyzjach (Goodhart, Chesterton, Lindy, Pareto itp.)',
  },
  ziemia: {
    id: 'ziemia',
    name: 'Ziemia i geografia',
    short: 'Ziemia',
    colors: ['#38b000', '#3a0ca3'],
    weight: 1,
    brief: 'geologia, klimat, oceany, wulkany, mapy, zjawiska pogodowe',
  },
  sztuka: {
    id: 'sztuka',
    name: 'Sztuka i muzyka',
    short: 'Sztuka',
    colors: ['#ff006e', '#ffbe0b'],
    weight: 1,
    brief: 'percepcja sztuki, teoria muzyki, iluzje, design, architektura',
  },
};

export const CONFIDENCE_LABELS = {
  established: { label: 'Ustalone', desc: 'Szeroki konsensus naukowy, solidne dowody.' },
  mainstream: { label: 'Dominująca hipoteza', desc: 'Najlepsze obecne wyjaśnienie, ale z otwartymi szczegółami.' },
  debated: { label: 'Trwa debata', desc: 'Naukowcy realnie się spierają – poznaj obie strony.' },
  speculative: { label: 'Spekulacja', desc: 'Ciekawa idea, słabe lub brak bezpośrednich dowodów.' },
} as const;

export const FORMAT_LABELS = {
  standard: 'Koncept',
  myth: 'Obalamy mit',
  'open-question': 'Otwarte pytanie',
  fermi: 'Szacowanie Fermiego',
} as const;
