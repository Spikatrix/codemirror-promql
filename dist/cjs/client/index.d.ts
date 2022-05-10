export { PrometheusClient, PrometheusConfig, CacheConfig } from './prometheus';
export declare type FetchFn = <T>(input: RequestInfo, init?: RequestInit) => Promise<T>;
