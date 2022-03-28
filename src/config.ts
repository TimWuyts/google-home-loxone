export class ComponentRaw {
    public id: string;
    public loxoneId?: string;
    public type: string;
    public loxoneType: string;
    public loxoneSub?: string;
    public name: string;
    public nicknames: string[];
    public room: string;
    public customData?: {};
    public extendedOption?: ExtendedOption;
    public modes: string;
    public target: number;
}

export class ExtendedOption {
    public brightness: boolean;
}

export class LoxoneConfig {
    public url: string;
    public user: string;
    public password: string;
}

export class NotifierDevice {
    public name: string;
    public ip: string;
}

export class Notifier {
    public lang: string;
    public devices: NotifierDevice[];
}

export class Config {
    public serverPort: string;
    public loxone: LoxoneConfig;
    public components: ComponentRaw[];
    public authorizedEmails: string[];
    public oAuthUrl: string;
    public log: boolean;
    public testMode: boolean;
    public agentUserId: string;
    public notifier: Notifier;
}
