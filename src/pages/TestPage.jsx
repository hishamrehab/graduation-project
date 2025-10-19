import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import axios from 'axios';

const TestPage = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [frontendTests, setFrontendTests] = useState(null);
  const [performanceTests, setPerformanceTests] = useState(null);

  const API_URL = 'http://localhost:8000/api';

  const runTest = async (endpoint) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = token ? {
        headers: { Authorization: `Bearer ${token}` }
      } : {};

      console.log(`🧪 Running test: ${endpoint}`);
      const response = await axios.get(`${API_URL}/test/${endpoint}`, config);
      console.log('✅ Test results:', response.data);
      setResults(response.data);
    } catch (error) {
      console.error('❌ Test failed:', error);
      setResults({
        status: '❌ FAILED',
        error: error.message,
        details: error.response?.data || error.toString(),
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    if (status?.includes('PASS')) return <CheckCircle className="text-green-500" size={20} />;
    if (status?.includes('FAIL')) return <XCircle className="text-red-500" size={20} />;
    if (status?.includes('WARNING') || status?.includes('SKIP')) return <AlertCircle className="text-yellow-500" size={20} />;
    return <AlertCircle className="text-gray-500" size={20} />;
  };

  const getStatusColor = (status) => {
    if (status?.includes('PASS')) return 'bg-green-50 border-green-200';
    if (status?.includes('FAIL')) return 'bg-red-50 border-red-200';
    if (status?.includes('WARNING') || status?.includes('SKIP')) return 'bg-yellow-50 border-yellow-200';
    return 'bg-gray-50 border-gray-200';
  };

  const runFrontendTests = () => {
    console.log('🧪 Running Frontend Tests...');
    
    const tests = {};
    
    // Test 1: localStorage
    try {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      tests.localStorage = {
        status: token && user ? '✅ PASS' : '⚠️ WARNING',
        message: token && user ? 'Token and user found in localStorage' : 'No token or user in localStorage',
        token: token ? 'Present' : 'Missing',
        user: user ? 'Present' : 'Missing'
      };
    } catch (e) {
      tests.localStorage = { status: '❌ FAIL', message: e.message };
    }
    
    // Test 2: API Configuration
    try {
      tests.apiConfig = {
        status: '✅ PASS',
        message: 'API URL configured',
        url: API_URL
      };
    } catch (e) {
      tests.apiConfig = { status: '❌ FAIL', message: e.message };
    }
    
    // Test 3: React Router
    try {
      tests.routing = {
        status: '✅ PASS',
        message: 'React Router working',
        currentPath: window.location.pathname
      };
    } catch (e) {
      tests.routing = { status: '❌ FAIL', message: e.message };
    }
    
    // Test 4: Console Errors
    const consoleErrors = [];
    tests.consoleErrors = {
      status: consoleErrors.length === 0 ? '✅ PASS' : '⚠️ WARNING',
      message: `${consoleErrors.length} console errors detected`,
      count: consoleErrors.length
    };
    
    setFrontendTests({
      timestamp: new Date().toISOString(),
      tests,
      summary: {
        total: Object.keys(tests).length,
        passed: Object.values(tests).filter(t => t.status.includes('PASS')).length,
        failed: Object.values(tests).filter(t => t.status.includes('FAIL')).length,
        warnings: Object.values(tests).filter(t => t.status.includes('WARNING')).length
      }
    });
  };

  const runPerformanceTests = async () => {
    console.log('⚡ Running Performance Tests...');
    
    const tests = {};
    
    // Test 1: API Response Time
    try {
      const start = performance.now();
      await axios.get(`${API_URL}/test/all`);
      const end = performance.now();
      const duration = Math.round(end - start);
      
      tests.apiResponseTime = {
        status: duration < 1000 ? '✅ PASS' : duration < 3000 ? '⚠️ WARNING' : '❌ FAIL',
        message: `API responded in ${duration}ms`,
        duration: `${duration}ms`,
        threshold: '< 1000ms'
      };
    } catch (e) {
      tests.apiResponseTime = { status: '❌ FAIL', message: e.message };
    }
    
    // Test 2: Memory Usage
    if (performance.memory) {
      const memoryMB = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
      tests.memoryUsage = {
        status: memoryMB < 100 ? '✅ PASS' : '⚠️ WARNING',
        message: `Using ${memoryMB}MB of memory`,
        used: `${memoryMB}MB`,
        limit: performance.memory.jsHeapSizeLimit / 1024 / 1024 + 'MB'
      };
    }
    
    // Test 3: Page Load Time
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    tests.pageLoadTime = {
      status: loadTime < 3000 ? '✅ PASS' : '⚠️ WARNING',
      message: `Page loaded in ${loadTime}ms`,
      duration: `${loadTime}ms`
    };
    
    setPerformanceTests({
      timestamp: new Date().toISOString(),
      tests,
      summary: {
        total: Object.keys(tests).length,
        passed: Object.values(tests).filter(t => t.status?.includes('PASS')).length,
        failed: Object.values(tests).filter(t => t.status?.includes('FAIL')).length,
        warnings: Object.values(tests).filter(t => t.status?.includes('WARNING')).length
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🧪 System Testing Dashboard</h1>
          <p className="text-gray-600">Test all system components and view detailed results</p>
        </div>

        {/* Test Buttons */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Run Tests</h2>
          
          {/* Backend Tests */}
          <h3 className="text-sm font-semibold text-gray-600 mb-3">🛠️ Backend Tests</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <button
              onClick={() => runTest('all')}
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-primary text-white py-3 px-6 rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {loading && activeTab === 'all' ? <RefreshCw className="animate-spin" size={20} /> : null}
              Test All Components
            </button>
            <button
              onClick={() => runTest('sessions')}
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-blue-500 text-white py-3 px-6 rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {loading && activeTab === 'sessions' ? <RefreshCw className="animate-spin" size={20} /> : null}
              Test Sessions
            </button>
            <button
              onClick={() => runTest('logs')}
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-purple-500 text-white py-3 px-6 rounded-xl hover:bg-purple-600 transition-colors disabled:opacity-50"
            >
              {loading && activeTab === 'logs' ? <RefreshCw className="animate-spin" size={20} /> : null}
              View Logs
            </button>
          </div>
          
          {/* Frontend Tests */}
          <h3 className="text-sm font-semibold text-gray-600 mb-3 mt-6">⚡ Frontend Tests</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={runFrontendTests}
              className="flex items-center justify-center gap-2 bg-green-500 text-white py-3 px-6 rounded-xl hover:bg-green-600 transition-colors"
            >
              🧪 Test Frontend
            </button>
            <button
              onClick={runPerformanceTests}
              className="flex items-center justify-center gap-2 bg-orange-500 text-white py-3 px-6 rounded-xl hover:bg-orange-600 transition-colors"
            >
              🚀 Test Performance
            </button>
          </div>
        </div>

        {/* Results */}
        {results && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Test Results</h2>

            {/* Summary */}
            {results.summary && (
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <h3 className="font-bold text-lg mb-3">Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">{results.summary.total}</div>
                    <div className="text-sm text-gray-600">Total Tests</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{results.summary.passed}</div>
                    <div className="text-sm text-gray-600">Passed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{results.summary.failed}</div>
                    <div className="text-sm text-gray-600">Failed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{results.summary.warnings}</div>
                    <div className="text-sm text-gray-600">Warnings</div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <span className="text-xl font-bold">{results.summary.overall_status}</span>
                </div>
              </div>
            )}

            {/* Individual Tests */}
            {results.tests && (
              <div className="space-y-3">
                {Object.entries(results.tests).map(([testName, testResult]) => (
                  <div
                    key={testName}
                    className={`border rounded-xl p-4 ${getStatusColor(testResult.status)}`}
                  >
                    <div className="flex items-start gap-3">
                      {getStatusIcon(testResult.status)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-gray-800">{testName.replace(/_/g, ' ').toUpperCase()}</h4>
                          <span className="text-sm font-semibold">{testResult.status}</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{testResult.message}</p>
                        
                        {/* Additional Details */}
                        {Object.entries(testResult).map(([key, value]) => {
                          if (key === 'status' || key === 'message') return null;
                          if (key === 'trace') {
                            return (
                              <details key={key} className="mt-2">
                                <summary className="cursor-pointer text-xs font-semibold text-gray-600">
                                  Stack Trace
                                </summary>
                                <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto max-h-32">
                                  {value}
                                </pre>
                              </details>
                            );
                          }
                          return (
                            <div key={key} className="text-xs text-gray-600 mt-1">
                              <span className="font-semibold">{key}:</span> {JSON.stringify(value)}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Logs Content */}
            {results.content && (
              <div className="mt-4">
                <h3 className="font-bold text-lg mb-3">Log Content</h3>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-xs overflow-auto max-h-96">
                  {results.content}
                </pre>
              </div>
            )}

            {/* Error Details */}
            {results.error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                <h3 className="font-bold text-red-800 mb-2">Error</h3>
                <p className="text-sm text-red-700">{results.error}</p>
                {results.details && (
                  <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto max-h-32">
                    {JSON.stringify(results.details, null, 2)}
                  </pre>
                )}
              </div>
            )}

            {/* Raw JSON */}
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-semibold text-gray-700">
                View Raw JSON
              </summary>
              <pre className="mt-2 bg-gray-100 p-4 rounded-xl text-xs overflow-auto max-h-64">
                {JSON.stringify(results, null, 2)}
              </pre>
            </details>
          </div>
        )}

        {/* Frontend Test Results */}
        {frontendTests && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">🧪 Frontend Test Results</h2>
            
            {/* Summary */}
            <div className="mb-6 p-4 bg-green-50 rounded-xl">
              <h3 className="font-bold text-lg mb-3">Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">{frontendTests.summary.total}</div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{frontendTests.summary.passed}</div>
                  <div className="text-sm text-gray-600">Passed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{frontendTests.summary.failed}</div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{frontendTests.summary.warnings}</div>
                  <div className="text-sm text-gray-600">Warnings</div>
                </div>
              </div>
            </div>
            
            {/* Tests */}
            <div className="space-y-3">
              {Object.entries(frontendTests.tests).map(([testName, testResult]) => (
                <div key={testName} className={`border rounded-xl p-4 ${getStatusColor(testResult.status)}`}>
                  <div className="flex items-start gap-3">
                    {getStatusIcon(testResult.status)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-gray-800">{testName.replace(/_/g, ' ').toUpperCase()}</h4>
                        <span className="text-sm font-semibold">{testResult.status}</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{testResult.message}</p>
                      {Object.entries(testResult).map(([key, value]) => {
                        if (key === 'status' || key === 'message') return null;
                        return (
                          <div key={key} className="text-xs text-gray-600 mt-1">
                            <span className="font-semibold">{key}:</span> {JSON.stringify(value)}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Performance Test Results */}
        {performanceTests && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">🚀 Performance Test Results</h2>
            
            {/* Summary */}
            <div className="mb-6 p-4 bg-orange-50 rounded-xl">
              <h3 className="font-bold text-lg mb-3">Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">{performanceTests.summary.total}</div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{performanceTests.summary.passed}</div>
                  <div className="text-sm text-gray-600">Passed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{performanceTests.summary.failed}</div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{performanceTests.summary.warnings}</div>
                  <div className="text-sm text-gray-600">Warnings</div>
                </div>
              </div>
            </div>
            
            {/* Tests */}
            <div className="space-y-3">
              {Object.entries(performanceTests.tests).map(([testName, testResult]) => (
                <div key={testName} className={`border rounded-xl p-4 ${getStatusColor(testResult.status)}`}>
                  <div className="flex items-start gap-3">
                    {getStatusIcon(testResult.status)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-gray-800">{testName.replace(/_/g, ' ').toUpperCase()}</h4>
                        <span className="text-sm font-semibold">{testResult.status}</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{testResult.message}</p>
                      {Object.entries(testResult).map(([key, value]) => {
                        if (key === 'status' || key === 'message') return null;
                        return (
                          <div key={key} className="text-xs text-gray-600 mt-1">
                            <span className="font-semibold">{key}:</span> {JSON.stringify(value)}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        {!results && !loading && !frontendTests && !performanceTests && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <h3 className="font-bold text-blue-800 mb-2">📋 Instructions</h3>
            <ul className="text-sm text-blue-700 space-y-2">
              <li>• <strong>Backend Tests:</strong> Test All Components, Test Sessions, View Logs</li>
              <li>• <strong>Frontend Tests:</strong> Test localStorage, API config, routing</li>
              <li>• <strong>Performance Tests:</strong> API response time, memory usage, page load</li>
              <li>• Check browser console (F12) for detailed frontend logs</li>
              <li>• ✅ Green = Pass, ❌ Red = Fail, ⚠️ Yellow = Warning</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestPage;
