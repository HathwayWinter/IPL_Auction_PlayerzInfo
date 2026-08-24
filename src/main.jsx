import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity, ArrowDownUp, BarChart3, Check, ChevronRight, CircleAlert, Database,
  Filter, IndianRupee, LayoutDashboard, ListFilter, Plus, Search, ShieldCheck,
  SlidersHorizontal, Sparkles, Ticket, Trophy, Users, X
} from 'lucide-react';
import './styles.css';

const STORAGE_KEY = 'playerzinfo-pilot-v1';
const AUCTION_NAME = 'IPL 2026 Mega Auction';

const seedData = {
  auction: { name: AUCTION_NAME, status: 'open', purse: 120, season: 2026 },
  teams: [
    { id: 'mi', name: 'Mumbai Indians', shortCode: 'MI', color: '#1b75bb' },
    { id: 'csk', name: 'Chennai Super Kings', shortCode: 'CSK', color: '#f3b61f' },
    { id: 'rcb', name: 'Royal Challengers Bengaluru', shortCode: 'RCB', color: '#d94148' },
    { id: 'rr', name: 'Rajasthan Royals', shortCode: 'RR', color: '#e15aa0' }
  ],
  players: [
    { id: 'p1', name: 'Jasprit Bumrah', role: 'Bowler', nationality: 'India', basePrice: 2, status: 'sold', soldAmount: 18, teamId: 'mi', matches: 133, rating: 94, initials: 'JB' },
    { id: 'p2', name: 'Ruturaj Gaikwad', role: 'Batter', nationality: 'India', basePrice: 2, status: 'sold', soldAmount: 14, teamId: 'csk', matches: 66, rating: 89, initials: 'RG' },
    { id: 'p3', name: 'Rishabh Pant', role: 'Wicketkeeper', nationality: 'India', basePrice: 2, status: 'sold', soldAmount: 16, teamId: 'rcb', matches: 111, rating: 91, initials: 'RP' },
    { id: 'p4', name: 'Yashasvi Jaiswal', role: 'Batter', nationality: 'India', basePrice: 2, status: 'available', soldAmount: null, teamId: null, matches: 52, rating: 88, initials: 'YJ' },
    { id: 'p5', name: 'Trent Boult', role: 'Bowler', nationality: 'New Zealand', basePrice: 2, status: 'unsold', soldAmount: null, teamId: null, matches: 103, rating: 84, initials: 'TB' },
    { id: 'p6', name: 'Nicholas Pooran', role: 'Wicketkeeper', nationality: 'West Indies', basePrice: 1.5, status: 'sold', soldAmount: 11, teamId: 'rr', matches: 76, rating: 86, initials: 'NP' },
    { id: 'p7', name: 'Shubman Gill', role: 'Batter', nationality: 'India', basePrice: 2, status: 'available', soldAmount: null, teamId: null, matches: 103, rating: 90, initials: 'SG' },
    { id: 'p8', name: 'Glenn Maxwell', role: 'All-rounder', nationality: 'Australia', basePrice: 2, status: 'unsold', soldAmount: null, teamId: null, matches: 126, rating: 81, initials: 'GM' }
  ]
};

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : seedData;
  } catch { return seedData; }
}

const money = value => value == null ? '—' : `₹${Number(value).toFixed(value % 1 ? 1 : 0)} Cr`;
const statusLabel = status => status === 'available' ? 'Available for Bid' : status[0].toUpperCase() + status.slice(1);

function App() {
  const [data, setData] = useState(loadData);
  const [activePage, setActivePage] = useState('dashboard');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sort, setSort] = useState('rating');
  const [toast, setToast] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }, [data]);
  useEffect(() => { if (toast) { const timer = setTimeout(() => setToast(null), 3500); return () => clearTimeout(timer); } }, [toast]);

  const totals = useMemo(() => {
    const sold = data.players.filter(p => p.status === 'sold');
    return {
      total: data.players.length,
      sold: sold.length,
      unsold: data.players.filter(p => p.status === 'unsold').length,
      available: data.players.filter(p => p.status === 'available').length,
      spend: sold.reduce((sum, p) => sum + (p.soldAmount || 0), 0),
      top: [...sold].sort((a, b) => b.soldAmount - a.soldAmount)[0]
    };
  }, [data.players]);

  const filteredPlayers = useMemo(() => data.players
    .filter(p => statusFilter === 'all' || p.status === statusFilter)
    .filter(p => roleFilter === 'all' || p.role === roleFilter)
    .filter(p => `${p.name} ${p.nationality} ${p.role}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => sort === 'name' ? a.name.localeCompare(b.name) : sort === 'price' ? (b.soldAmount || 0) - (a.soldAmount || 0) : b.rating - a.rating),
  [data.players, query, statusFilter, roleFilter, sort]);

  const teamStats = data.teams.map(team => {
    const players = data.players.filter(p => p.teamId === team.id && p.status === 'sold');
    return { ...team, players, spent: players.reduce((sum, p) => sum + (p.soldAmount || 0), 0) };
  });

  function notify(type, message) { setToast({ type, message }); }

  function updatePlayer(id, patch) {
    setData(current => ({ ...current, players: current.players.map(p => p.id === id ? { ...p, ...patch } : p) }));
  }

  function handleStatusChange(player, nextStatus) {
    if (data.auction.status !== 'open') { notify('error', 'This auction is closed. Reopen it before making changes.'); return; }
    if (nextStatus === 'sold') { setSelectedPlayer(player); return; }
    updatePlayer(player.id, { status: nextStatus, soldAmount: null, teamId: null });
    notify('success', `${player.name} marked ${statusLabel(nextStatus).toLowerCase()}.`);
  }

  function finalizeSale(player, teamId, amount) {
    const numericAmount = Number(amount);
    const team = data.teams.find(t => t.id === teamId);
    const spent = data.players.filter(p => p.teamId === teamId && p.status === 'sold').reduce((sum, p) => sum + (p.soldAmount || 0), 0);
    if (!teamId || !numericAmount || numericAmount < player.basePrice) { notify('error', `Enter a winning team and an amount of at least ${money(player.basePrice)}.`); return false; }
    if (spent + numericAmount > data.auction.purse) { notify('error', `${team.name} would exceed the ₹${data.auction.purse} Cr purse.`); return false; }
    updatePlayer(player.id, { status: 'sold', soldAmount: numericAmount, teamId });
    setSelectedPlayer(null);
    notify('success', `${player.name} sold to ${team.shortCode} for ${money(numericAmount)}.`);
    return true;
  }

  function addPlayer(form) {
    const name = form.name.trim();
    if (name.length < 3) { notify('error', 'Player name must contain at least 3 characters.'); return false; }
    if (data.players.some(p => p.name.toLowerCase() === name.toLowerCase())) { notify('error', 'This player already exists in the auction pool.'); return false; }
    const initials = name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase();
    setData(current => ({ ...current, players: [...current.players, { id: `p-${Date.now()}`, name, role: form.role, nationality: form.nationality, basePrice: Number(form.basePrice), status: 'available', soldAmount: null, teamId: null, matches: 0, rating: 70, initials }] }));
    setShowAdd(false); notify('success', `${name} added to the auction pool.`); return true;
  }

  function resetDemo() { setData(seedData); notify('success', 'Demo data restored to its starting state.'); }

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><Ticket size={19} /></div><div><strong>PlayerzInfo</strong><span>IPL auction desk</span></div></div>
      <div className="season-chip"><span className="live-dot" /> LIVE AUCTION <b>{data.auction.season}</b></div>
      <nav>
        <p className="nav-label">Workspace</p>
        <NavItem icon={<LayoutDashboard size={17} />} label="Overview" active={activePage === 'dashboard'} onClick={() => setActivePage('dashboard')} />
        <NavItem icon={<Users size={17} />} label="Player pool" active={activePage === 'players'} onClick={() => setActivePage('players')} count={data.players.length} />
        <NavItem icon={<Activity size={17} />} label="Auction desk" active={activePage === 'auction'} onClick={() => setActivePage('auction')} count={totals.available} />
        <NavItem icon={<Trophy size={17} />} label="Teams & purse" active={activePage === 'teams'} onClick={() => setActivePage('teams')} />
        <p className="nav-label nav-label-spaced">System</p>
        <NavItem icon={<ShieldCheck size={17} />} label="Admin access" active={false} onClick={() => notify('success', 'Pilot admin session is active.')} />
      </nav>
      <div className="sidebar-footer"><div className="avatar">AK</div><div><strong>Admin Kumar</strong><span>Demo administrator</span></div><span className="online" /></div>
    </aside>
    <main className="main-content">
      <header className="topbar"><div className="breadcrumbs"><span>IPL_Auction_PlayerzInfo</span><ChevronRight size={14} /><b>{activePage === 'dashboard' ? 'Overview' : activePage === 'players' ? 'Player pool' : activePage === 'auction' ? 'Auction desk' : 'Teams & purse'}</b></div><div className="top-actions"><span className="saved"><Database size={14} /> Saved locally</span><button className="icon-button" title="Reset demo data" onClick={resetDemo}><ArrowDownUp size={17} /></button><button className="profile-button"><span className="avatar small">AK</span><span>Admin</span></button></div></header>
      {activePage === 'dashboard' && <Dashboard totals={totals} data={data} teamStats={teamStats} onNavigate={setActivePage} onAdd={() => setShowAdd(true)} />}
      {activePage === 'players' && <PlayersPage players={filteredPlayers} query={query} setQuery={setQuery} statusFilter={statusFilter} setStatusFilter={setStatusFilter} roleFilter={roleFilter} setRoleFilter={setRoleFilter} sort={sort} setSort={setSort} onStatus={handleStatusChange} onSelect={setSelectedPlayer} onAdd={() => setShowAdd(true)} />}
      {activePage === 'auction' && <AuctionDesk players={data.players} totals={totals} onStatus={handleStatusChange} onSelect={setSelectedPlayer} />}
      {activePage === 'teams' && <TeamsPage teamStats={teamStats} purse={data.auction.purse} onSelect={setSelectedPlayer} />}
    </main>
    {showAdd && <AddPlayerModal onClose={() => setShowAdd(false)} onSubmit={addPlayer} />}
    {selectedPlayer && <SaleModal player={selectedPlayer} teams={teamStats} onClose={() => setSelectedPlayer(null)} onSubmit={finalizeSale} />}
    {toast && <div className={`toast ${toast.type}`}><span className="toast-icon">{toast.type === 'success' ? <Check size={17} /> : <CircleAlert size={17} />}</span>{toast.message}</div>}
  </div>;
}

function NavItem({ icon, label, active, onClick, count }) { return <button className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>{icon}<span>{label}</span>{count != null && <em>{count}</em>}</button>; }

function Dashboard({ totals, data, teamStats, onNavigate, onAdd }) {
  return <div className="page-wrap"><div className="page-heading"><div><p className="eyebrow"><span className="live-dot" /> 2026 MEGA AUCTION / LIVE BOARD</p><h1>Good morning, Admin.</h1><p className="subheading">A clear view of every player, every bid, and every rupee.</p></div><button className="primary-button" onClick={onAdd}><Plus size={17} /> Add player</button></div>
    <section className="hero-strip"><div><span className="hero-kicker">CURRENT AUCTION</span><h2>{data.auction.name}</h2><p>Player pool is open for bidding. Updates are saved to your pilot database.</p></div><div className="hero-metric"><span>Available now</span><strong>{totals.available}</strong><small>players awaiting bids</small></div><div className="hero-metric"><span>Total purse tracked</span><strong>{money(totals.spend)}</strong><small>of ₹{data.auction.purse} Cr team capacity</small></div></section>
    <div className="stat-grid"><Stat icon={<Users />} label="Total players" value={totals.total} detail="in this auction pool" tone="blue" /><Stat icon={<Check />} label="Sold players" value={totals.sold} detail={`${Math.round(totals.sold / totals.total * 100)}% of pool finalized`} tone="green" /><Stat icon={<ListFilter />} label="Unsold players" value={totals.unsold} detail="can be reviewed later" tone="rose" /><Stat icon={<IndianRupee />} label="Total spend" value={money(totals.spend)} detail="across all teams" tone="gold" /></div>
    <div className="content-grid"><section className="panel recent-panel"><div className="panel-heading"><div><p className="eyebrow">LIVE FEED</p><h3>Recently finalized</h3></div><button className="text-button" onClick={() => onNavigate('players')}>View all <ChevronRight size={15} /></button></div><div className="feed-list">{data.players.filter(p => p.status === 'sold').slice(0, 4).map(player => <PlayerRow key={player.id} player={player} teams={data.teams} onClick={() => onNavigate('players')} />)}</div></section><section className="panel insight-panel"><div className="panel-heading"><div><p className="eyebrow">AUCTION INSIGHT</p><h3>Spend by team</h3></div><BarChart3 size={20} className="muted-icon" /></div><div className="spend-chart">{teamStats.map(team => <div className="spend-row" key={team.id}><div className="spend-label"><span className="team-dot" style={{ background: team.color }} /> <b>{team.shortCode}</b><span>{money(team.spent)}</span></div><div className="bar-track"><div className="bar-fill" style={{ width: `${Math.min(team.spent / data.auction.purse * 100, 100)}%`, background: team.color }} /></div></div>)}</div><div className="chart-note"><Sparkles size={15} /> {totals.top?.name} leads the board at {money(totals.top?.soldAmount)}.</div></section></div>
  </div>;
}

function Stat({ icon, label, value, detail, tone }) { return <div className={`stat-card ${tone}`}><div className="stat-icon">{icon}</div><span>{label}</span><strong>{value}</strong><small>{detail}</small></div>; }
function PlayerRow({ player, teams, onClick }) { const team = teams.find(t => t.id === player.teamId); return <button className="player-row" onClick={onClick}><div className="player-avatar">{player.initials}</div><div className="player-row-main"><strong>{player.name}</strong><span>{player.role} · {player.nationality}</span></div><div className="player-team">{team && <><span className="team-dot" style={{ background: team.color }} />{team.shortCode}</>}</div><b className="row-price">{money(player.soldAmount)}</b><ChevronRight size={16} className="row-chevron" /></button>; }

function PlayersPage({ players, query, setQuery, statusFilter, setStatusFilter, roleFilter, setRoleFilter, sort, setSort, onStatus, onSelect, onAdd }) {
  return <div className="page-wrap"><div className="page-heading compact"><div><p className="eyebrow">AUCTION ROSTER</p><h1>Player pool</h1><p className="subheading">Search and manage every player in the {AUCTION_NAME}.</p></div><button className="primary-button" onClick={onAdd}><Plus size={17} /> Add player</button></div><section className="panel table-panel"><div className="toolbar"><div className="search-box"><Search size={17} /><input placeholder="Search name, role or nationality" value={query} onChange={e => setQuery(e.target.value)} /></div><div className="filter-group"><select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}><option value="all">All statuses</option><option value="available">Available for Bid</option><option value="sold">Sold</option><option value="unsold">Unsold</option></select><select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}><option value="all">All roles</option><option>Batter</option><option>Bowler</option><option>All-rounder</option><option>Wicketkeeper</option></select><select value={sort} onChange={e => setSort(e.target.value)}><option value="rating">Sort: rating</option><option value="name">Sort: name</option><option value="price">Sort: price</option></select><SlidersHorizontal size={18} className="muted-icon" /></div></div><div className="table-meta"><span><b>{players.length}</b> players shown</span><span><Filter size={14} /> Filters update instantly</span></div><div className="player-table"><div className="table-head"><span>PLAYER</span><span>ROLE / COUNTRY</span><span>BASE PRICE</span><span>STATUS</span><span>FINAL PRICE</span><span>ACTION</span></div>{players.length ? players.map(player => <PlayerTableRow key={player.id} player={player} onStatus={onStatus} onSelect={onSelect} />) : <div className="empty-state"><Search size={24} /><b>No players match these filters</b><span>Try clearing a filter or searching another name.</span></div>}</div></section></div>;
}
function PlayerTableRow({ player, onStatus, onSelect }) { return <div className="table-row"><div className="player-cell" onClick={() => onSelect(player)}><div className="player-avatar">{player.initials}</div><div><strong>{player.name}</strong><span>{player.matches} IPL matches · rating {player.rating}</span></div></div><div className="role-cell"><b>{player.role}</b><span>{player.nationality}</span></div><span className="base-price">{money(player.basePrice)}</span><div><span className={`status-pill ${player.status}`}>{statusLabel(player.status)}</span></div><b className="final-price">{money(player.soldAmount)}</b><div className="row-actions">{player.status === 'available' ? <button className="bid-button" onClick={() => onStatus(player, 'sold')}>Open sale</button> : <button className="more-button" onClick={() => onSelect(player)}>View</button>}<select className="status-select" aria-label={`Update status for ${player.name}`} value={player.status} onChange={e => onStatus(player, e.target.value)}><option value="available">Available</option><option value="sold">Sold</option><option value="unsold">Unsold</option></select></div></div>; }

function AuctionDesk({ players, totals, onStatus, onSelect }) { const available = players.filter(p => p.status === 'available'); return <div className="page-wrap"><div className="page-heading compact"><div><p className="eyebrow"><span className="live-dot" /> LIVE AUCTION DESK</p><h1>Ready for the next bid?</h1><p className="subheading">Finalize sales with base-price and purse validation built in.</p></div><div className="desk-status"><span className="live-dot" /> Auction open</div></div><div className="auction-layout"><section className="panel auction-queue"><div className="panel-heading"><div><p className="eyebrow">UP NEXT</p><h3>Available for bid</h3></div><span className="queue-count">{available.length} queued</span></div>{available.length ? available.map(player => <div className="queue-item" key={player.id}><div className="player-avatar large">{player.initials}</div><div className="queue-info"><strong>{player.name}</strong><span>{player.role} · {player.nationality}</span><small>Base price <b>{money(player.basePrice)}</b></small></div><button className="primary-button small" onClick={() => onStatus(player, 'sold')}>Start sale <ChevronRight size={15} /></button></div>) : <div className="empty-state"><Check size={25} /><b>All players have been finalized</b><span>The auction pool is fully processed.</span></div>}</section><aside className="panel auction-summary"><p className="eyebrow">SESSION SUMMARY</p><div className="summary-number">{totals.sold}<span> / {totals.total}</span></div><p>players finalized</p><div className="progress"><span style={{ width: `${totals.sold / totals.total * 100}%` }} /></div><div className="summary-lines"><div><span>Available</span><b>{totals.available}</b></div><div><span>Unsold</span><b>{totals.unsold}</b></div><div><span>Spend committed</span><b>{money(totals.spend)}</b></div></div><div className="rule-note"><ShieldCheck size={16} /><span>Every sale must meet the base price and team purse limit.</span></div></aside></div></div>; }

function TeamsPage({ teamStats, purse, onSelect }) { return <div className="page-wrap"><div className="page-heading compact"><div><p className="eyebrow">TEAM MANAGEMENT</p><h1>Teams & purse</h1><p className="subheading">Track spending, squad count, and every purchase at a glance.</p></div><div className="purse-badge"><IndianRupee size={16} /> Purse limit <b>₹{purse} Cr / team</b></div></div><div className="team-grid">{teamStats.map(team => <section className="panel team-card" key={team.id}><div className="team-card-top"><div className="team-crest" style={{ background: team.color }}>{team.shortCode}</div><div><h3>{team.name}</h3><span>{team.players.length} players purchased</span></div><span className="team-spend">{money(team.spent)}</span></div><div className="team-progress"><div><span>Purse used</span><b>{Math.round(team.spent / purse * 100)}%</b></div><div className="bar-track"><div className="bar-fill" style={{ width: `${team.spent / purse * 100}%`, background: team.color }} /></div></div><div className="team-roster">{team.players.length ? team.players.map(player => <button key={player.id} onClick={() => onSelect(player)}><span>{player.initials}</span><b>{player.name}</b><strong>{money(player.soldAmount)}</strong></button>) : <p>No purchases yet</p>}</div></section>)}</div></div>; }

function Modal({ title, subtitle, children, onClose }) { return <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}><div className="modal"><div className="modal-heading"><div><h2>{title}</h2><p>{subtitle}</p></div><button className="icon-button" onClick={onClose} aria-label="Close"><X size={18} /></button></div>{children}</div></div>; }
function SaleModal({ player, teams, onClose, onSubmit }) { const [teamId, setTeamId] = useState(''); const [amount, setAmount] = useState(player.basePrice); return <Modal title={`Finalize ${player.name}`} subtitle="Record the winning team and final sold amount." onClose={onClose}><form onSubmit={e => { e.preventDefault(); onSubmit(player, teamId, amount); }}><label>Winning team<select value={teamId} onChange={e => setTeamId(e.target.value)} required><option value="">Select a team</option>{teams.map(team => <option key={team.id} value={team.id}>{team.name} · {money(team.spent)} spent</option>)}</select></label><label>Final sold amount<div className="input-prefix"><span>₹</span><input type="number" step="0.5" value={amount} onChange={e => setAmount(e.target.value)} required /><em>Cr</em></div><small>Minimum accepted: {money(player.basePrice)}. Team purse limits are checked automatically.</small></label><div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button type="submit" className="primary-button"><Check size={16} /> Confirm sale</button></div></form></Modal>; }
function AddPlayerModal({ onClose, onSubmit }) { const [form, setForm] = useState({ name: '', role: 'Batter', nationality: 'India', basePrice: '2' }); const update = e => setForm({ ...form, [e.target.name]: e.target.value }); return <Modal title="Add player to pool" subtitle="New players start as Available for Bid." onClose={onClose}><form onSubmit={e => { e.preventDefault(); onSubmit(form); }}><label>Player name<input name="name" value={form.name} onChange={update} placeholder="e.g. Devdutt Padikkal" required minLength="3" /></label><div className="form-two"><label>Role<select name="role" value={form.role} onChange={update}><option>Batter</option><option>Bowler</option><option>All-rounder</option><option>Wicketkeeper</option></select></label><label>Nationality<input name="nationality" value={form.nationality} onChange={update} required /></label></div><label>Base price<div className="input-prefix"><span>₹</span><input name="basePrice" type="number" min="0" step="0.5" value={form.basePrice} onChange={update} required /><em>Cr</em></div></label><div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button type="submit" className="primary-button"><Plus size={16} /> Add to pool</button></div></form></Modal>; }

createRoot(document.getElementById('root')).render(<App />);
