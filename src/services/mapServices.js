import http from './httpServices';
import { API_URL } from "../utility/constants";

export function postAddressToAPI(fromAddress, toAddress) {
    return http.post(`${API_URL}/route`);
}

export function getMarkersByToken(token) {
    return http.get(`${API_URL}/route/${token}`);
}