import { FetchFn } from '.';
import { Matcher } from '../types';
export interface MetricMetadata {
    type: string;
    help: string;
}
export interface PrometheusClient {
    labelNames(metricName?: string): Promise<string[]>;
    labelValues(labelName: string, metricName?: string, matchers?: Matcher[]): Promise<string[]>;
    metricMetadata(): Promise<Record<string, MetricMetadata[]>>;
    series(metricName: string, matchers?: Matcher[], labelName?: string): Promise<Map<string, string>[]>;
    metricNames(prefix?: string): Promise<string[]>;
}
export interface CacheConfig {
    maxAge?: number;
    initialMetricList?: string[];
}
export interface PrometheusConfig {
    url?: string;
    lookbackInterval?: number;
    httpErrorHandler?: (error: any) => void;
    fetchFn?: FetchFn;
    cache?: CacheConfig;
    httpMethod?: 'POST' | 'GET';
    apiPrefix?: string;
}
export declare class HTTPPrometheusClient implements PrometheusClient {
    private readonly lookbackInterval;
    private readonly url;
    private readonly errorHandler?;
    private readonly httpMethod;
    private readonly apiPrefix;
    private readonly fetchFn;
    constructor(config: PrometheusConfig);
    labelNames(metricName?: string): Promise<string[]>;
    labelValues(labelName: string, metricName?: string, matchers?: Matcher[]): Promise<string[]>;
    metricMetadata(): Promise<Record<string, MetricMetadata[]>>;
    series(metricName: string, matchers?: Matcher[], labelName?: string): Promise<Map<string, string>[]>;
    metricNames(): Promise<string[]>;
    private fetchAPI;
    private buildRequest;
    private labelsEndpoint;
    private labelValuesEndpoint;
    private seriesEndpoint;
    private metricMetadataEndpoint;
}
export declare class CachedPrometheusClient implements PrometheusClient {
    private readonly cache;
    private readonly client;
    constructor(client: PrometheusClient, config?: CacheConfig);
    labelNames(metricName?: string): Promise<string[]>;
    labelValues(labelName: string, metricName?: string): Promise<string[]>;
    metricMetadata(): Promise<Record<string, MetricMetadata[]>>;
    series(metricName: string): Promise<Map<string, string>[]>;
    metricNames(): Promise<string[]>;
}
