
const os = require('os');

const SystemModule = {
    getStats() {
        const freeMem = os.freemem();
        const totalMem = os.totalmem();
        const usedMem = totalMem - freeMem;
        const memUsageMB = Math.round(usedMem / 1024 / 1024);

        // Mocking CPU usage slightly since node doesn't give instant load easily without calc
        const load = os.loadavg()[0];
        const cpuPercent = Math.min(100, Math.round(load * 10) + Math.floor(Math.random() * 5));

        const uptime = process.uptime();
        const uptimeString = new Date(uptime * 1000).toISOString().substr(11, 8);
        const time = new Date().toLocaleTimeString('en-GB', { hour12: false });

        return {
            cpu: cpuPercent,
            mem: `${memUsageMB}MB`,
            time: time,
            uptime: uptimeString,
            platform: os.platform(),
            arch: os.arch()
        };
    }
};

module.exports = SystemModule;
