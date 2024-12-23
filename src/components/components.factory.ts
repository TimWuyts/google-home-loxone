import {Subject} from 'rxjs/internal/Subject';
import {Config} from '../config';
import {LoxoneRequest} from '../loxone-request';

import {AlarmComponent} from './alarm';
import {Component} from './component';
import {CustomOnOff} from './custom-on-off';
import {DoorComponent} from './door';
import {FanComponent} from './fan';
import {JalousieComponent} from './jalousie';
import {LightComponent} from './light';
import {SceneComponent} from './scene';
import {SensorComponent} from './sensor';
import {ThermostatComponent} from './thermostat';
import {WindowComponent} from './window';

export class ComponentsFactory {
  private readonly components: { [key: string]: Component } = {};

  constructor(config: Config, loxoneRequest: LoxoneRequest, statesEvents: Subject<Component>) {
    config.components
      .forEach(rawComponent => {
        let component: Component;
        switch (rawComponent.loxoneType) {
          case 'Light':
            component = new LightComponent(rawComponent, loxoneRequest, statesEvents);
            break;
          case 'Thermostat':
            component = new ThermostatComponent(rawComponent, loxoneRequest, statesEvents);
            break;
          case 'Sensor':
            component = new SensorComponent(rawComponent, loxoneRequest, statesEvents);
            break;
          case 'Jalousie':
          case 'CentralJalousie':
            component = new JalousieComponent(rawComponent, loxoneRequest, statesEvents);
            break;
          case 'Fan':
            component = new FanComponent(rawComponent, loxoneRequest, statesEvents);
            break;
          case 'Alarm':
            component = new AlarmComponent(rawComponent, loxoneRequest, statesEvents);
            break;
          case 'Door':
            component = new DoorComponent(rawComponent, loxoneRequest, statesEvents);
            break;
          case 'Window':
          case 'CentralWindow':
            component = new WindowComponent(rawComponent, loxoneRequest, statesEvents);
            break;
          case 'Custom-OnOff':
            component = new CustomOnOff(rawComponent, loxoneRequest, statesEvents)
            break;
          case 'Scene':
            component = new SceneComponent(rawComponent, loxoneRequest, statesEvents);
            break;
        }

        if (component != null) {
          this.components[component.id] = component;
        }
      })
  }

  getComponent(): { [key: string]: Component } {
    return this.components;
  }
}
