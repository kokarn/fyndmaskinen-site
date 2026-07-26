import {
    TextDecoder,
    TextEncoder,
} from 'util';

Object.assign(global, {
    IS_REACT_ACT_ENVIRONMENT: true,
    TextDecoder,
    TextEncoder,
});

Object.defineProperty(window, 'matchMedia', {
    value: () => {
        return {
            addEventListener: () => {},
            matches: false,
            removeEventListener: () => {},
        };
    },
    writable: true,
});
