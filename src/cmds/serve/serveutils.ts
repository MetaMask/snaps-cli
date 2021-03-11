import { logError } from '../../utils';

export function logServerListening(portInput: number) {
  console.log(`Server listening on: http://localhost:${portInput}`);
}

export function logRequest(requestInput: Record<string, unknown>) {
  console.log(`Handling incoming request for: ${requestInput.url}`);
}

export function logServerError(err: Error, port: number) {
  if ((err as any).code === 'EADDRINUSE') {
    logError(`Server error: Port ${port} already in use.`);
  } else {
    logError(`Server error: ${err.message}`, err);
  }
}
