// ============================================================
// PATRÓN: OBSERVER + STATE
// FlightSubject es el "sujeto" que mantiene una lista de observadores
// (pasajeros) y los notifica automáticamente cuando cambia de estado.
// El estado del vuelo se modela con objetos separados para cada situación.
// ============================================================

import logger from "./Logger";
import { FlightState, OnTimeState, FlightInterface } from "./FlightStates";

interface Observer {
  name: string;
  update: (event: any) => void;
}

class FlightSubject implements FlightInterface {
  flightNumber: string;
  private observers: Observer[] = [];
  private state: FlightState;
  status: string;

  constructor(flightNumber: string) {
    this.flightNumber = flightNumber;
    this.state = new OnTimeState();
    this.status = this.state.getStatus();
  }

  setState(state: FlightState): void {
    this.state = state;
    this.status = state.getStatus();
  }

  getStatus(): string {
    return this.status;
  }

  subscribe(observer: Observer): void {
    this.observers.push(observer);
  }

  unsubscribe(name: string): void {
    this.observers = this.observers.filter((o) => o.name !== name);
  }

  notify(event: any): void {
    this.observers.forEach((o) => o.update(event));
  }

  delay(minutes: number): void {
    this.state.delay(this, minutes);
  }

  onTime(): void {
    this.state.onTime(this);
  }

  startBoarding(): void {
    this.state.startBoarding(this);
  }

  cancel(): void {
    this.state.cancel(this);
  }
}

export default FlightSubject;