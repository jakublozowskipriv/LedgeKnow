import { useState } from 'preact/hooks';
import { createCollection, toggleInCollection, useAppState } from '../lib/store';

export function CollectionSheet({ cardId, onClose }: { cardId: string; onClose: () => void }) {
  const s = useAppState();
  const [name, setName] = useState('');
  const add = (e: Event) => {
    e.preventDefault();
    if (!name.trim()) return;
    const id = createCollection(name);
    toggleInCollection(id, cardId);
    setName('');
  };
  return (
    <div class="sheet-backdrop" onClick={onClose}>
      <div class="sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Kolekcje">
        <div class="sheet-handle" />
        <h3>Zapisz w kolekcji</h3>
        <div class="sheet-list">
          {s.collections.map((c) => {
            const on = c.cardIds.includes(cardId);
            return (
              <button class={`sheet-item ${on ? 'on' : ''}`} onClick={() => toggleInCollection(c.id, cardId)}>
                <span class="check">{on ? '✓' : ''}</span>
                <span class="grow">{c.name}</span>
                <span class="muted">{c.cardIds.length}</span>
              </button>
            );
          })}
        </div>
        <form class="row gap-s" onSubmit={add}>
          <input class="input grow" placeholder="Nowa kolekcja, np. „Na imprezę”" value={name} onInput={(e) => setName((e.target as HTMLInputElement).value)} />
          <button class="btn" type="submit">
            Dodaj
          </button>
        </form>
        <button class="btn btn-ghost wide" onClick={onClose}>
          Gotowe
        </button>
      </div>
    </div>
  );
}
