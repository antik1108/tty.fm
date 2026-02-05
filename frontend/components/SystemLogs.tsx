import React from 'react';
import { SystemLog } from '../types';
import { LOG_LEVEL_COLORS } from '../constants';

interface SystemLogsProps {
  logs: SystemLog[];
}

const SystemLogs: React.FC<SystemLogsProps> = ({ logs }) => {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="bg-terminal-border/40 px-4 py-2 flex justify-between items-center text-[10px] uppercase font-bold text-neon-purple border-b-2 border-terminal-border crt-glow-purple">
        <span>System Event Log</span>
        <span className="text-[9px] text-matrix-green animate-blink">RUNNING_DAEMON</span>
      </div>
      <div className="flex-1 p-4 text-[11px] font-mono leading-relaxed overflow-y-auto custom-scrollbar bg-black/80">
        <div className="space-y-1">
          {logs.map((log) => (
            <div key={log.id} className="flex gap-4">
              <span className="text-gray-600 shrink-0">[{log.timestamp}]</span>
              <span className={`${LOG_LEVEL_COLORS[log.level]} break-words`}>
                [{log.level}] {log.message}
              </span>
            </div>
          ))}
          {logs.length === 0 && <div className="text-gray-600 italic">INITIALIZING_LOG_STREAM...</div>}
        </div>
      </div>
    </div>
  );
};

export default SystemLogs;
