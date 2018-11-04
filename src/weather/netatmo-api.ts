import * as req from 'request'
import { Observable, Observer } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Config } from '../config';
import { WeatherMeasure } from './weather-measure.model';
import { WeatherResponse } from './weather-response.model';
import { WeatherStation } from './weather-station.model';

export class NetatmoApi {
    private readonly config: Config;
    private token: string;

    private temps: number[] = [];
    private humidities: number[] = [];
    private isRaining = false;

    constructor(config: Config) {
        this.config = config;
    }

    public getWeather(): Observable<any> {
        return this.auth()
            .pipe(
                switchMap(() => this.getData()),
                tap((resps: WeatherStation[]) => {
                    // Parse response
                    resps.forEach((resp) => {
                        Object.keys(resp.measures).forEach((id) => {
                            this.findTempsOrHumidity(resp.measures[id], 'temperature');
                            this.findTempsOrHumidity(resp.measures[id], 'humidity');
                            this.findRain(resp.measures[id]);
                        });
                    });
                }),
                map(() => new WeatherResponse(this.temps, this.humidities, this.isRaining))
            );
    }

    /**
     * Push all temperature into the temps array
     * @param measure
     */
    private findTempsOrHumidity(measure: any, type: 'temperature' | 'humidity'): void {
        if (!measure.type) {
            return;
        }

        const indexType = measure.type.indexOf(type);
        if (indexType === -1) {
            return;
        }

        const currentMeasure = measure as WeatherMeasure;
        Object.keys(currentMeasure.res).forEach((timestamp) => {
            if (type === 'temperature') {
                this.temps.push(currentMeasure.res[timestamp][indexType]);
            } else {
                this.humidities.push(currentMeasure.res[timestamp][indexType]);
            }
        });
    }

    private findRain(measure: any): void {
        if (!measure.rain_live || this.isRaining) {
            return;
        }

        this.isRaining = measure.rain_live > 0 ? true : false;
    }

    private auth(): Observable<any> {
        return Observable.create((observer: Observer<any>) => {
            req.post('https://api.netatmo.com/oauth2/token', {
                form: {
                    'client_id': this.config.weather.clientId,
                    'client_secret': this.config.weather.clientSecret,
                    'grant_type': 'password',
                    'username': this.config.weather.username,
                    'password': this.config.weather.password,
                    'scope': 'read_station',
                }
            }, (error, response, body) => {
                if (this.config.log) {
                    console.log(`Netatmo auth response`, body);
                }

                if (error) {
                    observer.error(error);
                    observer.complete();
                    return;
                }

                this.token = JSON.parse(body).access_token;
                observer.next(body);
                observer.complete();
            });
        });
    }

    private getData(): Observable<WeatherStation[]> {
        return Observable.create((observer: Observer<WeatherStation[]>) => {
            req.post('https://api.netatmo.com/api/getpublicdata', {
                headers: {
                    'Content-Type': `application/json`,
                },
                body: JSON.stringify({
                    'access_token': this.token,
                    'lat_ne': this.config.weather.lat_ne,
                    'lon_ne': this.config.weather.lon_ne,
                    'lat_sw': this.config.weather.lat_sw,
                    'lon_sw': this.config.weather.lon_sw
                }),
            }, (error, response, body) => {
                if (this.config.log) {
                    console.log(`Weather response`, error, body);
                }

                if (error) {
                    observer.error(error);
                    observer.complete();
                    return;
                }

                observer.next(JSON.parse(body).body);
                observer.complete();
            });
        });
    }

}
