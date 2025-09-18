// src/pages/Performance/PerformanceDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, TrendingUp, Clock, CheckCircle, Download } from 'lucide-react';
import { permissionPerformanceMonitor } from '@/utils/permissionPerformanceMonitor';
import { permissionAlertSystem, usePermissionAlerts } from '@/utils/permissionAlertSystem';
import { permissionErrorHandler } from '@/utils/permissionErrorHandler';

const PerformanceDashboard: React.FC = () => {
  const [performanceStats, setPerformanceStats] = useState<any>(null);
  const [errorStats, setErrorStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'performance' | 'alerts' | 'errors'>('performance');
  const { alerts, unacknowledgedAlerts, acknowledgeAlert, acknowledgeAll, stats: alertStats } = usePermissionAlerts();

  useEffect(() => {
    const updateStats = () => {
      setPerformanceStats(permissionPerformanceMonitor.getPerformanceStats());
      setErrorStats(permissionErrorHandler.getErrorStats());
    };

    updateStats();
    const interval = setInterval(updateStats, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const exportData = () => {
    const data = {
      performance: permissionPerformanceMonitor.exportMetrics(),
      alerts: permissionAlertSystem.exportAlerts(),
      errors: JSON.stringify(errorStats),
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `permission-performance-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  if (!performanceStats || !errorStats) {
    return <div className="p-6">Loading performance data...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Permission Performance Dashboard</h1>
        <Button onClick={exportData} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Operations</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceStats.totalOperations}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDuration(performanceStats.averageDuration)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceStats.successRate.toFixed(1)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alertStats.unacknowledged}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('performance')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'performance'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Performance
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'alerts'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Alerts ({alertStats.unacknowledged})
          </button>
          <button
            onClick={() => setActiveTab('errors')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'errors'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Errors
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'performance' && (
          <Card>
            <CardHeader>
              <CardTitle>Operation Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(performanceStats.byOperation).map(([operation, stats]: [string, any]) => (
                  <div key={operation} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{operation}</h3>
                      <p className="text-sm text-muted-foreground">
                        {stats.count} operations • {stats.successRate.toFixed(1)}% success rate
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatDuration(stats.averageDuration)}</div>
                      <div className="text-sm text-muted-foreground">avg duration</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Active Alerts</h2>
              {unacknowledgedAlerts.length > 0 && (
                <Button onClick={acknowledgeAll} variant="outline">
                  Acknowledge All
                </Button>
              )}
            </div>

            <div className="space-y-2">
              {alerts.map((alert) => (
                <Card key={alert.id} className={`border-l-4 ${getSeverityColor(alert.severity)}`}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(alert.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="font-medium">{alert.message}</p>
                        {!alert.acknowledged && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-2"
                            onClick={() => acknowledgeAlert(alert.id)}
                          >
                            Acknowledge
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {alerts.length === 0 && (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                  <p>No alerts at this time</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'errors' && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Error Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{errorStats.total}</div>
                    <div className="text-sm text-muted-foreground">Total Errors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{errorStats.byType.api || 0}</div>
                    <div className="text-sm text-muted-foreground">API Errors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{errorStats.byType.permission || 0}</div>
                    <div className="text-sm text-muted-foreground">Permission Errors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{errorStats.recent}</div>
                    <div className="text-sm text-muted-foreground">Recent Errors</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Errors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {errorStats.errors.slice(0, 10).map((error: any, index: number) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="destructive">{error.type}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(error.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm font-medium">{error.message}</p>
                      <p className="text-xs text-muted-foreground">{error.context}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceDashboard;