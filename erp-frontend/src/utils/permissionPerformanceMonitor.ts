// src/utils/permissionPerformanceMonitor.ts
interface PerformanceMetric {
  operation: string;
  duration: number;
  timestamp: number;
  success: boolean;
  details?: any;
}

export class PermissionPerformanceMonitor {
  private static instance: PermissionPerformanceMonitor;
  private metrics: PerformanceMetric[] = [];
  private readonly MAX_METRICS = 1000;
  private activeOperations = new Map<string, number>();

  private constructor() {}

  static getInstance(): PermissionPerformanceMonitor {
    if (!PermissionPerformanceMonitor.instance) {
      PermissionPerformanceMonitor.instance = new PermissionPerformanceMonitor();
    }
    return PermissionPerformanceMonitor.instance;
  }

  // Start timing an operation
  startOperation(operation: string): string {
    const id = `${operation}_${Date.now()}_${Math.random()}`;
    this.activeOperations.set(id, Date.now());
    return id;
  }

  // End timing an operation
  endOperation(id: string, success: boolean = true, details?: any): void {
    const startTime = this.activeOperations.get(id);
    if (!startTime) return;

    const duration = Date.now() - startTime;
    const operation = id.split('_')[0];

    const metric: PerformanceMetric = {
      operation,
      duration,
      timestamp: Date.now(),
      success,
      details
    };

    this.metrics.push(metric);
    this.activeOperations.delete(id);

    // Keep only the last MAX_METRICS
    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics = this.metrics.slice(-this.MAX_METRICS);
    }

    // Log slow operations
    if (duration > 1000) { // More than 1 second
      console.warn(`[Performance] Slow permission operation: ${operation} took ${duration}ms`);
    }
  }

  // Get performance metrics
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  // Get metrics for specific operation
  getMetricsForOperation(operation: string): PerformanceMetric[] {
    return this.metrics.filter(metric => metric.operation === operation);
  }

  // Get performance statistics
  getPerformanceStats() {
    const stats = {
      totalOperations: this.metrics.length,
      averageDuration: 0,
      successRate: 0,
      slowOperations: 0,
      byOperation: {} as Record<string, {
        count: number;
        averageDuration: number;
        successRate: number;
      }>
    };

    if (this.metrics.length === 0) return stats;

    // Calculate overall stats
    const totalDuration = this.metrics.reduce((sum, metric) => sum + metric.duration, 0);
    stats.averageDuration = totalDuration / this.metrics.length;
    stats.successRate = (this.metrics.filter(m => m.success).length / this.metrics.length) * 100;
    stats.slowOperations = this.metrics.filter(m => m.duration > 1000).length;

    // Calculate per-operation stats
    const operations = [...new Set(this.metrics.map(m => m.operation))];
    operations.forEach(operation => {
      const opMetrics = this.metrics.filter(m => m.operation === operation);
      const opTotalDuration = opMetrics.reduce((sum, m) => sum + m.duration, 0);
      const opSuccessCount = opMetrics.filter(m => m.success).length;

      stats.byOperation[operation] = {
        count: opMetrics.length,
        averageDuration: opTotalDuration / opMetrics.length,
        successRate: (opSuccessCount / opMetrics.length) * 100
      };
    });

    return stats;
  }

  // Clear all metrics
  clearMetrics(): void {
    this.metrics = [];
    this.activeOperations.clear();
  }

  // Export metrics for analysis
  exportMetrics(): string {
    return JSON.stringify({
      metrics: this.metrics,
      stats: this.getPerformanceStats(),
      exportTime: new Date().toISOString()
    }, null, 2);
  }
}

// Singleton instance
export const permissionPerformanceMonitor = PermissionPerformanceMonitor.getInstance();

// Utility functions for performance monitoring
export const startPermissionOperation = (operation: string): string => {
  return permissionPerformanceMonitor.startOperation(operation);
};

export const endPermissionOperation = (id: string, success: boolean = true, details?: any): void => {
  permissionPerformanceMonitor.endOperation(id, success, details);
};

// Higher-order function to monitor permission operations
export const withPerformanceMonitoring = <T extends any[], R>(
  operation: string,
  fn: (...args: T) => R
) => {
  return (...args: T): R => {
    const id = startPermissionOperation(operation);
    try {
      const result = fn(...args);
      endPermissionOperation(id, true);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      endPermissionOperation(id, false, { error: errorMessage });
      throw error;
    }
  };
};