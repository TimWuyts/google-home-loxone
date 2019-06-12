import {Observable, of, Subject} from 'rxjs/index';
import {map} from 'rxjs/internal/operators';
import {CapabilityHandler} from '../capabilities/capability-handler';
import {EndpointHealthHandler} from '../capabilities/endpoint-health';
import {OpenClose, OpenCloseHandler} from '../capabilities/open-close';
import {ComponentRaw} from '../config';
import {ErrorType} from '../error';
import {LoxoneRequest} from '../loxone-request';
import {Component} from './component';

export class JalousieComponent extends Component implements OpenClose {
  protected statePos: number;
  protected stateUp: boolean;
  protected stateDown: boolean;

  constructor(rawComponent: ComponentRaw, loxoneRequest: LoxoneRequest, statesEvents: Subject<Component>) {
    super(rawComponent, loxoneRequest, statesEvents);

    this.loxoneRequest.getControlInformation(this.loxoneId).subscribe(jalousie => {
      this.loxoneRequest.watchComponent(jalousie['states']['position']).subscribe(event => {
        this.statePos = (1 - event) * 100;
        this.statesEvents.next(this);
      });

      this.loxoneRequest.watchComponent(jalousie['states']['up']).subscribe(event => {
        this.stateUp = event;
        this.statesEvents.next(this);
      });

      this.loxoneRequest.watchComponent(jalousie['states']['down']).subscribe(event => {
        this.stateDown = event;
        this.statesEvents.next(this);
      });
    });
  }

  getCapabilities(): CapabilityHandler<any>[] {
    return [
      OpenCloseHandler.INSTANCE,
      EndpointHealthHandler.INSTANCE,
    ];
  }

  open(): Observable<boolean> {
    return this.loxoneRequest.sendCmd(this.loxoneId, 'FullUp').pipe(map(result => {
      if (result.code === '200') {
        this.stateUp = true;
        this.stateDown = false;
        this.statesEvents.next(this);
        return true;
      }

      throw new Error(ErrorType.ENDPOINT_UNREACHABLE)
    }));
  }

  close(): Observable<boolean> {
    return this.loxoneRequest.sendCmd(this.loxoneId, 'FullDown').pipe(map(result => {
      if (result.code === '200') {
        this.stateUp = false;
        this.stateDown = true;
        this.statesEvents.next(this);
        return true;
      }

      throw new Error(ErrorType.ENDPOINT_UNREACHABLE);
    }));
  }

  getState(): Observable<number> {
    return of(this.statePos);
  }
}
