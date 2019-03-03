import {Observable, of, Subject} from 'rxjs/index';
import {map} from 'rxjs/internal/operators';
import {CapabilityHandler} from '../capabilities/capability-handler';
import {EndpointHealthHandler} from '../capabilities/endpoint-health';
import {FanSpeed, FanSpeedHandler} from '../capabilities/fan-speed';
import {OnOff, OnOffHandler} from '../capabilities/on-off';
import {ComponentRaw} from '../config';
import {LoxoneRequest} from '../loxone-request';
import {Component} from './component';

export class FanComponent extends Component implements OnOff, FanSpeed {
  protected output: number;

  constructor(rawComponent: ComponentRaw, loxoneRequest: LoxoneRequest, statesEvents: Subject<Component>) {
    super(rawComponent, loxoneRequest, statesEvents);

    this.loxoneRequest.getControlInformation(this.loxoneId).subscribe(fan => {
      this.loxoneRequest.watchComponent(fan['states']['activeOutput']).subscribe(event => {
        this.output = event;
      });
    });
  }

  getCapabilities(): CapabilityHandler<any>[] {
    return [
      OnOffHandler.INSTANCE,
      FanSpeedHandler.INSTANCE,
      EndpointHealthHandler.INSTANCE,
    ];
  }

  turnOn(): Observable<boolean> {
    return this.selectOption(1);
  }

  turnOff(): Observable<boolean> {
    return this.reset();
  }

  selectOption(option: number): Observable<boolean> {
    return this.loxoneRequest.sendCmd(this.loxoneId, option.toString()).pipe(map(result => {
      if (result.code === '200') {
        this.output = option;
        return true;
      }
    }));
  }

  reset(): Observable<boolean> {
    return this.loxoneRequest.sendCmd(this.loxoneId, 'reset').pipe(map(result => {
      if (result.code === '200') {
        this.output = 0;
        return true;
      }
    }));
  }

  getSelectedOption(): Observable<number> {
    return of(this.output);
  }

  getPowerState(): Observable<boolean> {
    return of(this.output > 0);
  }
}
