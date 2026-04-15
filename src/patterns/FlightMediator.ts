// ============================================================
// PATRÓN: MEDIATOR
// Centraliza toda la comunicación entre módulos del sistema.
// Ningún módulo se llama directamente entre sí — todo pasa
// por el mediador, que decide qué hacer con cada evento.
//
// Sin mediador:  App.jsx → llama a flight, logger, strategies directamente
// Con mediador:  App.jsx → le dice al mediador qué ocurrió
//                Mediador → coordina flight, logger, strategies
//
// Eventos soportados:
//   "CHECK_IN"   → { passengerName, strategy }
//   "DELAY"      → { minutes }
//   "ON_TIME"    → {}
//   "ADD_PASSENGER" → { name, type }
//   "BOARDING"   → {}
//   "CANCEL"     → {}
// ============================================================

import logger from "./Logger";
import CheckInStrategies from "./CheckInStrategies";
import checkInChain from "./CheckInChain";
import { Passenger } from "./PassengerFactory";
import FlightSubject from "./FlightSubject";

interface MediatorCallbacks {
  onPassengersChange?: (updater: (prev: Passenger[]) => Passenger[]) => void;
  onCheckInResult?: (msg: string) => void;
  onStatusChange?: (status: string) => void;
}

class FlightMediator {
  private flight: FlightSubject;
  private onPassengersChange?: (updater: (prev: Passenger[]) => Passenger[]) => void;
  private onCheckInResult?: (msg: string) => void;
  private onStatusChange?: (status: string) => void;

  constructor(flight: FlightSubject) {
    this.flight = flight;
  }

  // Registrar callbacks desde el componente React
  register({ onPassengersChange, onCheckInResult, onStatusChange }: MediatorCallbacks): void {
    this.onPassengersChange = onPassengersChange;
    this.onCheckInResult = onCheckInResult;
    this.onStatusChange = onStatusChange;
  }

  // Punto único de entrada para todos los eventos del sistema
  notify(sender: string, event: string, payload: any = {}): void {
    logger.log(`[MEDIATOR] Evento recibido de "${sender}": ${event}`);

    switch (event) {
      case "CHECK_IN": {
        const { passengerName, strategy, passenger, flightStatus } = payload;
        const validation = checkInChain.validate(passenger, flightStatus);

        if (!validation.ok) {
          this.onCheckInResult?.(validation.message);
          break;
        }

        const result = CheckInStrategies[strategy].execute(passengerName);

        this.onPassengersChange?.((prev) =>
          prev.map((p) =>
            p.name === passengerName ? { ...p, checkedIn: true } : p
          )
        );
        this.onCheckInResult?.(result);
        break;
      }

      case "DELAY": {
        const { minutes } = payload;
        this.flight.delay(minutes);
        this.onStatusChange?.(this.flight.getStatus());
        break;
      }

      case "ON_TIME": {
        this.flight.onTime();
        this.onStatusChange?.(this.flight.getStatus());
        break;
      }

      case "ADD_PASSENGER": {
        const { passenger } = payload;
        this.onPassengersChange?.((prev) => [...prev, passenger]);
        break;
      }

      case "BOARDING": {
        this.flight.startBoarding();
        this.onStatusChange?.(this.flight.getStatus());
        break;
      }

      case "CANCEL": {
        this.flight.cancel();
        this.onStatusChange?.(this.flight.getStatus());
        break;
      }

      default:
        logger.log(`[MEDIATOR] Evento desconocido: ${event}`);
    }
  }
}

export default FlightMediator;