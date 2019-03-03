import {Observable} from 'rxjs/internal/Observable';
import {map} from 'rxjs/operators';
import {Capability, CapabilityHandler} from './capability-handler';

export interface FanSpeed extends Capability {
  selectOption(option: number): Observable<boolean>;

  reset(): Observable<boolean>;

  getPowerState(): Observable<boolean>;

  getSelectedOption(): Observable<number>;
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
              'speed_synonym': ['stand 1', 'laag', 'minimum', 'snelheid 1'],
              'lang': 'nl'
            }]
          },
          {
            'speed_name': 'S2',
            'speed_values': [{
              'speed_synonym': ['stand 2', 'gemiddeld', 'normaal', 'snelheid 2'],
              'lang': 'nl'
            }]
          },
          {
            'speed_name': 'S3',
            'speed_values': [{
              'speed_synonym': ['stand 3', 'hoog', 'maximum', 'snelheid 3'],
              'lang': 'nl'
            }]
          }
        ],
        'ordered': true
      },
      'reversible': true
    }
  }

  getState(component: FanSpeed): Observable<any> {
    return component.getSelectedOption().pipe(map(val => {
      return {
        currentFanSpeedSetting: val
      }
    }));
  }

  handleCommands(component: FanSpeed, command: string, payload?: any): Observable<boolean> {
    let option;

    switch (payload['fanSpeed']) {
      case 'S1': option = 0; break;
      case 'S2': option = 1; break;
      case 'S3': option = 2; break;
      default: option = 0;
    }

    if (option === 0) {
      return component.reset();
    } else {
      return component.selectOption(option);
    }
  }
}
