// ============================================================
// PATRÓN: STATE
// Modela el estado del vuelo como objetos separados.
// Cada estado sabe cómo manejar los eventos delay/onTime
// y cómo cambiar el estado del vuelo.
// ============================================================

import logger from "./Logger";

export interface FlightInterface {
  flightNumber: string;
  setState(state: FlightState): void;
  getStatus(): string;
  notify(event: any): void;
}

export abstract class FlightState {
  protected label: string;

  constructor(label: string) {
    this.label = label;
  }

  abstract delay(flight: FlightInterface, minutes: number): void;
  abstract onTime(flight: FlightInterface): void;
  abstract startBoarding(flight: FlightInterface): void;
  abstract cancel(flight: FlightInterface): void;

  getStatus(): string {
    return this.label;
  }
}

export class OnTimeState extends FlightState {
  constructor() {
    super("A tiempo");
  }

  delay(flight: FlightInterface, minutes: number): void {
    flight.setState(new DelayedState(minutes));
    const event = { type: "DELAY", minutes, status: flight.getStatus() };
    logger.log(`[VUELO ${flight.flightNumber}] Estado: ${flight.getStatus()}`);
    flight.notify(event);
  }

  onTime(flight: FlightInterface): void {
    logger.log(`[VUELO ${flight.flightNumber}] El vuelo ya estaba a tiempo.`);
  }

  startBoarding(flight: FlightInterface): void {
    flight.setState(new BoardingState());
    const event = { type: "BOARDING", status: flight.getStatus() };
    logger.log(`[VUELO ${flight.flightNumber}] Estado: ${flight.getStatus()}`);
    flight.notify(event);
  }

  cancel(flight: FlightInterface): void {
    flight.setState(new CancelledState());
    const event = { type: "CANCELLED", status: flight.getStatus() };
    logger.log(`[VUELO ${flight.flightNumber}] Estado: ${flight.getStatus()}`);
    flight.notify(event);
  }
}

export class DelayedState extends FlightState {
  private minutes: number;

  constructor(minutes: number) {
    super(`Retrasado ${minutes} min`);
    this.minutes = minutes;
  }

  delay(flight: FlightInterface, minutes: number): void {
    flight.setState(new DelayedState(minutes));
    const event = { type: "DELAY", minutes, status: flight.getStatus() };
    logger.log(`[VUELO ${flight.flightNumber}] Nuevo estado: ${flight.getStatus()}`);
    flight.notify(event);
  }

  onTime(flight: FlightInterface): void {
    flight.setState(new OnTimeState());
    const event = { type: "ON_TIME", status: flight.getStatus() };
    logger.log(`[VUELO ${flight.flightNumber}] Vuelo normalizado.`);
    flight.notify(event);
  }

  startBoarding(flight: FlightInterface): void {
    flight.setState(new BoardingState());
    const event = { type: "BOARDING", status: flight.getStatus() };
    logger.log(`[VUELO ${flight.flightNumber}] Estado: ${flight.getStatus()}`);
    flight.notify(event);
  }

  cancel(flight: FlightInterface): void {
    flight.setState(new CancelledState());
    const event = { type: "CANCELLED", status: flight.getStatus() };
    logger.log(`[VUELO ${flight.flightNumber}] Estado: ${flight.getStatus()}`);
    flight.notify(event);
  }
}

export class BoardingState extends FlightState {
  constructor() {
    super("Embarcando");
  }

  delay(flight: FlightInterface, minutes: number): void {
    flight.setState(new DelayedState(minutes));
    const event = { type: "DELAY", minutes, status: flight.getStatus() };
    logger.log(`[VUELO ${flight.flightNumber}] Estado: ${flight.getStatus()}`);
    flight.notify(event);
  }

  onTime(flight: FlightInterface): void {
    flight.setState(new OnTimeState());
    const event = { type: "ON_TIME", status: flight.getStatus() };
    logger.log(`[VUELO ${flight.flightNumber}] Vuelo normalizado.`);
    flight.notify(event);
  }

  startBoarding(flight: FlightInterface): void {
    logger.log(`[VUELO ${flight.flightNumber}] El vuelo ya está embarcando.`);
  }

  cancel(flight: FlightInterface): void {
    flight.setState(new CancelledState());
    const event = { type: "CANCELLED", status: flight.getStatus() };
    logger.log(`[VUELO ${flight.flightNumber}] Estado: ${flight.getStatus()}`);
    flight.notify(event);
  }
}

export class CancelledState extends FlightState {
  constructor() {
    super("Cancelado");
  }

  delay(flight: FlightInterface, minutes: number): void {
    logger.log(`[VUELO ${flight.flightNumber}] Vuelo cancelado, no se puede retrasar.`);
  }

  onTime(flight: FlightInterface): void {
    flight.setState(new OnTimeState());
    const event = { type: "ON_TIME", status: flight.getStatus() };
    logger.log(`[VUELO ${flight.flightNumber}] Vuelo reactivado.`);
    flight.notify(event);
  }

  startBoarding(flight: FlightInterface): void {
    logger.log(`[VUELO ${flight.flightNumber}] No se puede embarcar un vuelo cancelado.`);
  }

  cancel(flight: FlightInterface): void {
    logger.log(`[VUELO ${flight.flightNumber}] El vuelo ya está cancelado.`);
  }
}

