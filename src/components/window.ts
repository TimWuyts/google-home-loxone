import {Observable, of, Subject} from 'rxjs/index';
import { map } from 'rxjs/internal/operators';
import {CapabilityHandler} from '../capabilities/capability-handler';
import {EndpointHealthHandler} from '../capabilities/endpoint-health';
import { OpenCloseHandler } from '../capabilities/open-close';
import {OpenCloseState, OpenCloseStateHandler} from '../capabilities/open-close-state';
import {ComponentRaw} from '../config';
import { ErrorType } from '../error';
import {LoxoneRequest} from '../loxone-request';
import {Component} from './component';

export class WindowComponent extends Component implements OpenCloseState {
    protected statePos: number;
    protected stateOpened: boolean;
    protected stateClosed: boolean;

    constructor(rawComponent: ComponentRaw, loxoneRequest: LoxoneRequest, statesEvents: Subject<Component>) {
        super(rawComponent, loxoneRequest, statesEvents);

        this.loxoneRequest.getControlInformation(this.loxoneId).subscribe(window => {
            switch (window['type']) {
                case 'InfoOnlyDigital':
                    this.loxoneRequest.watchComponent(window['states']['active']).subscribe(event => {
                        this.statePos = (event === 1) ? 100 : 0;
                        this.statesEvents.next(this);
                    });
                break;
                case 'Window':
                    this.loxoneRequest.watchComponent(window['states']['position']).subscribe(event => {
                        this.statePos = event * 100;
                        this.statesEvents.next(this);
                    });
                break;
            }
            
        });
    }

    getCapabilities(): CapabilityHandler<any>[] {
        const capabilities: CapabilityHandler<any>[] = [
            EndpointHealthHandler.INSTANCE,
        ];
        
        if (this.extendedOption && this.extendedOption.motorised) {
            capabilities.push(OpenCloseHandler.INSTANCE);
        } else {
            capabilities.push(OpenCloseStateHandler.INSTANCE);
        }
        
        return capabilities;
    }

    open(): Observable<boolean> {
        return this.loxoneRequest.sendCmd(this.loxoneId, 'fullopen').pipe(map(result => {
            if (result.code === '200') {
                this.stateOpened = true;
                this.stateClosed = false;
                this.statesEvents.next(this);
                return true;
            }
        
            throw new Error(ErrorType.ENDPOINT_UNREACHABLE)
        }));
    }
    
    close(): Observable<boolean> {
        return this.loxoneRequest.sendCmd(this.loxoneId, 'fullclose').pipe(map(result => {
            if (result.code === '200') {
                this.stateOpened = false;
                this.stateClosed = true;
                this.statesEvents.next(this);
                return true;
            }

            throw new Error(ErrorType.ENDPOINT_UNREACHABLE);
        }));
    }

    position(percentage: number): Observable<boolean> {
        return this.loxoneRequest.sendCmd(this.loxoneId, 'moveToPosition/' + percentage).pipe(map(result => {
            if (result.code === '200') {
                this.statePos = percentage;
                this.stateOpened = false;
                this.stateClosed = false;
                this.statesEvents.next(this);
                return true;
            }

            throw new Error(ErrorType.ENDPOINT_UNREACHABLE);
        }));
    }

    getState(): Observable<number> {
        return of((this.statePos));
    }
}
