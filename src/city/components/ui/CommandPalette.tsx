import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { caseStudies, caseStudyFor } from '../../data/caseStudies';
import { districts } from '../../data/districts';
import { projects } from '../../data/projects';
import { site } from '../../data/site';
import { CITY_BASE, pathForCaseStudy, pathForSelection } from '../../routing';
import { cityStore } from '../../state/cityStore';
import { fuzzyScore } from './fuzzy';

type Group = 'Work' | 'Projects' | 'Places' | 'Other';
const GROUPS: Group[] = ['Work', 'Projects', 'Places', 'Other'];

interface Command {
  id: string;
  group: Group;
  label: string;
  hint: string;
  keywords?: string;
  /** In-app path, or an external URL opened in a new tab. */
  to: string;
  external?: boolean;
  /** Something to do before going there. */
  effect?: () => void;
  secret?: boolean;
}

/** Easter eggs: never listed, only found by typing them. */
function secretFor(query: string): Command | null {
  const typed = query.trim().toLowerCase().replace(/\s+/g, ' ');
  if (typed === 'sudo hire sophia') {
    return { id: 'sudo', group: 'Other', label: 'permission granted ✓', hint: 'say hello ↗', to: `mailto:${site.email}`, external: true, secret: true };
  }
  if (typed.length >= 4 && '/dumpster'.startsWith(typed)) {
    return { id: 'dumpster', group: 'Other', label: '/dumpster', hint: 'take out the trash', to: pathForSelection({ selected: 'lab', item: null }), effect: cityStore.revealDumpster, secret: true };
  }
  return null;
}

function buildCommands(): Command[] {
  const work = caseStudies
    .filter((study) => study.section === 'work')
    .map<Command>((study) => ({
      id: `work-${study.id}`,
      group: 'Work',
      label: study.eyebrow.split(' / ')[1],
      hint: `${study.role} · ${study.year}`,
      keywords: `${study.title} ${study.context ?? ''} ${study.stack?.join(' ') ?? ''}`,
      to: pathForCaseStudy(study),
    }));
  const projectCommands = projects.map<Command>((project) => {
    const study = caseStudyFor('lab', project.id);
    return {
      id: `project-${project.id}`,
      group: 'Projects',
      label: project.name,
      hint: study ? 'case study' : 'in the lab',
      keywords: `${project.kicker} ${project.summary}`,
      to: study ? pathForCaseStudy(study) : pathForSelection({ selected: 'lab', item: project.id }),
    };
  });
  const places = districts.map<Command>((district) => ({
    id: `place-${district.id}`,
    group: 'Places',
    label: district.name,
    hint: 'fly there',
    keywords: `${district.tags} ${district.role}`,
    to: pathForSelection({ selected: district.id, item: null }),
  }));
  const other: Command[] = [
    { id: 'about', group: 'Other', label: 'About Sophia', hint: 'page', keywords: 'bio currently interests education', to: `${CITY_BASE}/about` },
    { id: 'resume', group: 'Other', label: 'Résumé', hint: 'PDF ↗', keywords: 'resume cv', to: site.resume, external: true },
    { id: 'contact', group: 'Other', label: 'Contact', hint: site.email, keywords: 'email hello', to: `mailto:${site.email}`, external: true },
    ...(site.links.linkedin
      ? [{ id: 'linkedin', group: 'Other' as const, label: 'LinkedIn', hint: '↗', to: site.links.linkedin, external: true }]
      : []),
    ...(site.links.github ? [{ id: 'github', group: 'Other' as const, label: 'GitHub', hint: '↗', to: site.links.github, external: true }] : []),
    { id: 'city', group: 'Other', label: 'Back to the city', hint: 'overview', keywords: 'home index world map', to: CITY_BASE },
  ];
  return [...work, ...projectCommands, ...places, ...other];
}

/** Keywords count only when the query starts one of their words. */
function keywordScore(query: string, keywords = '') {
  const words = keywords.toLowerCase().split(/[\s·&+/-]+/);
  return words.some((word) => word.startsWith(query)) ? 4 + query.length : 0;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

/** ⌘K: a fast way to anywhere, for anyone who would rather not explore the 3D world. */
export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const navigate = useNavigate();
  const commands = useMemo(buildCommands, []);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  // With no query, everything in its groups; with one, best match first. Labels match
  // loosely, keywords only as words, so "studio" doesn't match letters scattered through a sentence.
  const searching = query.trim().length > 0;
  const results = useMemo(() => {
    const secret = secretFor(query);
    if (secret) return [secret];
    if (!searching) return GROUPS.flatMap((group) => commands.filter((command) => command.group === group));
    const q = query.trim().toLowerCase();
    return commands
      .map((command) => ({
        command,
        score: Math.max(fuzzyScore(q, command.label) * 2, keywordScore(q, command.keywords)),
      }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ command }) => command);
  }, [commands, query, searching]);

  useEffect(() => {
    if (open) {
      returnFocus.current = document.activeElement as HTMLElement | null;
      setQuery('');
      setActive(0);
      requestAnimationFrame(() => input.current?.focus());
    } else if (!document.activeElement || document.activeElement === document.body) {
      // Only if nothing else (such as a newly opened page) has taken focus.
      returnFocus.current?.focus?.();
    }
  }, [open]);

  useEffect(() => setActive(0), [query]);

  if (!open) return null;

  const run = (command: Command | undefined) => {
    if (!command) return;
    command.effect?.();
    onClose();
    if (command.external) window.open(command.to, command.to.startsWith('mailto:') ? '_self' : '_blank', 'noreferrer');
    else navigate(command.to);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const move = { ArrowDown: 1, ArrowUp: -1 }[event.key as 'ArrowDown' | 'ArrowUp'];
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      onClose();
    } else if (move) {
      event.preventDefault();
      setActive((i) => (i + move + results.length) % Math.max(results.length, 1));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      run(results[active]);
    } else if (event.key === 'Escape' || event.key === 'Tab') {
      // Tab would leave the dialog; there is nothing else in it to reach.
      event.preventDefault();
      if (event.key === 'Escape') onClose();
    }
    // Keep these keys from also moving the city behind the palette.
    event.stopPropagation();
  };

  let lastGroup: Group | null = null;
  return (
    <div className="palette" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="palette__dialog" role="dialog" aria-modal="true" aria-label="Go to">
        <input
          ref={input}
          className="palette__input"
          placeholder="Where do you want to go?"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-expanded="true"
          aria-controls="palette-results"
          aria-activedescendant={results[active] ? `palette-${results[active].id}` : undefined}
          aria-autocomplete="list"
          spellCheck={false}
          autoComplete="off"
        />
        <ul id="palette-results" className="palette__results" role="listbox" aria-label="Destinations">
          {results.length === 0 && <li className="palette__empty">Nothing matches “{query}”.</li>}
          {results.map((command, i) => {
            const heading = !searching && command.group !== lastGroup ? command.group : null;
            lastGroup = command.group;
            return (
              <li key={command.id} role="presentation">
                {heading && <p className="palette__group" aria-hidden="true">{heading}</p>}
                <div
                  id={`palette-${command.id}`}
                  role="option"
                  aria-selected={i === active}
                  className="palette__option"
                  onMouseMove={() => setActive(i)}
                  onClick={() => run(command)}
                >
                  <span className="palette__label">{command.label}</span>
                  <span className="palette__hint">{searching && !command.secret ? `${command.group} · ${command.hint}` : command.hint}</span>
                </div>
              </li>
            );
          })}
        </ul>
        <p className="palette__keys" aria-hidden="true">
          <span>↑↓ move</span>
          <span>↵ open</span>
          <span>esc close</span>
        </p>
      </div>
    </div>
  );
}
