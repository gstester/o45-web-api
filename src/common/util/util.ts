import nanoid = require('nanoid/generate');
import { Config } from '../../app.config';


export function getId(): string {
    return nanoid(Config.ID_ALPHABET, Config.ID_LENGTH);
}

export function mapEnum(enumClass){
    const enumArray = [];
    for (const key of Object.keys(enumClass)) {
      enumArray.push(enumClass[key]);
    }
    return enumArray;
  }

  export function mapDto<T>(values: Partial<T>, ctor: new () => T): T {
    try {
        const instance = new ctor();

        return Object.keys(instance).reduce((acc, key) => {
            acc[key] = values[key];
            return acc;
        }, {}) as T;
    }
    catch (err) {
        console.error(err);
    }
}