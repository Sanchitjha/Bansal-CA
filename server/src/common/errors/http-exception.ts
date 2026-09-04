export class HttpException extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class BadRequestException extends HttpException {
  constructor(message = "Bad request") {
    super(400, message);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message = "Authentication required") {
    super(401, message);
  }
}

export class ForbiddenException extends HttpException {
  constructor(message = "Insufficient permissions") {
    super(403, message);
  }
}

export class NotFoundException extends HttpException {
  constructor(message = "Resource not found") {
    super(404, message);
  }
}

export class ConflictException extends HttpException {
  constructor(message = "Resource conflict") {
    super(409, message);
  }
}
