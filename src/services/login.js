import requestSimpleForm from '../utils/requestSimpleForm';

export function login(params) {
    return requestSimpleForm('/api/login',params);
}
