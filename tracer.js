const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-proto')
const { PrometheusExporter } = require('@opentelemetry/exporter-prometheus');
const { MeterProvider, PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { OTLPMetricExporter} = require('@opentelemetry/exporter-metrics-otlp-proto');

function start(serviceName) {

    const { endpoint, port } = PrometheusExporter.DEFAULT_OPTIONS;
    const exporter = new PrometheusExporter({}, () => {
        console.log(
          `prometheus scrape endpoint: http://localhost:${port}${endpoint}`,
        );
      });
    const meterProvider = new MeterProvider({
            resource: new Resource({
            [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
        }),
    });    

    const metricReader = new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter({
            url:'http://collector:4318/v1/metrics'
        })
    })

    meterProvider.addMetricReader(metricReader);
    const meter = meterProvider.getMeter(serviceName);

    const traceExporter = new OTLPTraceExporter({
        url: 'http://collector:4318/v1/traces',
    });

    const sdk = new NodeSDK({
        traceExporter,
        serviceName,
        instrumentations: [getNodeAutoInstrumentations()]
    });
    sdk.start();
    return meter;
}
module.exports = start