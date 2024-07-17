import { config, requestInterceptorArr } from "./config";
import { storage } from "./storage";

const globalFetch = global.fetch;

Object.defineProperty(global, 'fetch', {
    value: async function (input: RequestInfo, init?: RequestInit) {
        if(config.enable) {
            if(!init)
                init = { headers: {} };
            const headers = init.headers || {};

            for(const headerKey of config.transferHeaders) {
                const value = storage.get(headerKey);
                if(value)
                    headers[headerKey] = value;
            }

            init.headers = headers;

            for(const interceptor of requestInterceptorArr) {
                if(typeof interceptor === 'function')
                    interceptor(init);
            }
        }

        return globalFetch(input, init);
    },
    enumerable: true,
    configurable: true,
    writable: true,
});
