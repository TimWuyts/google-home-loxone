import { Observable, of, Subject } from 'rxjs/index';
import { map } from 'rxjs/operators';

import { CapabilityHandler } from '../capabilities/capability-handler';
import { EndpointHealthHandler } from '../capabilities/endpoint-health';
import { SceneHandler } from '../capabilities/scene';

import { Scene } from '../capabilities/scene';

import { ComponentRaw } from '../config';
import { ErrorType } from '../error';
import { LoxoneRequest } from '../loxone-request';
import { Component } from './component';

export class SceneComponent extends Component implements Scene {

    constructor(rawComponent: ComponentRaw, loxoneRequest: LoxoneRequest, statesEvents: Subject<Component>) {
        super(rawComponent, loxoneRequest, statesEvents);
    }

    getCapabilities(): CapabilityHandler<any>[] {
        const capabilities: CapabilityHandler<any>[] = [
            SceneHandler.INSTANCE,
            EndpointHealthHandler.INSTANCE,
        ];

        return capabilities;
    }

    activate(): Observable<boolean> {
        const parts = this.loxoneId.split('/');
        const uuid = parts[0];
        const scene = parts[1];

        return this.loxoneRequest.sendCmd(uuid, scene).pipe(map((result) => {
            if (result.code === '200') {
                return true;
            }
            throw new Error(ErrorType.ENDPOINT_UNREACHABLE)
        }))
    }
}
