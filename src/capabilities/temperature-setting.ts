import { Observable } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { Capability, CapabilityHandler } from './capability-handler';


export class TemperatureState {
  thermostatMode: string;
  thermostatTemperatureSetpoint: number;
  thermostatTemperatureAmbient: number;
}

export interface TemperatureSetting extends Capability {
  getTemperature(): Observable<TemperatureState>;

  getThermostatModes(): string;

  setTemperature(goal: Number): Observable<boolean>;
}

export class TemperatureSettingHandler implements CapabilityHandler<TemperatureSetting> {
  public static INSTANCE = new TemperatureSettingHandler();

  getCommands(): string[] {
    return [
      'action.devices.commands.ThermostatTemperatureSetpoint'
    ];
  }

  getState(component: TemperatureSetting): Observable<any> {
    return component.getTemperature();
  }

  getTrait(): string {
    return 'action.devices.traits.TemperatureSetting';
  }

  getAttributes(component: TemperatureSetting): any {
    return {
      'availableThermostatModes': component.getThermostatModes(),
      'thermostatTemperatureUnit': 'C'
    }
  }

  handleCommands(component: TemperatureSetting, command: string, payload?: any): Observable<boolean> {
    if (payload['thermostatTemperatureSetpoint']) {
      return component.setTemperature(+payload['thermostatTemperatureSetpoint']);
    } else {
      console.error('Error during setting temperature', component, payload);
      return of(false);
    }
  }
}
