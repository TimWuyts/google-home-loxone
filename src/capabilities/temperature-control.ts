import { Observable } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { Capability, CapabilityHandler } from './capability-handler';


export class TemperatureState {
    temperatureSetpointCelsius: number;
    temperatureAmbientCelsius: number;
}

export interface TemperatureControl extends Capability {
    getTemperature(): Observable<TemperatureState>;
}

export class TemperatureControlHandler implements CapabilityHandler<TemperatureControl> {
    public static INSTANCE = new TemperatureControlHandler();

    getCommands(): string[] {
        return [];
    }

    getState(component: TemperatureControl): Observable<any> {
        return component.getTemperature();
    }

    getTrait(): string {
        return 'action.devices.traits.TemperatureControl';
    }

    getAttributes(component: TemperatureControl): any {
        return {
            'temperatureUnitForUX': 'C',
            'queryOnlyTemperatureControl': true
        }
    }

    handleCommands(component: TemperatureControl, command: string, payload?: any): Observable<boolean> {
        return of(false);
    }
}
