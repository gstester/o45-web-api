export class Config  {
    public static API_BASE_PATH: string = process.env.API_BASE_PATH || '';

    public static ID_ALPHABET = '1234567890abcdefghijklmnopqrstuvwxyz';
    public static ID_LENGTH = 13;

    public static DB_HOST: string = process.env.DB_HOST || "localhost";
    public static DB_PORT: string = process.env.DB_PORT || "27017";
    public static DB_NAME: string = process.env.DB_NAME || "appmetadata";
    public static DB_USER: string = process.env.DB_USER || null;
    public static DB_PASSWORD: string = process.env.DB_PASSWORD || null;

    public static INCLUDE_WATER: boolean = (process.env.INCLUDE_WATER ? Config._booleanConverter(process.env.INCLUDE_WATER) : false);

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
