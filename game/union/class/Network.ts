import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export default class Network {
    public static async post<Request, Response>(address: string, req: Request): Promise<Response | undefined> {
        try {
            const requestParam: Array<Request | AxiosRequestConfig> = [req];
            const response: AxiosResponse<Response> = await axios.post(`${address}`, ...requestParam);

            if (response.status !== 200) {
                return undefined;
            }

            return response.data;
        } catch (error) {
            return undefined;
        }
    }

    public static async get<Request, Response>(address: string, req: Request): Promise<Response | undefined> {
        try {
            const requestParam: AxiosRequestConfig = { params: req };
            const response = await axios.get(`${address}`, requestParam);

            if (response.status !== 200) {
                return undefined;
            }

            return response.data;
        } catch (error) {
            return undefined;
        }
    }
}