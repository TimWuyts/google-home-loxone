import { Observable } from 'rxjs/internal/Observable';

import { BrightnessHandler } from './brightness';
import { EndpointHealthHandler } from './endpoint-health';
import { OnOffHandler } from './on-off';
import { SceneHandler } from './scene';
import { TemperatureSettingHandler } from './temperature-setting';

/* tslint:disable no-empty-interface */
export interface Capability {
}

export interface CapabilityHandler<T extends Capability> {
  getCommands(): string[]

  getTrait(): string;

  getAttributes(component: T): any;

  getState(component: T): Observable<any>;

  handleCommands(component: T, command: string, params?: any): Observable<boolean>;
}

export class Handlers {
  private handlers: CapabilityHandler<any>[];
  private internalDict: { [key: string]: CapabilityHandler<any> } = {};

  constructor() {
    this.handlers = [
      OnOffHandler.INSTANCE,
      BrightnessHandler.INSTANCE,
      SceneHandler.INSTANCE,
      EndpointHealthHandler.INSTANCE,
      TemperatureSettingHandler.INSTANCE
    ];

    this.handlers.forEach(handler => {
      handler.getCommands().forEach(command => {
        this.internalDict[command] = handler;
      })
    })
  }

  getHandler(command: string) {
    return this.internalDict[command];
  }
}
