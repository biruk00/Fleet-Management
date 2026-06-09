import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import {
  Search, Plus, Edit2, Trash2, Phone, Truck, Loader,
  User, X, Check, ChevronLeft, ChevronRight, Users
} from 'lucide-react';

// ─── Status color helper ──────────────────────────────────────────────────────
const getStatusColor = (status) => {
  const s = (status || '').toLowerCase();
  switch (s) {
    case 'loading':   return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'unloading': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'ongoing':   return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'oncoming':  return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'parked':    return 'bg-slate-100 text-slate-800 border-slate-200';
    case 'garage':    return 'bg-red-100 text-red-800 border-red-200';
    case 'insurance': return 'bg-purple-100 text-purple-800 border-purple-200';
    default:          return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

// ─── Driver Modal ─────────────────────────────────────────────────────────────
function DriverModal({ isOpen, onClose, driver, onSaved }) {
  const [form, setForm] = useState({ name: '', plate_no: '', trailer_no: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (driver) {
      setForm({ name: driver.name || '', plate_no: driver.plate_no || '', trailer_no: driver.trailer_no || '', phone: driver.phone || '' });
    } else {
      setForm({ name: '', plate_no: '', trailer_no: '', phone: '' });
    }
    setError('');
  }, [driver, isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Driver name is required.'); return; }
    setSaving(true);
    setError('');
    try {
      if (driver?.id) {
        const { error: err } = await supabase.from('drivers').update(form).eq('id', driver.id);
        if (err) throw err;
      } else {
        const { error: err } = await supabase.from('drivers').insert([form]);
        if (err) throw err;
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save driver.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <User className="h-5 w-5 text-orange-500" />
            {driver?.id ? 'Edit Driver' : 'Add Driver'}
          </h3>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Driver Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Girma Araresa"
              className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Plate No</label>
              <input
                type="text"
                value={form.plate_no}
                onChange={e => setForm(f => ({ ...f, plate_no: e.target.value }))}
                placeholder="e.g. 3-91456"
                className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Trailer No</label>
              <input
                type="text"
                value={form.trailer_no}
                onChange={e => setForm(f => ({ ...f, trailer_no: e.target.value }))}
                placeholder="e.g. 14940"
                className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 outline-none font-mono"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Phone Number</label>
            <input
              type="text"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              placeholder="e.g. 0911234567"
              className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-5 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-60 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
          >
            {saving ? <Loader className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            {driver?.id ? 'Update' : 'Add Driver'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DriversPage() {
  const { isAdmin } = useAuth();
  const [drivers, setDrivers] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 15;

  const [modalOpen, setModalOpen] = useState(false);
  const [editDriver, setEditDriver] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [driversRes, trucksRes] = await Promise.all([
        supabase.from('drivers').select('*').order('name', { ascending: true }),
        supabase.from('trucks').select('plate_no, status, current_location, category')
      ]);
      if (!driversRes.error) setDrivers(driversRes.data || []);
      if (!trucksRes.error) setTrucks(trucksRes.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete driver "${name}"?`)) return;
    const { error } = await supabase.from('drivers').delete().eq('id', id);
    if (!error) setDrivers(ds => ds.filter(d => d.id !== id));
    else alert('Failed to delete driver.');
  };

  const getTruckInfo = (plateNo) => {
    if (!plateNo) return null;
    return trucks.find(t => t.plate_no === plateNo) || null;
  };

  // Filter
  const filtered = drivers.filter(d => {
    const q = search.toLowerCase();
    return (
      (d.name || '').toLowerCase().includes(q) ||
      (d.plate_no || '').toLowerCase().includes(q) ||
      (d.phone || '').includes(q)
    );
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleSearch = (v) => { setSearch(v); setPage(1); };

  // Stats
  const withTruck = drivers.filter(d => d.plate_no && getTruckInfo(d.plate_no)).length;
  const noDriver = trucks.filter(t =>
    !drivers.some(d => d.plate_no === t.plate_no)
  ).length;

  return (
    <div className="bg-[#0B1120] sm:bg-white sm:dark:bg-slate-800 shadow-none sm:shadow-xl rounded-none sm:rounded-2xl border-0 sm:border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">

      {/* ═══ HEADER ═══ */}
      <div className="p-4 sm:p-6 border-b border-white/5 sm:border-slate-200 dark:border-slate-700 bg-transparent sm:bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white sm:text-slate-800 dark:text-white flex items-center gap-2">
              <Users className="h-6 w-6 text-orange-500" />
              Driver Registry
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{drivers.length} drivers registered</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => { setEditDriver(null); setModalOpen(true); }}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-sm font-bold rounded-xl shadow-md transition-all hover:-translate-y-0.5"
            >
              <Plus className="h-4 w-4" /> Add Driver
            </button>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white/5 sm:bg-white dark:bg-slate-800 rounded-xl p-3 border border-white/10 sm:border-slate-200 dark:border-slate-700 text-center">
            <p className="text-2xl font-black text-orange-400">{drivers.length}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">Total</p>
          </div>
          <div className="bg-white/5 sm:bg-white dark:bg-slate-800 rounded-xl p-3 border border-white/10 sm:border-slate-200 dark:border-slate-700 text-center">
            <p className="text-2xl font-black text-emerald-400">{withTruck}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">Assigned</p>
          </div>
          <div className="bg-white/5 sm:bg-white dark:bg-slate-800 rounded-xl p-3 border border-white/10 sm:border-slate-200 dark:border-slate-700 text-center">
            <p className="text-2xl font-black text-red-400">{noDriver}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">No Driver</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search driver name, plate, phone..."
            value={search}
            onChange={e => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 sm:bg-white dark:bg-slate-900 border border-white/10 sm:border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-orange-500 text-sm outline-none text-white sm:text-slate-900 dark:text-white placeholder-slate-500"
          />
        </div>
      </div>

      {/* ═══ MOBILE CARD VIEW ═══ */}
      <div className="block sm:hidden divide-y divide-white/5">
        {loading ? (
          <div className="p-8 text-center text-slate-500">
            <Loader className="h-6 w-6 animate-spin text-orange-500 mx-auto mb-2" />
            Loading drivers...
          </div>
        ) : paginated.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No drivers found.</div>
        ) : (
          paginated.map((driver, idx) => {
            const truckInfo = getTruckInfo(driver.plate_no);
            return (
              <div key={driver.id} className="p-4 hover:bg-white/3 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  {/* Row number + Name */}
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-black flex items-center justify-center shrink-0">
                      {(page - 1) * itemsPerPage + idx + 1}
                    </span>
                    <span className="text-sm font-bold text-white">{driver.name || '—'}</span>
                  </div>
                  {/* Status badge */}
                  {truckInfo && (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(truckInfo.status)}`}>
                      {truckInfo.status || '?'}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1.5 ml-8">
                  {driver.plate_no && (
                    <div className="flex items-center gap-2">
                      <Truck className="h-3 w-3 text-slate-500 shrink-0" />
                      <span className="text-xs font-mono text-slate-300">{driver.plate_no}</span>
                      {driver.trailer_no && (
                        <span className="text-xs font-mono text-slate-500">/ {driver.trailer_no}</span>
                      )}
                      {truckInfo?.current_location && (
                        <span className="text-xs text-slate-500">@ {truckInfo.current_location}</span>
                      )}
                    </div>
                  )}
                  {driver.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-slate-500 shrink-0" />
                      <a href={`tel:${driver.phone.split('/')[0]}`} className="text-xs text-emerald-400 font-medium">
                        {driver.phone}
                      </a>
                    </div>
                  )}
                </div>
                {isAdmin && (
                  <div className="flex gap-2 mt-3 ml-8">
                    <button
                      onClick={() => { setEditDriver(driver); setModalOpen(true); }}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-lg hover:bg-blue-500/20 transition-colors"
                    >
                      <Edit2 className="h-3 w-3" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(driver.id, driver.name)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 text-red-400 text-xs font-bold rounded-lg hover:bg-red-500/20 transition-colors"
                    >
                      <Trash2 className="h-3 w-3" /> Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ═══ DESKTOP TABLE VIEW ═══ */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
              <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 w-10">#</th>
              <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">Driver Name</th>
              <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">Plate / Trailer</th>
              <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">Status / Location</th>
              <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">Phone</th>
              {isAdmin && <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
            {loading ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-500">
                  <Loader className="h-6 w-6 animate-spin text-orange-500 mx-auto mb-2" />
                  Loading drivers...
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-500">No drivers found.</td>
              </tr>
            ) : (
              paginated.map((driver, idx) => {
                const truckInfo = getTruckInfo(driver.plate_no);
                return (
                  <tr key={driver.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                    <td className="px-4 py-3 text-xs text-slate-400 font-medium">
                      {(page - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold text-xs shrink-0">
                          {(driver.name || '?').charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{driver.name || '—'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {driver.plate_no ? (
                        <div className="flex flex-col gap-0.5">
                          <span className="font-mono text-sm text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-lg w-fit">
                            {driver.plate_no}
                          </span>
                          {driver.trailer_no && (
                            <span className="font-mono text-xs text-slate-500 px-2">T: {driver.trailer_no}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-sm italic">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {truckInfo ? (
                        <div className="flex flex-col gap-0.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border w-fit ${getStatusColor(truckInfo.status)}`}>
                            {truckInfo.status || '—'}
                          </span>
                          {truckInfo.current_location && (
                            <span className="text-xs text-slate-500">@ {truckInfo.current_location}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">
                          {driver.plate_no ? 'Truck not found' : 'No truck assigned'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {driver.phone ? (
                        <div className="flex flex-col gap-0.5">
                          {driver.phone.split('/').map((p, i) => (
                            <a key={i} href={`tel:${p.trim()}`} className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline font-medium flex items-center gap-1">
                              <Phone className="h-3 w-3" /> {p.trim()}
                            </a>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-sm italic">—</span>
                      )}
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => { setEditDriver(driver); setModalOpen(true); }}
                            className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(driver.id, driver.name)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ═══ PAGINATION ═══ */}
      {!loading && filtered.length > itemsPerPage && (
        <div className="px-4 sm:px-6 py-4 border-t border-white/5 sm:border-slate-200 dark:border-slate-700 bg-transparent sm:bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
          <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Showing <span className="font-semibold text-white sm:text-slate-900 dark:text-slate-200">{(page - 1) * itemsPerPage + 1}</span>–
            <span className="font-semibold text-white sm:text-slate-900 dark:text-slate-200">{Math.min(page * itemsPerPage, filtered.length)}</span> of{' '}
            <span className="font-semibold text-white sm:text-slate-900 dark:text-slate-200">{filtered.length}</span>
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 border border-white/10 sm:border-slate-300 dark:border-slate-600 rounded-lg disabled:opacity-40 hover:bg-white/5 sm:hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft className="h-4 w-4 text-slate-400" />
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 border border-white/10 sm:border-slate-300 dark:border-slate-600 rounded-lg disabled:opacity-40 hover:bg-white/5 sm:hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </button>
          </div>
        </div>
      )}

      {/* ═══ MODAL ═══ */}
      <DriverModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        driver={editDriver}
        onSaved={fetchData}
      />
    </div>
  );
}
