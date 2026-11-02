import { useRoute } from './lib/router';
import { useCards } from './lib/data';
import { useAppState } from './lib/store';
import { dueReviews } from './lib/algo';
import { TabBar } from './components/TabBar';
import { Loading, Empty } from './components/bits';
import { Today } from './views/Today';
import { Explore, SearchPage, CategoryPage } from './views/Explore';
import { ClaudePicks } from './views/ClaudePicks';
import { Review } from './views/Review';
import { Me, CollectionPage } from './views/Me';
import { Settings } from './views/Settings';
import { Notifications } from './views/Notifications';
import { MapView } from './views/MapView';
import { CardPage } from './views/CardPage';
import type { CategoryId } from './shared/schema';

export function App() {
  const route = useRoute();
  const data = useCards();
  const state = useAppState();

  let view;
  if (data.status === 'loading') view = <Loading />;
  else if (data.status === 'error' && !data.cards.length)
    view = (
      <div class="page">
        <Empty>
          Nie udało się wczytać kart ({data.error}). Sprawdź połączenie – po pierwszym wczytaniu aplikacja działa też offline.
        </Empty>
      </div>
    );
  else {
    const [a, b] = route.parts;
    switch (a) {
      case undefined:
        view = <Today />;
        break;
      case 'odkrywaj':
        view = <Explore />;
        break;
      case 'szukaj':
        view = <SearchPage />;
        break;
      case 'kategoria':
        view = <CategoryPage id={b as CategoryId} />;
        break;
      case 'claude':
        view = <ClaudePicks />;
        break;
      case 'powtorki':
        view = <Review />;
        break;
      case 'ja':
        view = <Me />;
        break;
      case 'kolekcja':
        view = <CollectionPage id={b} />;
        break;
      case 'mapa':
        view = <MapView />;
        break;
      case 'ustawienia':
        view = <Settings />;
        break;
      case 'powiadomienia':
        view = <Notifications />;
        break;
      case 'karta':
        view = <CardPage id={b} />;
        break;
      default:
        view = <Today />;
    }
  }

  const isCard = route.parts[0] === 'karta';
  const isFeed = route.parts[0] === 'odkrywaj';
  const due = data.status === 'ready' ? dueReviews(data.cards, state).length : 0;

  return (
    <div class={`app ${isCard ? 'mode-card' : ''} ${isFeed ? 'mode-feed' : ''}`}>
      <div class="bg-grid" aria-hidden="true" />
      <main key={route.path}>{view}</main>
      {data.freshCount > 0 && route.parts[0] === undefined && (
        <div class="fresh-banner">✦ {data.freshCount} {data.freshCount === 1 ? 'nowa karta' : data.freshCount < 5 ? 'nowe karty' : 'nowych kart'} od ostatniej wizyty</div>
      )}
      {!isCard && <TabBar path={route.path} reviewCount={due} />}
    </div>
  );
}
