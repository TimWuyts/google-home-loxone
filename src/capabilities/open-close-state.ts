import { of } from 'rxjs';
import {Observable} from 'rxjs/internal/Observable';
import {map} from 'rxjs/operators';
import {Capability, CapabilityHandler} from './capability-handler';

export interface OpenCloseState extends Capability {
    getState(): Observable<number>;
}

export class OpenCloseStateHandler implements CapabilityHandler<OpenCloseState> {
    public static INSTANCE = new OpenCloseStateHandler();

    getCommands(): string[] {
        return [];
    }

    getTrait(): string {
        return 'action.devices.traits.OpenClose'
    }

    getAttributes(component: OpenCloseState): any {
        return {
            'discreteOnlyOpenClose': true,
            'queryOnlyOpenClose': true
        }
    }

    getState(component: OpenCloseState): Observable<any> {
        return component.getState().pipe(map(result => {
            return {
                openPercent: result
            }
        }));
    }

    handleCommands(component: OpenCloseState, command: string, payload?: any): Observable<boolean> {
        return of(false);
    }
}
