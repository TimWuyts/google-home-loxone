import {Observable, of, Subject} from 'rxjs/index';
import {map} from 'rxjs/internal/operators';
import {CapabilityHandler} from '../capabilities/capability-handler';
import {EndpointHealthHandler} from '../capabilities/endpoint-health';
import {FanSpeed, FanSpeedHandler} from '../capabilities/fan-speed';
import {ComponentRaw} from '../config';
import {LoxoneRequest} from '../loxone-request';
import {Component} from './component';

export class FanComponent extends Component implements FanSpeed {
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
      FanSpeedHandler.INSTANCE,
      EndpointHealthHandler.INSTANCE,
    ];
  }

  selectOption(option: number): Observable<boolean> {
    // TODO: make option dynamic
    return this.loxoneRequest.sendCmd(this.loxoneId, option.toString()).pipe(map(result => {
      if (result.code === '200') {
        this.output = 1;
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

  getPowerState(): Observable<boolean> {
    return of(this.output > 0)
  }
}
