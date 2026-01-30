
import React from 'react';
import { SystemStats } from '../types';

interface Props {
  stats: SystemStats;
}

const TerminalHeader: React.FC<Props> = ({ stats }) => {
  return (
    <div className="flex justify-between items-center mb-1 text-sm border-b border-[#9046FF] pb-1 px-2">
      <div className="flex gap-1">
        <span className="text-white">user@musicbox</span>:
        <span className="text-[#9046FF]">~/library</span>
        <span className="text-white ml-1">$ ls -all <span className="cursor-blink">_</span></span>
      </div>
      <div className="flex gap-4">
        <span>[CPU: {stats.cpu}%]</span>
        <span>[MEM: {stats.mem}]</span>
        <span className="text-white font-bold">{stats.time}</span>
      </div>
    </div>
  );
};

export default TerminalHeader;
