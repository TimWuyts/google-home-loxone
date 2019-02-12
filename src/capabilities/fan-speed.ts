import {Observable} from 'rxjs/internal/Observable';
import {map} from 'rxjs/operators';
import {Capability, CapabilityHandler} from './capability-handler';

export interface FanSpeed extends Capability {
  selectOption(option: number): Observable<boolean>;

  reset(): Observable<boolean>;

  getPowerState(): Observable<boolean>;
}

export class FanSpeedHandler implements CapabilityHandler<FanSpeed> {
  public static INSTANCE = new FanSpeedHandler();

  getCommands(): string[] {
    return ['action.devices.commands.SetFanSpeed'];
  }

  getTrait(): string {
    return 'action.devices.traits.FanSpeed'
  }

  getAttributes(component: FanSpeed): any {
    return {
      'availableFanSpeeds': {
        'speeds': [
          {
            'speed_name': 'S1',
            'speed_values': [{
              'speed_synonym': ['laag', 'minimum', 'snelheid 1', 'stand 1'],
              'lang': 'nl'
            }]
          },
          {
            'speed_name': 'S2',
            'speed_values': [{
              'speed_synonym': ['gemiddeld', 'normaal', 'snelheid 2', 'stand 2'],
              'lang': 'nl'
            }]
          },
          {
            'speed_name': 'S3',
            'speed_values': [{
              'speed_synonym': ['hoog', 'maximum', 'snelheid 3', 'stand 3'],
              'lang': 'nl'
            }]
          }
        ],
        'ordered': true
      },
      'reversible': false
    }
  }

  getState(component: FanSpeed): Observable<any> {
    return component.getPowerState().pipe(map(result => {
      console.log('state S1');
      return {
        currentFanSpeedSetting: 'S1'
      }
    }));
  }

  handleCommands(component: FanSpeed, command: string, payload?: any): Observable<boolean> {
    if (payload['on']) {
      return component.selectOption(1);
    } else {
      return component.reset();
    }
  }
}
