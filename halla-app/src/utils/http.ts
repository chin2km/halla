import * as R from "ramda";
import axios from "axios";

const instance = axios.create();

export const registerErrorInterceptor = (errorInterceptor) => {
    instance.interceptors.response.use(R.identity, errorInterceptor);
};

const getRequestObject = (method, url, config, accept) => ({
    ...config,
    headers: {
        "Accept": accept,
        "Accept-Type": accept,
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
        ...R.path(["headers"], config)
    },
    method,
    url
});

export const directHttpRequest = (method, url, config, accept = "application/json") => {
    const requestObject = getRequestObject(method, url, config, accept);
    return instance.request(requestObject);
};

export const httpRequest = (method, url, config, accept = "application/json") =>
    directHttpRequest(method, `${url}`, config, accept);

export const cancelableHttpRequest = (method, url, config, accept = "application/json") => {
    const source = axios.CancelToken.source();

    const requestObject = getRequestObject(method, `${url}`, config, accept);
    const cancellableRequestObject = R.assoc("cancelToken", source.token)(requestObject);

    const request = instance.request(cancellableRequestObject);
    return request;
};
