import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus,
	Logger
} from "@nestjs/common";
import { Response } from "express";

interface ErrorResponse {
	statusCode: number;
	message: string | string[];
	error: string;
	timestamp: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	private readonly logger = new Logger(GlobalExceptionFilter.name);

	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest();

		let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
		let message = "Internal server error";
		let error = "InternalServerError";

		if (exception instanceof HttpException) {
			statusCode = exception.getStatus();
			const exceptionResponse = exception.getResponse();

			if (typeof exceptionResponse === "object") {
				const obj = exceptionResponse as any;
				message = obj.message || exception.message;
				error = obj.error || exception.name;
			} else {
				message = exceptionResponse;
				error = exception.name;
			}
		} else if (exception instanceof Error) {
			message = exception.message;
			error = exception.constructor.name;
		}

		const errorResponse: ErrorResponse = {
			statusCode,
			message,
			error,
			timestamp: new Date().toISOString()
		};

		if (Number(statusCode) >= 500) {
			this.logger.error(
				`${request.method} ${request.url} - ${
					exception instanceof Error
						? exception.stack
						: String(exception)
				}`
			);
		} else {
			this.logger.warn(
				`${request.method} ${request.url} - ${message} (${statusCode})`
			);
		}

		response.status(statusCode).json(errorResponse);
	}
}
