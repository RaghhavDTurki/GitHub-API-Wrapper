import express from 'express';
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
import compression from "compression";
import lusca from "lusca";
import helmet from "helmet";
import { route } from './api/router';

// Create Express server
const app = express();

Sentry.init({
    dsn: "https://758653dfb6cf42f38ab9d4b785ca83fc@o1251884.ingest.sentry.io/6417681",
    integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Tracing.Integrations.Express({ app }),
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
});


// Express configuration

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler() as express.RequestHandler);
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.set("port", process.env.PORT || 3000);
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
// All controllers should live here
app.use("/api/v1", route);

// The error handler must be before any other error middleware and after all controllers
app.use(
    Sentry.Handlers.errorHandler({
        shouldHandleError(error) {
            // Capture all 404 and 500 errors
            if (error.status === 404 || error.status === 500) {
                return true;
            }
            return false;
        },
    }) as express.ErrorRequestHandler
);
export default app;