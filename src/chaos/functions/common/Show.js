import { Message } from 'element-ui';

export function success(message) {
    Message({ type: 'success', message });
}

export function info(message) {
    Message({ type: 'info', message });
}

export function warning(message) {
    Message({ type: 'warning', message });
}
