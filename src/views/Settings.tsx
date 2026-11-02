import { useState } from 'preact/hooks';
import { useAppState, update, exportState, importState, resetState, type Level } from '../lib/store';
import { getCards } from '../lib/data';
import { CATEGORIES } from '../shared/categories';
import { CATEGORY_IDS } from '../shared/constants';
import { PageHeader, Section } from '../components/bits';
import { Glyph } from '../components/Glyph';

export function Settings() {
  const s = useAppState();
  const { cards } = getCards();
  const [msg, setMsg] = useState<string | null>(null);

  const setLevel = (l: Level) => update((st) => void (st.settings.level = l));
  const toggleCat = (id: (typeof CATEGORY_IDS)[number]) =>
    update((st) => {
      const ex = new Set(st.settings.excluded);
      ex.has(id) ? ex.delete(id) : ex.add(id);
      st.settings.excluded = [...ex];
    });

  const doExport = async () => {
    const json = exportState();
    const file = new File([json], `ledgeknow-kopia-${new Date().toISOString().slice(0, 10)}.json`, { type: 'application/json' });
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file] }).catch(() => undefined);
    } else {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(file);
      a.download = file.name;
      a.click();
    }
  };

  const doImport = async (e: Event) => {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    try {
      importState(await f.text());
      setMsg('Przywrócono kopię ✔');
    } catch (err) {
      setMsg((err as Error).message);
    }
  };

  return (
    <div class="page">
      <PageHeader title="Ustawienia" backTo="/ja" />

      <Section title="Domyślny poziom wyjaśnień">
        <div class="seg">
          {(
            [
              ['simple', 'Prosto'],
              ['normal', 'Normalnie'],
              ['expert', 'Ekspert'],
            ] as const
          ).map(([id, label]) => (
            <button class={s.settings.level === id ? 'active' : ''} onClick={() => setLevel(id)}>
              {label}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Tempo czytania na głos">
        <div class="row gap">
          <input
            type="range"
            min="0.7"
            max="1.5"
            step="0.05"
            value={s.settings.ttsRate}
            class="grow"
            onInput={(e) => update((st) => void (st.settings.ttsRate = Number((e.target as HTMLInputElement).value)))}
          />
          <span class="mono">{s.settings.ttsRate.toFixed(2)}×</span>
        </div>
      </Section>

      <Section title="Dziedziny w feedzie">
        <p class="section-desc">Wyłącz to, czego nie chcesz widzieć. Domyślnie pokazujemy wszystko.</p>
        <div class="toggles">
          {CATEGORY_IDS.map((id) => {
            const on = !s.settings.excluded.includes(id);
            const n = cards.filter((c) => c.category === id).length;
            return (
              <button class={`toggle ${on ? 'on' : ''}`} onClick={() => toggleCat(id)}>
                <Glyph category={id} size={16} />
                <span class="grow">{CATEGORIES[id].name}</span>
                <span class="muted">{n}</span>
                <span class="switch" />
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="Kopia zapasowa">
        <p class="section-desc">
          Postęp trzymany jest tylko na tym urządzeniu. Raz na jakiś czas zrób kopię – przyda się przy zmianie telefonu.
        </p>
        <div class="row gap wrap">
          <button class="btn" onClick={doExport}>
            Eksportuj postęp
          </button>
          <label class="btn btn-ghost">
            Importuj
            <input type="file" accept="application/json" hidden onChange={doImport} />
          </label>
        </div>
        {msg && <p class="hint">{msg}</p>}
      </Section>

      <Section title="Strefa zagrożenia">
        <button
          class="btn btn-danger"
          onClick={() => {
            if (confirm('Na pewno wyzerować cały postęp, kolekcje i ustawienia?')) resetState();
          }}
        >
          Wyzeruj postęp
        </button>
      </Section>

      <p class="hint center">
        LedgeKnow · {cards.length} kart w bibliotece
      </p>
    </div>
  );
}
