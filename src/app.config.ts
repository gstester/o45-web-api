


export class Config  {

    // Set to false to disable logging.
    public static LOGGER_ENABLED: boolean = (process.env.LOGGER_ENABLED ? Config._booleanConverter(process.env.LOGGER_ENABLED) : true);
    // The string key for the 'message' in the JSON object.
    public static LOGGER_MESSAGEKEY: string = process.env.LOGGER_MESSAGEKEY || 'msg';
    // Enables printing of level labels instead of level values in the printed logs. Warning: this option may not be supported by downstream transports.
    public static LOGGER_USE_LEVEL_LABELS: boolean = (process.env.LOGGER_USE_LEVEL_LABELS ? Config._booleanConverter(process.env.LOGGER_USE_LEVEL_LABELS) : true);
    // Define highest level of logger to filter output. Possible Values are from high to low: trace, debug, info, warn, error, and fatal.
    public static LOGGER_LEVEL: string = process.env.LOGGER_LEVEL || 'trace';
    // Define if logger logs incoming http requests.
    public static LOGGER_LOG_HTTP_REQUESTS: boolean = Config._booleanConverter(process.env.LOGGER_LOG_HTTP_REQUESTS) || false;

    // END LOGGER CONFIG

    // KEYCLOAK CONFIGURATION

    public get keycloakUrl(): string { return Config.KEYCLOAK_URL; }
    public get keycloakClientId(): string { return Config.KEYCLOAK_CLIENT_ID; }
    public get keycloakClientSecret(): string { return Config.KEYCLOAK_CLIENT_SECRET; }

    public get enableUma(): boolean { return Config.ENABLE_UMA; }

    public get realm(): string { return Config.REALM; }

    public get ownAddress(): string { return Config.OWN_ADDRESS; }

    public static KEYCLOAK_CLIENT_ID: string = process.env.KEYCLOAK_CLIENT_ID || '';
    public static KEYCLOAK_CLIENT_SECRET: string = process.env.KEYCLOAK_CLIENT_SECRET || '';
    public static ENABLE_UMA: boolean = (process.env.ENABLE_UMA ? Config._booleanConverter(process.env.ENABLE_UMA) : false);
    public static OWN_ADDRESS: string = process.env.OWN_ADDRESS || '';
    public static REALM: string = process.env.REALM || 'qc';
    public static KEYCLOAK_URL: string = process.env.KEYCLOAK_URL || '';

    public static DEFAULT_USERID: string = process.env.DEFAULT_USERID || "20deb97a-cb34-43a0-b8cd-40e3419cb208";

    // END KEYCLOAK CONFIGURATION


    // Docker ENV Values || Default Values
    public static LOGO_IMAGE_PATH: string = './src/assets/images/qvest_cloud_white.svg';
    public static SWAGGER_CSS_PATH: string = './src/assets/styles/swagger-custom.css';
    // Serving behind a Gateway with a API_BASE_PATH (used in Swagger UI)
    public static API_BASE_PATH: string = process.env.API_BASE_PATH || '';

    public static ID_ALPHABET = '1234567890abcdefghijklmnopqrstuvwxyz';
    public static ID_LENGTH = 13;

    public static DB_HOST: string = process.env.DB_HOST || "localhost";
    public static DB_PORT: string = process.env.DB_PORT || "27017";
    public static DB_NAME: string = process.env.DB_NAME || "appmetadata";
    public static DB_USER: string = process.env.DB_USER || null;
    public static DB_PASSWORD: string = process.env.DB_PASSWORD || null;

    public static PORTALAPI_TENANTNAME: string = process.env.PORTALAPI_TENANTNAME || "qc";
    public static PORTALAPI_SPACENAME: string = process.env.PORTALAPI_SPACENAME || "global";
    public static PORTALAPI_APPNAME: string = process.env.PORTALAPI_APPNAME || "portalapi";
    public static PORTALAPI_APPID: string = process.env.PORTALAPI_APPID;
    public static PORTALAPI_APPIDENTIFIER: string = null;
    public static PORTALAPI_VERSION = "v1.1.3";

    public static CLUSTER_ID: string = process.env.CLUSTER_ID;
    public static CLUSTER_NAME: string = process.env.CLUSTER_NAME;
    public static CLUSTER_DISPLAYNAME: string = process.env.CLUSTER_DISPLAYNAME;

    public static EVENTSTORE_HOST: string = process.env.EVENTSTORE_HOST || "localhost";
    public static EVENTSTORE_PORT: string = process.env.EVENTSTORE_PORT || "1113";

    public static USERIDENTIFIERS: string = process.env.USERIDENTIFIERS || "";
    public static GROUPIDENTIFIERS: string = process.env.GROUPIDENTIFIERS || "";
    public static ROLEIDENTIFIERS: string = process.env.ROLEIDENTIFIERS || "";

    public static API_AUTHORIZE: boolean = (process.env.API_AUTHORIZE ? Config._booleanConverter(process.env.API_AUTHORIZE) : false);

    public static IMPORT_DATA: boolean = (process.env.IMPORT_DATA ? Config._booleanConverter(process.env.IMPORT_DATA) : false);

    private static _booleanConverter(value: any): boolean {
        if (value === null || value === undefined || typeof value === "boolean")
            return value;

        return value.toString() === "true";
    }

    private static _numberConverter(value: any): number {
        if (value === null || value === undefined || typeof value === "number")
            return value;

        return Number(value);
    }

}
