import { Elysia } from "elysia";
import logixlysia from "logixlysia";

export const loggerPlugin = new Elysia({
	name: "Elysia with Logixlysia",
}).use(
	logixlysia({
		config: {
			logFilter:
				process.env.NODE_ENV === "production" ? { level: ["ERROR"] } : null, // Log everything in development
			showStartupMessage: true,
			startupMessageFormat: "simple",
			timestamp: {
				translateTime: "yyyy-mm-dd HH:MM:ss.SSS",
			},
			logFilePath: "./logs/example.log",
			ip: true,
			customLogFormat:
				"🦊 {now} {level} {duration} {method} {pathname} {status} {message} {ip}",
		},
	}),
);
