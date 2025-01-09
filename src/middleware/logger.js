// logger.middleware.ts
import morgan from "morgan";
import { format } from "util";

const customFormat =
	":date[iso] :method :url :status - :response-time ms - :res[content-length]";

const stream = {
	write: (message) => {
		// Use your preferred logging mechanism here, for example, console.log or a logging library
		console.log(message);
	},
};

export const loggerMiddleware = morgan(customFormat, { stream });

export const errorLoggerMiddleware = (err, req, res, next) => {
	console.error(
		format(
			"%s %s %s %s %s",
			new Date().toISOString(),
			req.method,
			req.url,
			res.statusCode,
			err.stack
		)
	);
	next(err);
};
