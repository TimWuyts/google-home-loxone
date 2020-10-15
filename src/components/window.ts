import {Observable, of, Subject} from 'rxjs/index';
import {CapabilityHandler} from '../capabilities/capability-handler';
import {EndpointHealthHandler} from '../capabilities/endpoint-health';
import {OpenCloseState, OpenCloseStateHandler} from '../capabilities/open-close-state';
import {ComponentRaw} from '../config';
import {LoxoneRequest} from '../loxone-request';
import {Component} from './component';

export class WindowComponent extends Component implements OpenCloseState {
    protected opened: boolean;

    constructor(rawComponent: ComponentRaw, loxoneRequest: LoxoneRequest, statesEvents: Subject<Component>) {
        super(rawComponent, loxoneRequest, statesEvents);

        this.loxoneRequest.getControlInformation(this.loxoneId).subscribe(window => {
            this.loxoneRequest.watchComponent(window['states']['active']).subscribe(event => {
                this.opened = event === 1 ? true : false;
                this.statesEvents.next(this);
            });
        });
    }

    getCapabilities(): CapabilityHandler<any>[] {
        return [
            OpenCloseStateHandler.INSTANCE,
            EndpointHealthHandler.INSTANCE,
        ];
    }

    getState(): Observable<number> {
        return of((this.opened) ? 100 : 0);
    }
}
