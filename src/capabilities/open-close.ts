import {Observable} from 'rxjs/internal/Observable';
import {map} from 'rxjs/operators';
import {Capability, CapabilityHandler} from './capability-handler';

export interface OpenClose extends Capability {
  open(): Observable<boolean>;

  close(): Observable<boolean>;

  getPowerState(): Observable<boolean>;
}

export class OpenCloseHandler implements CapabilityHandler<OpenClose> {
  public static INSTANCE = new OpenCloseHandler();

  getCommands(): string[] {
    return ['action.devices.commands.OpenClose'];
  }

  getTrait(): string {
    return 'action.devices.traits.OpenClose'
  }

  getAttributes(component: OpenClose): any {
    return {}
  }

  getState(component: OpenClose): Observable<any> {
    return component.getPowerState().pipe(map(result => {
      return {
        open: result
      }
    }));
  }

  handleCommands(component: OpenClose, command: string, payload?: any): Observable<boolean> {
    if (payload['open']) {
      return component.open();
    } else {
      return component.close()
    }
  }
}
