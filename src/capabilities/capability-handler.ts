import {Observable} from 'rxjs/internal/Observable';
import {ArmDisarmHandler} from './arm-disarm';
import {BrightnessHandler} from './brightness';
import {EndpointHealthHandler} from './endpoint-health';
import {FanSpeedHandler} from './fan-speed';
import {OnOffHandler} from './on-off';
import {OpenCloseHandler} from './open-close';
import {OpenCloseStateHandler} from './open-close-state';
import {SceneHandler} from './scene';
import {TemperatureControlHandler} from './temperature-control';
import {TemperatureSettingHandler} from './temperature-setting';


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
      FanSpeedHandler.INSTANCE,
      OnOffHandler.INSTANCE,
      OpenCloseHandler.INSTANCE,
      OpenCloseStateHandler.INSTANCE,
      ArmDisarmHandler.INSTANCE,
      BrightnessHandler.INSTANCE,
      SceneHandler.INSTANCE,
      EndpointHealthHandler.INSTANCE,
      TemperatureControlHandler.INSTANCE,
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
