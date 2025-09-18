// src/utils/permissionAlertSystem.ts
import { permissionPerformanceMonitor } from './permissionPerformanceMonitor';
import { permissionErrorHandler } from './permissionErrorHandler';

export interface AlertRule {
  id: string;
  name: string;
  condition: (metrics: any) => boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  enabled: boolean;
}

export interface Alert {
  id: string;
  ruleId: string;
  timestamp: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  details: any;
  acknowledged: boolean;
}

export class PermissionAlertSystem {
  private static instance: PermissionAlertSystem;
  private alerts: Alert[] = [];
  private rules: AlertRule[] = [];
  private readonly MAX_ALERTS = 500;
  private checkInterval: NodeJS.Timeout | null = null;
  private readonly CHECK_INTERVAL = 30000; // 30 seconds

  private constructor() {
    this.initializeDefaultRules();
  }

  static getInstance(): PermissionAlertSystem {
    if (!PermissionAlertSystem.instance) {
      PermissionAlertSystem.instance = new PermissionAlertSystem();
    }
    return PermissionAlertSystem.instance;
  }

  private initializeDefaultRules(): void {
    this.rules = [
      {
        id: 'high-error-rate',
        name: 'High Error Rate',
        condition: (stats) => stats.successRate < 90,
        severity: 'high',
        message: 'Permission operation success rate is below 90%',
        enabled: true
      },
      {
        id: 'slow-operations',
        name: 'Slow Operations',
        condition: (stats) => stats.averageDuration > 2000,
        severity: 'medium',
        message: 'Average permission operation duration exceeds 2 seconds',
        enabled: true
      },
      {
        id: 'critical-failures',
        name: 'Critical Failures',
        condition: (stats) => {
          const recentMetrics = permissionPerformanceMonitor.getMetrics()
            .filter(m => Date.now() - m.timestamp < 300000); // Last 5 minutes
          const criticalFailures = recentMetrics.filter(m => !m.success && m.operation === 'checkPermission');
          return criticalFailures.length > 5;
        },
        severity: 'critical',
        message: 'More than 5 critical permission failures in the last 5 minutes',
        enabled: true
      },
      {
        id: 'memory-usage',
        name: 'High Memory Usage',
        condition: () => {
          // Check if performance.memory is available
          if ('memory' in performance) {
            const memInfo = (performance as any).memory;
            const usedPercent = (memInfo.usedJSHeapSize / memInfo.totalJSHeapSize) * 100;
            return usedPercent > 80;
          }
          return false;
        },
        severity: 'medium',
        message: 'Memory usage exceeds 80%',
        enabled: true
      }
    ];
  }

  // Add a custom alert rule
  addRule(rule: Omit<AlertRule, 'id'>): string {
    const id = `rule_${Date.now()}_${Math.random()}`;
    this.rules.push({ ...rule, id });
    return id;
  }

  // Remove an alert rule
  removeRule(ruleId: string): boolean {
    const index = this.rules.findIndex(rule => rule.id === ruleId);
    if (index !== -1) {
      this.rules.splice(index, 1);
      return true;
    }
    return false;
  }

  // Enable or disable a rule
  toggleRule(ruleId: string, enabled: boolean): boolean {
    const rule = this.rules.find(r => r.id === ruleId);
    if (rule) {
      rule.enabled = enabled;
      return true;
    }
    return false;
  }

  // Check all rules and generate alerts
  private checkRules(): void {
    const stats = permissionPerformanceMonitor.getPerformanceStats();

    this.rules.forEach(rule => {
      if (!rule.enabled) return;

      try {
        if (rule.condition(stats)) {
          this.createAlert(rule, stats);
        }
      } catch (error) {
        console.error(`Error checking rule ${rule.id}:`, error);
      }
    });
  }

  // Create a new alert
  private createAlert(rule: AlertRule, details: any): void {
    const alert: Alert = {
      id: `alert_${Date.now()}_${Math.random()}`,
      ruleId: rule.id,
      timestamp: Date.now(),
      severity: rule.severity,
      message: rule.message,
      details,
      acknowledged: false
    };

    this.alerts.push(alert);

    // Keep only the last MAX_ALERTS
    if (this.alerts.length > this.MAX_ALERTS) {
      this.alerts = this.alerts.slice(-this.MAX_ALERTS);
    }

    // Log critical alerts
    if (rule.severity === 'critical') {
      console.error(`[CRITICAL ALERT] ${rule.message}`, details);
      permissionErrorHandler.logError(
        new Error(`Critical Alert: ${rule.message}`),
        'PermissionAlertSystem',
        { alert, details }
      );
    }

    // Emit alert event (if in browser environment)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('permissionAlert', { detail: alert }));
    }
  }

  // Get all alerts
  getAlerts(): Alert[] {
    return [...this.alerts];
  }

  // Get unacknowledged alerts
  getUnacknowledgedAlerts(): Alert[] {
    return this.alerts.filter(alert => !alert.acknowledged);
  }

  // Acknowledge an alert
  acknowledgeAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      return true;
    }
    return false;
  }

  // Acknowledge all alerts
  acknowledgeAllAlerts(): void {
    this.alerts.forEach(alert => alert.acknowledged = true);
  }

  // Clear old alerts (older than specified days)
  clearOldAlerts(days: number = 7): void {
    const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000);
    this.alerts = this.alerts.filter(alert => alert.timestamp > cutoffTime);
  }

  // Start monitoring
  startMonitoring(): void {
    if (this.checkInterval) return;

    this.checkInterval = setInterval(() => {
      this.checkRules();
    }, this.CHECK_INTERVAL);

    console.log('[PermissionAlertSystem] Monitoring started');
  }

  // Stop monitoring
  stopMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
      console.log('[PermissionAlertSystem] Monitoring stopped');
    }
  }

  // Get alert statistics
  getAlertStats() {
    const stats = {
      total: this.alerts.length,
      unacknowledged: this.alerts.filter(a => !a.acknowledged).length,
      bySeverity: {
        low: this.alerts.filter(a => a.severity === 'low').length,
        medium: this.alerts.filter(a => a.severity === 'medium').length,
        high: this.alerts.filter(a => a.severity === 'high').length,
        critical: this.alerts.filter(a => a.severity === 'critical').length
      },
      recent: this.alerts.filter(a => Date.now() - a.timestamp < 3600000).length // Last hour
    };
    return stats;
  }

  // Export alerts for analysis
  exportAlerts(): string {
    return JSON.stringify({
      alerts: this.alerts,
      rules: this.rules,
      stats: this.getAlertStats(),
      exportTime: new Date().toISOString()
    }, null, 2);
  }
}

// Singleton instance
export const permissionAlertSystem = PermissionAlertSystem.getInstance();

// React hook for using alerts
export const usePermissionAlerts = () => {
  const [alerts, setAlerts] = React.useState<Alert[]>([]);

  React.useEffect(() => {
    const updateAlerts = () => {
      setAlerts(permissionAlertSystem.getAlerts());
    };

    updateAlerts();

    const handleAlert = () => {
      updateAlerts();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('permissionAlert', handleAlert);
      return () => window.removeEventListener('permissionAlert', handleAlert);
    }
  }, []);

  return {
    alerts,
    unacknowledgedAlerts: alerts.filter(a => !a.acknowledged),
    acknowledgeAlert: (alertId: string) => {
      permissionAlertSystem.acknowledgeAlert(alertId);
      setAlerts(permissionAlertSystem.getAlerts());
    },
    acknowledgeAll: () => {
      permissionAlertSystem.acknowledgeAllAlerts();
      setAlerts(permissionAlertSystem.getAlerts());
    },
    stats: permissionAlertSystem.getAlertStats()
  };
};