import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { Capability, CapabilityHandler } from './capability-handler';

export interface Scene extends Capability {
  activate(): Observable<boolean>;
}

export class SceneHandler implements CapabilityHandler<Scene> {
  public static INSTANCE = new SceneHandler();

  getCommands(): string[] {
    return ['action.devices.commands.ActivateScene'];
  }

  getTrait(): string {
    return 'action.devices.traits.Scene'
  }

  getAttributes(component: Scene): any {
    return {
        'sceneReversible': false
    }
  }

  getState(component: Scene): any {
    return of(true);
  }

  handleCommands(component: Scene, command: string, payload?: any): Observable<boolean> {
    return component.activate();
  }
}
