// ============================================================
// PATRÓN: FACTORY
// Centraliza la creación de objetos Passenger.
// En lugar de crear { name, checkedIn, notification } manualmente
// en varios lugares, toda la lógica de construcción vive aquí.
//
// Ventaja: si el objeto Passenger cambia (nuevos campos, validaciones),
// solo se modifica este archivo.
//
// Tipos soportados: "regular", "vip", "tripulacion"
// ============================================================

import logger from "./Logger";

export interface Passenger {
  name: string;
  type: string;
  checkedIn: boolean;
  notification: string | null;
  createdAt: string;
  label: string;
  badge: string;
  priority: number;
}

type PassengerType = "regular" | "vip" | "tripulacion";

const PassengerFactory = {
  create(name: string, type: PassengerType = "regular"): Passenger {
    const base = {
      name,
      type,
      checkedIn: false,
      notification: null,
      createdAt: new Date().toLocaleTimeString(),
    };

    const configs: Record<PassengerType, Omit<Passenger, keyof typeof base>> = {
      regular: {
        label: "Pasajero",
        badge: "🧑",
        priority: 3,
      },
      vip: {
        label: "VIP",
        badge: "⭐",
        priority: 1,
      },
      tripulacion: {
        label: "Tripulación",
        badge: "🧑‍✈️",
        priority: 2,
      },
    };

    const config = configs[type] ?? configs.regular;
    const passenger: Passenger = { ...base, ...config };

    logger.log(`[FACTORY] Pasajero creado: ${name} (${config.label})`);
    return passenger;
  },
};

export default PassengerFactory;