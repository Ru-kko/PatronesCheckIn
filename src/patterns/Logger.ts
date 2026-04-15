// ============================================================
// PATRÓN: SINGLETON
// Garantiza que solo exista UNA instancia del logger en toda la app.
// No importa cuántas veces se importe, siempre es el mismo objeto.
// ============================================================

interface LogEntry {
  time: string;
  msg: string;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];

  constructor() {
    if (Logger.instance) return Logger.instance;
    Logger.instance = this;
  }

  log(msg: string): LogEntry {
    const entry: LogEntry = { time: new Date().toLocaleTimeString(), msg };
    this.logs.push(entry);
    return entry;
  }

  getLogs(): LogEntry[] {
    return this.logs;
  }

  clear(): void {
    this.logs = [];
  }
}

const logger = new Logger();
export default logger;