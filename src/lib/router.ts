import { useEffect, useState } from 'preact/hooks';

export interface Route {
  path: string;
  parts: string[];
}

const parse = (): Route => {
  const path = location.hash.replace(/^#/, '') || '/';
  return { path, parts: path.split('/').filter(Boolean).map(decodeURIComponent) };
};

// Ile kroków nawigacji zrobiliśmy w tej sesji – żeby „wstecz” nie wyrzucało z aplikacji.
let depth = 0;
addEventListener('hashchange', () => {
  depth++;
});

export function useRoute(): Route {
  const [route, setRoute] = useState(parse);
  useEffect(() => {
    const on = () => {
      setRoute(parse());
      window.scrollTo(0, 0);
    };
    addEventListener('hashchange', on);
    return () => removeEventListener('hashchange', on);
  }, []);
  return route;
}

export function go(path: string) {
  location.hash = path;
}

export function back(fallback = '/') {
  if (depth > 0) {
    depth -= 2; // history.back() wywoła hashchange (+1)
    history.back();
  } else go(fallback);
}

export const cardHref = (id: string) => `#/karta/${encodeURIComponent(id)}`;
