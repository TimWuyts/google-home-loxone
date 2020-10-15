import {Observable} from 'rxjs/internal/Observable';
import {map} from 'rxjs/operators';
import {Capability, CapabilityHandler} from './capability-handler';

export interface OpenClose extends Capability {
    open(): Observable<boolean>;

    close(): Observable<boolean>;

    getState(): Observable<number>;
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
        return component.getState().pipe(map(result => {
            return {
                openPercent: result
            }
        }));
    }

    handleCommands(component: OpenClose, command: string, payload?: any): Observable<boolean> {
        if (payload['openPercent'] === 100) {
            return component.open();
        } else {
            return component.close();
        }
    }
}
