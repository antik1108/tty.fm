
import React from 'react';
import { ViewMode, Playlist } from '../types';

interface Props {
  currentView: ViewMode;
  setView: (v: ViewMode) => void;
  playlists: Playlist[];
}

const Sidebar: React.FC<Props> = ({ currentView, setView, playlists }) => {
  const NavItem = ({ mode, label }: { mode: ViewMode, label: string }) => (
    <button
      onClick={() => setView(mode)}
      className={`text-left px-2 py-1 transition-all flex items-center gap-2 ${currentView === mode
          ? 'bg-[#9046FF] text-black font-bold'
          : 'hover:text-white'
        }`}
    >
      <span>[{currentView === mode ? '>' : ' '}]</span>
      {label}
    </button>
  );

  return (
    <aside className="w-64 flex flex-col border-r border-[#9046FF] pr-2 shrink-0">

      <div className="mb-4">
        <div className="text-white mb-2 text-xs font-bold">┌─ NAVIGATION ──┐</div>
        <nav className="flex flex-col gap-1">
          <NavItem mode={ViewMode.HOME} label="HOME" />
          <NavItem mode={ViewMode.BROWSE} label="BROWSE" />
          <NavItem mode={ViewMode.LIBRARY} label="LIBRARY" />
          <NavItem mode={ViewMode.FAVORITES} label="FAVORITES" />
          <NavItem mode={ViewMode.UPLOAD} label="UPLOAD_FILE" />
        </nav>
      </div>


      <div className="flex-1 overflow-y-auto">
        <div className="text-white mb-2 text-xs font-bold">┌─ PLAYLISTS ──┐</div>
        <div className="flex flex-col gap-1 px-2 text-sm">
          {playlists.map(p => (
            <button key={p.id} className="text-left hover:text-white transition-colors block">
              &gt;&gt; {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-[#4b2485]">
        <button className="w-full border border-[#9046FF] py-1 hover:bg-[#9046FF] hover:text-black transition-all">
          [+] NEW_PLAYLIST
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
