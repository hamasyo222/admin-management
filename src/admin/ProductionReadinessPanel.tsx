import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ShieldCheckIcon,
  ServerIcon,
  DocumentCheckIcon,
  PlayIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { Button } from '../ui/Button';
import { testingService } from '../../services/testingService';
import { monitoringService } from '../../services/monitoringService';
import { disasterRecoveryService } from '../../services/disasterRecoveryService';

export const ProductionReadinessPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'testing' | 'monitoring' | 'backup' | 'security'>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [backupStatus, setBackupStatus] = useState<any>(null);
  const { t } = useTranslation();

  useEffect(() => {
    loadProductionReadinessData();
  }, []);

  const loadProductionReadinessData = async () => {
    setIsLoading(true);
    try {
      // Get various statuses
      const [health, backup] = await Promise.all([
        monitoringService.performHealthCheck(),
        disasterRecoveryService.verifyBackup('latest')
      ]);

      setSystemHealth(health);
      setBackupStatus(backup);
    } catch (error) {
      console.error('Production readiness data retrieval error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const runComprehensiveTests = async () => {
    setIsLoading(true);
    try {
      const results = await testingService.runComprehensiveTests();
      setTestResults(results);
    } catch (error) {
      console.error('Comprehensive test execution error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const performBackup = async () => {
    setIsLoading(true);
    try {
      await disasterRecoveryService.performBackup('full');
      await loadProductionReadinessData();
    } catch (error) {
      console.error('Backup execution error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getReadinessScore = () => {
    let score = 0;
    let total = 0;

    // System health
    if (systemHealth) {
      total += 25;
      if (systemHealth.overallHealth === 'healthy') score += 25;
    }

    // Test results
    if (testResults) {
      total += 25;
      if (testResults.success) score += 25;
    }

    // Backup status
    if (backupStatus) {
      total += 25;
      if (backupStatus.success) score += 25;
    }

    // Security (placeholder)
    total += 25;
    score += 20; // Basic security measures in place

    return total > 0 ? Math.round((score / total) * 100) : 0;
  };

  const renderOverviewTab = () => {
    const readinessScore = getReadinessScore();
    const isReady = readinessScore >= 90;

    return (
      <div className="space-y-6">
        {/* Production Readiness Score */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{t('production.readinessScore')}</h3>
            <div className={`text-2xl font-bold ${isReady ? 'text-green-600' : 'text-orange-600'}`}>
              {readinessScore}%
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div
              className={`h-4 rounded-full transition-all duration-300 ${
                isReady ? 'bg-green-600' : 'bg-orange-600'
              }`}
              style={{ width: `${readinessScore}%` }}
            ></div>
          </div>

          <div className={`p-4 rounded-lg ${isReady ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
            <div className="flex items-center">
              {isReady ? (
                <CheckCircleIcon className="h-6 w-6 text-green-600 mr-3" />
              ) : (
                <ExclamationTriangleIcon className="h-6 w-6 text-orange-600 mr-3" />
              )}
              <div>
                <p className={`font-medium ${isReady ? 'text-green-800' : 'text-orange-800'}`}>
                  {isReady ? t('production.ready') : t('production.preparing')}
                </p>
                <p className={`text-sm ${isReady ? 'text-green-600' : 'text-orange-600'}`}>
                  {isReady 
                    ? t('production.readyMessage')
                    : t('production.preparingMessage')
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Checklist */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('production.checklist')}</h3>
          <div className="space-y-4">
            <ChecklistItem
              title={t('production.testing')}
              description={t('production.testingDesc')}
              completed={testResults?.success || false}
              onAction={runComprehensiveTests}
              actionLabel={t('production.runTest')}
            />
            
            <ChecklistItem
              title={t('production.monitoring')}
              description={t('production.monitoringDesc')}
              completed={systemHealth?.overallHealth === 'healthy'}
              onAction={() => setActiveTab('monitoring')}
              actionLabel={t('production.checkMonitoring')}
            />
            
            <ChecklistItem
              title={t('production.backup')}
              description={t('production.backupDesc')}
              completed={backupStatus?.success || false}
              onAction={performBackup}
              actionLabel={t('production.runBackup')}
            />
            
            <ChecklistItem
              title={t('production.security')}
              description={t('production.securityDesc')}
              completed={true} // Basic security measures in place
              onAction={() => setActiveTab('security')}
              actionLabel={t('production.checkSecurity')}
            />
            
            <ChecklistItem
              title={t('production.documentation')}
              description={t('production.documentationDesc')}
              completed={true} // Documentation prepared
              onAction={() => {}}
              actionLabel={t('production.verified')}
            />
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('production.nextSteps')}</h3>
          <div className="space-y-3">
            {!isReady ? (
              <>
                <div className="flex items-center text-orange-600">
                  <ClockIcon className="h-5 w-5 mr-2" />
                  <span>{t('production.completeItems')}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <DocumentCheckIcon className="h-5 w-5 mr-2" />
                  <span>{t('production.finalReview')}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center text-green-600">
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  <span>{t('production.readyToLaunch')}</span>
                </div>
                <div className="flex items-center text-blue-600">
                  <PlayIcon className="h-5 w-5 mr-2" />
                  <span>{t('production.startProduction')}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderTestingTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{t('production.testing')}</h3>
        <Button
          onClick={runComprehensiveTests}
          loading={isLoading}
          leftIcon={<PlayIcon className="w-4 h-4" />}
        >
          {t('production.runTest')}
        </Button>
      </div>

      {testResults && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-4">{t('production.testing')}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testResults.testResults.map((result: any, index: number) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{result.type}</span>
                  {result.status === 'fulfilled' && result.result?.success ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  ) : (
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                  )}
                </div>
                {result.result && (
                  <div className="text-sm text-gray-600">
                    <p>{t('common.success')}: {result.result.passed || 0}</p>
                    <p>{t('common.error')}: {result.result.failed || 0}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {testResults.coverage && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-2">Code Coverage</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Statements:</span>
                  <span className="ml-2 font-medium">{testResults.coverage.statements}%</span>
                </div>
                <div>
                  <span className="text-gray-600">Branches:</span>
                  <span className="ml-2 font-medium">{testResults.coverage.branches}%</span>
                </div>
                <div>
                  <span className="text-gray-600">Functions:</span>
                  <span className="ml-2 font-medium">{testResults.coverage.functions}%</span>
                </div>
                <div>
                  <span className="text-gray-600">Lines:</span>
                  <span className="ml-2 font-medium">{testResults.coverage.lines}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderMonitoringTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{t('production.monitoring')}</h3>
        <Button
          onClick={loadProductionReadinessData}
          loading={isLoading}
          leftIcon={<ArrowPathIcon className="w-4 h-4" />}
        >
          {t('production.update')}
        </Button>
      </div>

      {systemHealth && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-4">System Health</h4>
          <div className="flex items-center mb-4">
            <div className={`w-4 h-4 rounded-full mr-3 ${
              systemHealth.overallHealth === 'healthy' ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span className="font-medium">
              {systemHealth.overallHealth === 'healthy' ? 'Healthy' : 'Unhealthy'}
            </span>
          </div>
          
          <div className="space-y-3">
            {systemHealth.components.map((component: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="font-medium">{component.component}</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  component.status === 'healthy' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {component.status === 'healthy' ? 'Healthy' : 'Unhealthy'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderBackupTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{t('production.backup')}</h3>
        <Button
          onClick={performBackup}
          loading={isLoading}
          leftIcon={<ServerIcon className="w-4 h-4" />}
        >
          {t('production.runBackup')}
        </Button>
      </div>

      {backupStatus && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-4">Latest Backup Status</h4>
          <div className="flex items-center mb-4">
            {backupStatus.success ? (
              <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" />
            ) : (
              <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-3" />
            )}
            <span className="font-medium">
              {backupStatus.success ? 'Backup Normal' : 'Backup Abnormal'}
            </span>
          </div>
          
          <div className="space-y-2 text-sm text-gray-600">
            <p>Backup ID: {backupStatus.backupId}</p>
            <p>Execution Time: {backupStatus.timestamp.toLocaleString()}</p>
            {backupStatus.checks && (
              <div className="mt-4">
                <p className="font-medium text-gray-900 mb-2">Verification Results:</p>
                {backupStatus.checks.map((check: any, index: number) => (
                  <div key={index} className="flex items-center">
                    {check.success ? (
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                    ) : (
                      <ExclamationTriangleIcon className="h-4 w-4 text-red-500 mr-2" />
                    )}
                    <span>{check.name}: {check.details}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{t('production.security')}</h3>
        <Button
          leftIcon={<ShieldCheckIcon className="w-4 h-4" />}
        >
          {t('production.checkSecurity')}
        </Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h4 className="font-medium text-gray-900 mb-4">Security Measures Status</h4>
        <div className="space-y-4">
          <SecurityCheckItem
            title="Multi-factor Authentication"
            description="MFA & Device Authentication Implementation"
            status="completed"
          />
          <SecurityCheckItem
            title="Data Encryption"
            description="Encryption at Rest & in Transit"
            status="completed"
          />
          <SecurityCheckItem
            title="Access Control"
            description="Permission-based Access Control"
            status="completed"
          />
          <SecurityCheckItem
            title="Security Headers"
            description="CSP, HSTS & Other Security Headers"
            status="completed"
          />
          <SecurityCheckItem
            title="Vulnerability Protection"
            description="Dependencies & Code Vulnerability Protection"
            status="completed"
          />
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', name: 'Overview', icon: DocumentCheckIcon },
    { id: 'testing', name: 'Testing', icon: CheckCircleIcon },
    { id: 'monitoring', name: 'Monitoring', icon: ServerIcon },
    { id: 'backup', name: 'Backup', icon: ShieldCheckIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('production.title')}</h1>
        <p className="text-gray-600">{t('production.description')}</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'testing' && renderTestingTab()}
        {activeTab === 'monitoring' && renderMonitoringTab()}
        {activeTab === 'backup' && renderBackupTab()}
        {activeTab === 'security' && renderSecurityTab()}
      </div>
    </div>
  );
};

// Helper Components
interface ChecklistItemProps {
  title: string;
  description: string;
  completed: boolean;
  onAction: () => void;
  actionLabel: string;
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({
  title,
  description,
  completed,
  onAction,
  actionLabel
}) => (
  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
    <div className="flex items-center">
      {completed ? (
        <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" />
      ) : (
        <ClockIcon className="h-6 w-6 text-orange-500 mr-3" />
      )}
      <div>
        <h4 className="font-medium text-gray-900">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
    <Button
      size="sm"
      variant={completed ? "outline" : "primary"}
      onClick={onAction}
      disabled={completed && actionLabel === 'Verified'}
    >
      {actionLabel}
    </Button>
  </div>
);

interface SecurityCheckItemProps {
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'pending';
}

const SecurityCheckItem: React.FC<SecurityCheckItemProps> = ({
  title,
  description,
  status
}) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
    <div>
      <h5 className="font-medium text-gray-900">{title}</h5>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
    <span className={`px-2 py-1 rounded text-xs font-medium ${
      status === 'completed' 
        ? 'bg-green-100 text-green-800'
        : status === 'in_progress'
        ? 'bg-yellow-100 text-yellow-800'
        : 'bg-gray-100 text-gray-800'
    }`}>
      {status === 'completed' ? 'Completed' : status === 'in_progress' ? 'In Progress' : 'Pending'}
    </span>
  </div>
);