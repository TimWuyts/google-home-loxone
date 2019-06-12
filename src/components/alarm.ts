import {Observable, of, Subject} from 'rxjs/index';
import {map} from 'rxjs/internal/operators';
import {ArmDisarm, ArmDisarmHandler} from '../capabilities/arm-disarm';
import {CapabilityHandler} from '../capabilities/capability-handler';
import {EndpointHealthHandler} from '../capabilities/endpoint-health';
import {ComponentRaw} from '../config';
import {ErrorType} from '../error';
import {LoxoneRequest} from '../loxone-request';
import {Component} from './component';


export class AlarmComponent extends Component implements ArmDisarm {
  protected armed: boolean;

  constructor(rawComponent: ComponentRaw, loxoneRequest: LoxoneRequest, statesEvents: Subject<Component>) {
    super(rawComponent, loxoneRequest, statesEvents);

    this.loxoneRequest.getControlInformation(this.loxoneId).subscribe(alarm => {
      this.loxoneRequest.watchComponent(alarm['states']['armed']).subscribe(event => {
        this.armed = event === 1 ? true : false;
        this.statesEvents.next(this);
      });
    });
  }

  getCapabilities(): CapabilityHandler<any>[] {
    return [
      ArmDisarmHandler.INSTANCE,
      EndpointHealthHandler.INSTANCE
    ];
  }

  turnOn(): Observable<boolean> {
    return this.loxoneRequest.sendCmd(this.loxoneId, 'delayedon').pipe(map(result => {
      if (result.code === '200') {
        this.armed = true;
        this.statesEvents.next(this);
        return true;
      }

      throw new Error(ErrorType.ENDPOINT_UNREACHABLE)
    }));
  }

  turnOff(): Observable<boolean> {
    return this.loxoneRequest.sendCmd(this.loxoneId, 'off').pipe(map(result => {
      console.log(result);
      if (result.code === '200') {
        this.armed = false;
        this.statesEvents.next(this);
        return true;
      }

      throw new Error(ErrorType.ENDPOINT_UNREACHABLE)
    }));
  }

  armedState(): Observable<boolean> {
    return of(this.armed);
  }
}
