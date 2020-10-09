import {Observable, of, Subject} from 'rxjs/index';
import {map} from 'rxjs/internal/operators';
import {CapabilityHandler} from '../capabilities/capability-handler';
import {OnOff, OnOffHandler} from '../capabilities/on-off';
import {ComponentRaw} from '../config';
import {ErrorType} from '../error';
import {LoxoneRequest} from '../loxone-request';
import {Component} from './component';

export class CustomOnOff extends Component implements OnOff {
  private onAction: string;
  private offAction: string;
  protected active: boolean;

  constructor(rawComponent: ComponentRaw, loxoneRequest: LoxoneRequest, statesEvents: Subject<Component>) {
    super(rawComponent, loxoneRequest, statesEvents);

    this.loxoneRequest.getControlInformation(this.loxoneId).subscribe(toggle => {
      this.loxoneRequest.watchComponent(toggle['states']['active']).subscribe(event => {
        this.active = event === 1 ? true : false;
        this.statesEvents.next(this);
      });
    });

    this.onAction = rawComponent.customData['on'];
    this.offAction = rawComponent.customData['off'];
  }

  getCapabilities(): CapabilityHandler<any>[] {
    return [
      OnOffHandler.INSTANCE
    ];
  }

  turnOn(): Observable<boolean> {
    return this.loxoneRequest.sendCmd(this.loxoneId, this.onAction).pipe(map(result => {
      if (result.code === '200') {
        this.active = true;
        this.statesEvents.next(this);
        return true;
      }

      throw new Error(ErrorType.ENDPOINT_UNREACHABLE);
    }));
  }

  turnOff(): Observable<boolean> {
    return this.loxoneRequest.sendCmd(this.loxoneId, this.offAction).pipe(map(result => {
      if (result.code === '200') {
        this.active = false;
        this.statesEvents.next(this);
        return true;
      }

      throw new Error(ErrorType.ENDPOINT_UNREACHABLE);
    }));
  }

  getPowerState(): Observable<boolean> {
    return of(this.active);
  }
}
