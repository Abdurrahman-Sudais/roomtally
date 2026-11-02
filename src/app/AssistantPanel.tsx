import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bot, Info, MessageSquare } from 'lucide-react';
import { EXAMPLE_QUESTIONS, answer, type AssistantAnswer } from '../lib/assistant';
import { useInventory } from '../store/InventoryContext';

/** “Ask about this inventory” — answers from the demo records and lists the records it used. */
export function AssistantPanel() {
  const { state } = useInventory();
  const [q, setQ] = useState('');
  const [asked, setAsked] = useState<{ q: string; a: AssistantAnswer } | null>(null);
  const ask = (question: string) => {
    if (!question.trim()) return;
    setAsked({ q: question.trim(), a: answer(question, state) });
    setQ('');
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    ask(q);
  };
  return (
    <section className="panel" aria-labelledby="assistant-title">
      <header className="flex items-center gap-2 border-b border-line bg-ink px-4 py-3 text-paper">
        <Bot size={16} className="text-[#9db0f5]" aria-hidden />
        <h2 id="assistant-title" className="text-[14px] font-semibold">Ask about this inventory</h2>
        <span className="border border-white/20 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-paper/70">Simulated assistant</span>
      </header>
      <div className="space-y-4 p-4">
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_QUESTIONS.map((e) => (
            <button key={e} type="button" onClick={() => ask(e)} className="border border-line bg-paper px-3 py-1.5 text-[12.5px] text-ink-soft hover:border-cobalt hover:text-cobalt">{e}</button>
          ))}
        </div>
        <form onSubmit={submit} className="flex gap-2">
          <label htmlFor="assistant-q" className="sr-only">Ask a question about the demo inventory</label>
          <input id="assistant-q" className="field" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. What is in room 3.02?" maxLength={200} />
          <button type="submit" className="btn-accent shrink-0"><MessageSquare size={14} aria-hidden /> Ask</button>
        </form>
        {asked && (
          <div className={`border p-4 ${asked.a.kind === 'refusal' ? 'border-amber/40 bg-amber-50' : 'border-line bg-stone-50'}`} aria-live="polite">
            <p className="text-[11.5px] text-muted">“{asked.q}”</p>
            <h3 className="mt-1 text-[15px] font-semibold">{asked.a.title}</h3>
            <ul className="mt-2 space-y-1.5 text-[13.5px] text-ink-soft">{asked.a.lines.map((l) => <li key={l}>{l}</li>)}</ul>
            {asked.a.sources.length > 0 && <p className="mt-3 font-mono text-[11px] text-muted">From {asked.a.sources.length} record{asked.a.sources.length > 1 ? 's' : ''}: {asked.a.sources.join(', ')}</p>}
            {asked.a.links.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-3">
                {asked.a.links.map((l) => <Link key={l.to} to={l.to} className="inline-flex items-center gap-1 text-[12.5px] font-medium text-cobalt hover:underline">{l.label} <ArrowRight size={12} aria-hidden /></Link>)}
              </div>
            )}
          </div>
        )}
        <p className="flex items-start gap-1.5 text-[11.5px] text-muted"><Info size={13} className="mt-0.5 shrink-0" aria-hidden /> Answers are computed from this demo’s records and list the records used. No language model is called. It never values furniture or estimates dimensions.</p>
      </div>
    </section>
  );
}
