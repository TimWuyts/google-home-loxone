import { Observable, of, Subject } from 'rxjs/index';
import { CapabilityHandler } from '../capabilities/capability-handler';
import { TemperatureControl, TemperatureControlHandler, TemperatureState } from '../capabilities/temperature-control';
import { ComponentRaw } from '../config';
import { LoxoneRequest } from '../loxone-request';
import { Component } from './component';

export class SensorComponent extends Component implements TemperatureControl {
    protected temperatureState: TemperatureState = new TemperatureState();

    constructor(rawComponent: ComponentRaw, loxoneRequest: LoxoneRequest, statesEvents: Subject<Component>) {
        super(rawComponent, loxoneRequest, statesEvents);

        this.loxoneRequest.getControlInformation(this.loxoneId).subscribe(control => {
            this.loxoneRequest.watchComponent(this.loxoneId).subscribe(event => {
                this.temperatureState.temperatureAmbientCelsius = parseInt(event, 10);
            });

            this.temperatureState.temperatureSetpointCelsius = rawComponent.target || 20;
        });
    }

    getCapabilities(): CapabilityHandler<any>[] {
        return [
            TemperatureControlHandler.INSTANCE
        ];
    }

    getTemperature(): Observable<TemperatureState> {
        return of(this.temperatureState)
    }
}
