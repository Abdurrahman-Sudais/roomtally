import { useMemo, useState } from 'react';
import { Check, Download, Minus } from 'lucide-react';
import { ACTIONS, ACTION_LABEL, DEMO_USERS, ROLE_LABEL, can, userById, type DemoRole } from '../lib/access';
import { RoleNote } from '../components/ui';
import { useInventory } from '../store/InventoryContext';
import { PageTitle } from './AppLayout';

const ROLES: DemoRole[] = ['manager', 'planner', 'surveyor', 'viewer'];
const csvCell = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
const fmt = (iso: string) => new Date(iso).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });

export default function AuditPage() {
  const { state, can: allowed, user } = useInventory();
  const [q, setQ] = useState('');
  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    return [...state.audit].reverse().filter((e) => !t || `${userById(e.userId).name} ${e.action} ${e.detail}`.toLowerCase().includes(t));
  }, [state.audit, q]);
  const exportCsv = () => {
    const text = [['Time', 'Person', 'Action', 'Detail'], ...rows.map((e) => [e.at, userById(e.userId).name, e.action, e.detail])].map((r) => r.map(csvCell).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'roomtally-audit-log.csv';
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <>
      <PageTitle title="Audit & roles" intro="Who can do what in this demo workspace, and an append-only record of every change made in this browser. Switch user under “Demo as” to try each role." />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="min-w-0 space-y-6">
          <section className="panel p-5">
            <h2 className="text-[14px] font-semibold">Roles and permissions</h2>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead><tr className="text-left text-[11.5px] text-muted"><th className="py-2 pr-3 font-medium">Action</th>{ROLES.map((r) => <th key={r} className="px-2 py-2 text-center font-medium">{ROLE_LABEL[r]}</th>)}</tr></thead>
                <tbody>
                  {ACTIONS.map((a) => (
                    <tr key={a} className="border-t border-line">
                      <td className="py-2 pr-3">{ACTION_LABEL[a]}</td>
                      {ROLES.map((r) => <td key={r} className="px-2 py-2 text-center">{can(r, a) ? <Check size={15} className="mx-auto text-teal" aria-label="Allowed" /> : <Minus size={15} className="mx-auto text-stone-300" aria-label="Not allowed" />}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-[12px] text-muted">Resetting the demo is open to everyone because it only clears this browser. In production, roles come from your identity provider and are enforced on the server.</p>
          </section>
          <section className="panel p-5">
            <h2 className="text-[14px] font-semibold">People in this demo</h2>
            <ul className="mt-2 divide-y divide-line">
              {DEMO_USERS.map((u) => (
                <li key={u.id} className="flex items-center justify-between gap-3 py-2.5 text-[13.5px]">
                  <span className="flex items-center gap-2.5"><span className="flex h-7 w-7 items-center justify-center bg-ink font-mono text-[11px] text-paper">{u.initials}</span><span><span className="block">{u.name}</span><span className="block text-[11.5px] text-muted">{u.title}</span></span></span>
                  <span className="border border-line px-2 py-0.5 text-[11.5px]">{ROLE_LABEL[u.role]}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
        <section className="panel min-w-0 p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[14px] font-semibold">Audit log ({state.audit.length})</h2>
            {allowed('audit') && <button className="btn-secondary btn-sm" onClick={exportCsv}><Download size={13} /> Export CSV</button>}
          </div>
          <div className="mt-3">
            {!allowed('audit') ? (
              <RoleNote>Acting as {ROLE_LABEL[user.role].toLowerCase()}: only a facilities manager can read the audit log. Switch to Grace Adeyemi under “Demo as”.</RoleNote>
            ) : (
              <>
                <label htmlFor="audit-q" className="sr-only">Filter the audit log</label>
                <input id="audit-q" className="field mb-3" placeholder="Filter by person, action or record…" value={q} onChange={(e) => setQ(e.target.value)} />
                <ol className="divide-y divide-line">
                  {rows.map((e) => (
                    <li key={e.id} className="py-2.5 text-[13px]">
                      <div className="flex flex-wrap items-baseline justify-between gap-2"><span className="font-medium">{userById(e.userId).name}</span><span className="font-mono text-[11px] text-muted">{fmt(e.at)}</span></div>
                      <div className="text-ink-soft"><span className="mr-1.5 bg-stone-100 px-1.5 py-0.5 font-mono text-[10px] uppercase text-muted">{e.action}</span>{e.detail}</div>
                    </li>
                  ))}
                  {!rows.length && <li className="py-3 text-[13px] text-muted">No changes yet. Edit an item, resolve a duplicate or move a card on the plan, and it will appear here.</li>}
                </ol>
              </>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
