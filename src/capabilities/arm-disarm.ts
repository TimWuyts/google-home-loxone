import {Observable} from 'rxjs/internal/Observable';
import {map} from 'rxjs/operators';
import {Capability, CapabilityHandler} from './capability-handler';

export interface ArmDisarm extends Capability {
  turnOn(): Observable<boolean>;

  turnOff(): Observable<boolean>;

  armedState(): Observable<boolean>;
}

export class ArmDisarmHandler implements CapabilityHandler<ArmDisarm> {
  public static INSTANCE = new ArmDisarmHandler();

  getCommands(): string[] {
    return ['action.devices.commands.ArmDisarm'];
  }

  getTrait(): string {
    return 'action.devices.traits.ArmDisarm'
  }

  getAttributes(component: ArmDisarm): any {
    return {}
  }

  getState(component: ArmDisarm): Observable<any> {
    return component.armedState().pipe(map(result => {
      return {
        isArmed: result
      }
    }));
  }

  handleCommands(component: ArmDisarm, command: string, payload?: any): Observable<boolean> {
    if (payload['arm']) {
      return component.turnOn();
    } else {
      return component.turnOff()
    }
  }
}
