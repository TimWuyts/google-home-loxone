import { Observable, of, Subject } from 'rxjs/index';
import { map } from 'rxjs/operators';
import { CapabilityHandler } from '../capabilities/capability-handler';
import { TemperatureSetting, TemperatureSettingHandler, TemperatureState } from '../capabilities/temperature-setting';
import { ComponentRaw } from '../config';
import { ErrorType } from '../error';
import { LoxoneRequest } from '../loxone-request';
import { Component } from './component';

export class ThermostatComponent extends Component implements TemperatureSetting {
  protected temperatureState: TemperatureState = new TemperatureState();

  constructor(rawComponent: ComponentRaw, loxoneRequest: LoxoneRequest, statesEvents: Subject<Component>) {
    super(rawComponent, loxoneRequest, statesEvents);

    this.loxoneRequest.getControlInformation(this.loxoneId).subscribe(control => {
      let modes = 'off'; // default mode when not specified in config

      if (rawComponent.modes) {
        modes = rawComponent.modes;
      }

      this.temperatureState.thermostatMode = modes;

      this.loxoneRequest.watchComponent(control['states']['tempActual']).subscribe(event => {
        this.temperatureState.thermostatTemperatureAmbient = parseInt(event, 10);
      });

      this.loxoneRequest.watchComponent(control['states']['tempTarget']).subscribe(event => {
        this.temperatureState.thermostatTemperatureSetpoint = parseInt(event, 10);
      });
    });
  }

  getCapabilities(): CapabilityHandler<any>[] {
    return [
      TemperatureSettingHandler.INSTANCE
    ];
  }

  getThermostatModes(): string {
    return this.temperatureState.thermostatMode;
  }

  getTemperature(): Observable<TemperatureState> {
    return of(this.temperatureState)
  }

  setTemperature(target): Observable<boolean> {
    return this.loxoneRequest.sendCmd(this.loxoneId, 'setManualTemperature/' + target).pipe(map((result) => {
      if (result.code === '200') {
        this.temperatureState.thermostatTemperatureSetpoint = target;
        this.statesEvents.next(this);
        return true;
      }
      throw new Error(ErrorType.ENDPOINT_UNREACHABLE)
    }))
  }
}
