// src/utils/permissionErrorHandler.ts
export interface PermissionError {
  code: string;
  message: string;
  details?: any;
  timestamp: number;
}

export class PermissionErrorHandler {
  private static instance: PermissionErrorHandler;
  private errors: PermissionError[] = [];
  private readonly MAX_ERRORS = 100;

  private constructor() {}

  static getInstance(): PermissionErrorHandler {
    if (!PermissionErrorHandler.instance) {
      PermissionErrorHandler.instance = new PermissionErrorHandler();
    }
    return PermissionErrorHandler.instance;
  }

  // Log permission error
  logError(code: string, message: string, details?: any): void {
    const error: PermissionError = {
      code,
      message,
      details,
      timestamp: Date.now()
    };

    this.errors.push(error);

    // Keep only the last MAX_ERRORS
    if (this.errors.length > this.MAX_ERRORS) {
      this.errors = this.errors.slice(-this.MAX_ERRORS);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[Permission Error] ${code}: ${message}`, details);
    }
  }

  // Get all errors
  getErrors(): PermissionError[] {
    return [...this.errors];
  }

  // Get errors by code
  getErrorsByCode(code: string): PermissionError[] {
    return this.errors.filter(error => error.code === code);
  }

  // Get recent errors (last N minutes)
  getRecentErrors(minutes: number = 5): PermissionError[] {
    const cutoff = Date.now() - (minutes * 60 * 1000);
    return this.errors.filter(error => error.timestamp > cutoff);
  }

  // Clear all errors
  clearErrors(): void {
    this.errors = [];
  }

  // Clear errors by code
  clearErrorsByCode(code: string): void {
    this.errors = this.errors.filter(error => error.code !== code);
  }

  // Get error statistics
  getErrorStats() {
    const stats = {
      total: this.errors.length,
      byCode: {} as Record<string, number>,
      recent: this.getRecentErrors().length
    };

    this.errors.forEach(error => {
      stats.byCode[error.code] = (stats.byCode[error.code] || 0) + 1;
    });

    return stats;
  }
}

// Error codes
export const PERMISSION_ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  API_ERROR: 'API_ERROR'
} as const;

// Singleton instance
export const permissionErrorHandler = PermissionErrorHandler.getInstance();

// Utility functions
export const logPermissionError = (code: string, message: string, details?: any) => {
  permissionErrorHandler.logError(code, message, details);
};

export const handleApiError = (error: any) => {
  if (error?.response?.status === 401) {
    logPermissionError(PERMISSION_ERROR_CODES.UNAUTHORIZED, 'Unauthorized access', error);
  } else if (error?.response?.status === 403) {
    logPermissionError(PERMISSION_ERROR_CODES.FORBIDDEN, 'Forbidden access', error);
  } else if (error?.code === 'NETWORK_ERROR') {
    logPermissionError(PERMISSION_ERROR_CODES.NETWORK_ERROR, 'Network error', error);
  } else {
    logPermissionError(PERMISSION_ERROR_CODES.API_ERROR, 'API error', error);
  }
};