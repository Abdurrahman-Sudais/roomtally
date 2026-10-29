import { useEffect, useState } from 'react';
import { Check, ImagePlus, Info, Trash2 } from 'lucide-react';
import { Drawer, Field, PhotoRef, StatusTag } from '../components/ui';
import {
  ACTION_LABEL, ACTIONS, CATEGORIES, CONDITION_LABEL, CONDITIONS, DIMENSION_SOURCE_LABEL, STATUS_LABEL, STATUSES,
  type DimensionSource, type DimensionUnit, type InventoryItem,
} from '../data/types';
import { useInventory } from '../store/InventoryContext';

interface DimDraft {
  enabled: boolean;
  width: string;
  depth: string;
  height: string;
  unit: DimensionUnit;
  source: DimensionSource;
  verifiedBy: string;
}

const toDraft = (i: InventoryItem, unit: DimensionUnit): DimDraft =>
  i.dimensions
    ? { enabled: true, width: String(i.dimensions.width), depth: String(i.dimensions.depth), height: String(i.dimensions.height), unit: i.dimensions.unit, source: i.dimensions.source, verifiedBy: i.dimensions.verifiedBy ?? '' }
    : { enabled: false, width: '', depth: '', height: '', unit, source: 'entered', verifiedBy: '' };

export function blankItem(id: string, propertyId: string, roomId: string): InventoryItem {
  return {
    id, category: 'Desk', description: '', propertyId, roomId, proposedQuantity: 1, confirmedQuantity: null,
    status: 'proposed', condition: 'unassessed', conditionNotes: '', dimensions: null, action: 'unassigned',
    actionNotes: '', photoRefs: [], observationIds: [], updatedAt: new Date().toISOString(),
  };
}

export function ItemEditor({
  item,
  isNew,
  onClose,
  onSaved,
}: {
  item: InventoryItem | null;
  isNew?: boolean;
  onClose: () => void;
  onSaved?: (msg: string) => void;
}) {
  const { state, dispatch } = useInventory();
  const [d, setD] = useState<InventoryItem | null>(item);
  const [dim, setDim] = useState<DimDraft | null>(item ? toDraft(item, state.settings.defaultUnit) : null);
  const [confirmedStr, setConfirmedStr] = useState('');
  const [newRef, setNewRef] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    setD(item);
    setDim(item ? toDraft(item, state.settings.defaultUnit) : null);
    setConfirmedStr(item?.confirmedQuantity != null ? String(item.confirmedQuantity) : '');
    setErrors({});
    setConfirmDelete(false);
    setNewRef('');
  }, [item, state.settings.defaultUnit]);

  if (!d || !dim) return null;
  const rooms = state.rooms.filter((r) => r.propertyId === d.propertyId);
  const up = (patch: Partial<InventoryItem>) => setD({ ...d, ...patch });
  const upDim = (patch: Partial<DimDraft>) => setDim({ ...dim, ...patch });

  const save = () => {
    const e: Record<string, string> = {};
    if (!d.description.trim()) e.description = 'Add a short description.';
    if (!d.roomId) e.room = 'Assign the item to a room.';
    if (!Number.isInteger(d.proposedQuantity) || d.proposedQuantity < 0) e.proposed = 'Use a whole number of 0 or more.';
    let confirmed: number | null = null;
    if (confirmedStr.trim() !== '') {
      const n = Number(confirmedStr);
      if (!Number.isInteger(n) || n < 0) e.confirmed = 'Use a whole number of 0 or more, or leave blank.';
      else confirmed = n;
    }
    if (d.status === 'confirmed' && confirmed === null) e.confirmed = 'A confirmed record needs a confirmed quantity.';
    let dimensions: InventoryItem['dimensions'] = null;
    if (dim.enabled) {
      const vals = [dim.width, dim.depth, dim.height].map(Number);
      if (vals.some((v, idx) => !([dim.width, dim.depth, dim.height][idx].trim()) || !Number.isFinite(v) || v <= 0)) {
        e.dimensions = 'Enter width, depth, and height as positive numbers, or switch off dimensions.';
      } else {
        dimensions = { width: vals[0], depth: vals[1], height: vals[2], unit: dim.unit, source: dim.source, verifiedBy: dim.verifiedBy.trim() || undefined };
      }
    }
    setErrors(e);
    if (Object.keys(e).length) return;
    dispatch({ type: 'saveItem', item: { ...d, description: d.description.trim(), confirmedQuantity: confirmed, dimensions } });
    onSaved?.(`${isNew ? 'Added' : 'Saved'} ${d.id}`);
    onClose();
  };

  const confirmProposed = () => {
    setConfirmedStr(String(d.proposedQuantity));
    up({ status: 'confirmed' });
  };

  const err = (k: string) => (errors[k] ? { 'aria-invalid': true, 'aria-describedby': `ie-${k}-error` } : {});

  return (
    <Drawer
      open
      onClose={onClose}
      subtitle={<span className="font-mono">{d.id}</span>}
      title={isNew ? 'New furniture record' : d.description || 'Furniture record'}
      footer={
        <>
          {!isNew && (
            confirmDelete ? (
              <div className="mr-auto flex items-center gap-2">
                <span className="text-[12.5px] text-rust">Remove this record?</span>
                <button className="btn-sm btn border-rust bg-rust text-white" onClick={() => { dispatch({ type: 'deleteItem', id: d.id }); onSaved?.(`Removed ${d.id}`); onClose(); }}>Remove</button>
                <button className="btn-ghost btn-sm" onClick={() => setConfirmDelete(false)}>Cancel</button>
              </div>
            ) : (
              <button className="btn-ghost btn-sm mr-auto text-rust" onClick={() => setConfirmDelete(true)}><Trash2 size={14} /> Remove</button>
            )
          )}
          <button className="btn-secondary btn-sm" onClick={onClose}>Cancel</button>
          <button className="btn-primary btn-sm" onClick={save}>{isNew ? 'Add record' : 'Save changes'}</button>
        </>
      }
    >
      <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); save(); }} noValidate>
        {Object.keys(errors).length > 0 && (
          <div role="alert" className="border border-rust/30 bg-rust-50 px-3 py-2 text-[13px] text-rust">Please correct the highlighted fields.</div>
        )}

        <fieldset className="space-y-4">
          <legend className="eyebrow mb-3">Identification</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Furniture category" htmlFor="ie-cat">
              <select id="ie-cat" className="field" value={d.category} onChange={(e) => up({ category: e.target.value as InventoryItem['category'] })}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Survey status" htmlFor="ie-status">
              <select id="ie-status" className="field" value={d.status} onChange={(e) => up({ status: e.target.value as InventoryItem['status'] })}>
                {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Description *" htmlFor="ie-description" error={errors.description}>
            <input id="ie-description" className="field" value={d.description} onChange={(e) => up({ description: e.target.value })} placeholder="e.g. Mesh task chair, black, adjustable arms" {...err('description')} />
          </Field>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="eyebrow mb-3">Location</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Property" htmlFor="ie-prop">
              <select id="ie-prop" className="field" value={d.propertyId} onChange={(e) => {
                const pid = e.target.value;
                up({ propertyId: pid, roomId: state.rooms.find((r) => r.propertyId === pid)?.id ?? '' });
              }}>
                {state.properties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </Field>
            <Field label="Room *" htmlFor="ie-room" error={errors.room}>
              <select id="ie-room" className="field" value={d.roomId} onChange={(e) => up({ roomId: e.target.value })} {...err('room')}>
                {rooms.map((r) => <option key={r.id} value={r.id}>{r.code} · {r.name}</option>)}
              </select>
            </Field>
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="eyebrow mb-3">Quantity</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Proposed quantity" htmlFor="ie-proposed" hint="Count proposed from survey observations." error={errors.proposed}>
              <input id="ie-proposed" type="number" min={0} step={1} className="field" value={d.proposedQuantity} onChange={(e) => up({ proposedQuantity: e.target.value === '' ? 0 : Number(e.target.value) })} {...err('proposed')} />
            </Field>
            <Field label="Confirmed quantity" htmlFor="ie-confirmed" hint="Leave blank until a reviewer has counted." error={errors.confirmed}>
              <input id="ie-confirmed" type="number" min={0} step={1} className="field" value={confirmedStr} onChange={(e) => setConfirmedStr(e.target.value)} placeholder="Not confirmed" {...err('confirmed')} />
            </Field>
          </div>
          {d.observationIds.length > 0 && d.status === 'needs-review' && (
            <p className="flex gap-2 border border-amber/30 bg-amber-50 px-3 py-2 text-[12.5px] text-amber">
              <Info size={15} className="mt-0.5 shrink-0" />
              This record is part of an open duplicate review. Resolve the review before confirming its quantity.
            </p>
          )}
          <button type="button" className="btn-secondary btn-sm" onClick={confirmProposed}>
            <Check size={14} /> Confirm proposed quantity ({d.proposedQuantity})
          </button>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="eyebrow mb-3">Condition</legend>
          <Field label="Condition grade" htmlFor="ie-cond" hint="Record only what a person has observed on site.">
            <select id="ie-cond" className="field" value={d.condition} onChange={(e) => up({ condition: e.target.value as InventoryItem['condition'] })} aria-describedby="ie-cond-hint">
              {CONDITIONS.map((c) => <option key={c} value={c}>{CONDITION_LABEL[c]}</option>)}
            </select>
          </Field>
          <Field label="Condition notes" htmlFor="ie-cnotes">
            <textarea id="ie-cnotes" rows={3} className="field" value={d.conditionNotes} onChange={(e) => up({ conditionNotes: e.target.value })} placeholder="e.g. Fabric pilling on seat; arms intact; gas lift tested OK." />
          </Field>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="eyebrow mb-3">Dimensions</legend>
          <label className="flex items-center gap-2 text-[13.5px]">
            <input type="checkbox" checked={dim.enabled} onChange={(e) => upDim({ enabled: e.target.checked })} className="h-4 w-4 accent-[#2747b8]" />
            Record verified dimensions
          </label>
          <p className="flex gap-2 text-[12.5px] text-muted">
            <Info size={14} className="mt-0.5 shrink-0" />
            Enter dimensions that were measured, imported from a schedule, or otherwise verified. Roomtally never estimates dimensions from photographs.
          </p>
          {dim.enabled && (
            <div className="space-y-4 border border-line bg-white p-4">
              <div className="grid grid-cols-3 gap-3">
                {(['width', 'depth', 'height'] as const).map((k) => (
                  <Field key={k} label={`${k[0].toUpperCase()}${k.slice(1)} (${dim.unit})`} htmlFor={`ie-${k}`}>
                    <input id={`ie-${k}`} type="number" min={0} step="any" inputMode="decimal" className="field" value={dim[k]} onChange={(e) => upDim({ [k]: e.target.value })} aria-invalid={!!errors.dimensions} />
                  </Field>
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <Field label="Unit" htmlFor="ie-unit">
                  <select id="ie-unit" className="field" value={dim.unit} onChange={(e) => upDim({ unit: e.target.value as DimensionUnit })}>
                    <option value="cm">Centimetres (cm)</option>
                    <option value="mm">Millimetres (mm)</option>
                  </select>
                </Field>
                <Field label="Source" htmlFor="ie-src">
                  <select id="ie-src" className="field" value={dim.source} onChange={(e) => upDim({ source: e.target.value as DimensionSource })}>
                    {(Object.keys(DIMENSION_SOURCE_LABEL) as DimensionSource[]).map((s) => <option key={s} value={s}>{DIMENSION_SOURCE_LABEL[s]}</option>)}
                  </select>
                </Field>
                <Field label="Verified by / reference" htmlFor="ie-vby">
                  <input id="ie-vby" className="field" value={dim.verifiedBy} onChange={(e) => upDim({ verifiedBy: e.target.value })} placeholder="Name or document" />
                </Field>
              </div>
              {errors.dimensions && <p id="ie-dimensions-error" role="alert" className="text-[12px] text-rust">{errors.dimensions}</p>}
            </div>
          )}
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="eyebrow mb-3">Proposed action</legend>
          <Field label="Action" htmlFor="ie-action">
            <select id="ie-action" className="field" value={d.action} onChange={(e) => up({ action: e.target.value as InventoryItem['action'] })}>
              {ACTIONS.map((a) => <option key={a} value={a}>{ACTION_LABEL[a]}</option>)}
            </select>
          </Field>
          <Field label="Action notes" htmlFor="ie-anotes">
            <textarea id="ie-anotes" rows={2} className="field" value={d.actionNotes} onChange={(e) => up({ actionNotes: e.target.value })} placeholder="Handling, destination floor, supplier or donation contact…" />
          </Field>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="eyebrow mb-3">Supporting photograph references</legend>
          <div className="flex flex-wrap gap-2">
            {d.photoRefs.map((p) => (
              <div key={p} className="relative">
                <PhotoRef name={p} />
                <button type="button" aria-label={`Remove reference ${p}`} className="absolute -right-1.5 -top-1.5 h-5 w-5 border border-line bg-paper text-[11px] leading-none hover:border-rust hover:text-rust" onClick={() => up({ photoRefs: d.photoRefs.filter((x) => x !== p) })}>×</button>
              </div>
            ))}
            {d.photoRefs.length === 0 && <p className="text-[13px] text-muted">No photograph references yet.</p>}
          </div>
          <div className="flex gap-2">
            <label htmlFor="ie-newref" className="sr-only">Photograph reference</label>
            <input id="ie-newref" className="field" value={newRef} onChange={(e) => setNewRef(e.target.value)} placeholder="e.g. MH-3.02-018.jpg" />
            <button type="button" className="btn-secondary" disabled={!newRef.trim()} onClick={() => { up({ photoRefs: [...d.photoRefs, newRef.trim()] }); setNewRef(''); }}>
              <ImagePlus size={15} /> Add
            </button>
          </div>
          {d.observationIds.length > 0 && (
            <p className="text-[12px] text-muted">Linked observations: <span className="font-mono">{d.observationIds.join(', ')}</span></p>
          )}
        </fieldset>

        {!isNew && (
          <p className="flex items-center gap-2 border-t border-line pt-4 text-[12px] text-muted">
            Current status <StatusTag status={item!.status} /> · last updated {new Date(item!.updatedAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
          </p>
        )}
        <button type="submit" className="sr-only">Save</button>
      </form>
    </Drawer>
  );
}
