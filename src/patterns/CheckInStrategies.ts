// ============================================================
// PATRÓN: STRATEGY
// Define una familia de algoritmos (métodos de check-in),
// encapsula cada uno y los hace intercambiables.
// El componente solo llama a .execute() sin saber cuál está activo.
// ============================================================

import logger from "./Logger";

export interface CheckInStrategy {
  label: string;
  icon: string;
  execute: (passenger: string) => string;
}

const CheckInStrategies: Record<string, CheckInStrategy> = {
  online: {
    label: "Online",
    icon: "🌐",
    execute: (passenger: string) => {
      const msg = `[ONLINE] ${passenger} hizo check-in online. Asiento asignado automáticamente.`;
      logger.log(msg);
      return msg;
    },
  },
  kiosk: {
    label: "Kiosk",
    icon: "🖥️",
    execute: (passenger: string) => {
      const msg = `[KIOSK] ${passenger} usó el kiosk del aeropuerto. Tarjeta de embarque impresa.`;
      logger.log(msg);
      return msg;
    },
  },
  counter: {
    label: "Mostrador",
    icon: "🧑‍✈️",
    execute: (passenger: string) => {
      const msg = `[MOSTRADOR] ${passenger} hizo check-in en ventanilla con agente.`;
      logger.log(msg);
      return msg;
    },
  },
};

export default CheckInStrategies;