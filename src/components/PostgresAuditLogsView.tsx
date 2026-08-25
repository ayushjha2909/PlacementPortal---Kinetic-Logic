import React, { useState, useEffect } from 'react';
import { Database, RefreshCw, CheckCircle2, LogIn, LogOut, ArrowRightLeft, Search, AlertCircle, ShieldCheck } from 'lucide-react';

interface AuthLogItem {
  id: string | number;
  userId: string;
  email: string;
  name: string;
  role: string;
  eventType: 'LOGIN' | 'LOGOUT' | 'SESSION_REFRESH' | 'ROLE_SWITCH' | 'PASSWORD_RESET' | string;
  ipAddress: string;
  userAgent: string;
  status: 'SUCCESS' | 'FAILURE' | string;
  metadata?: any;
  timestamp: string;
}

interface DbStatus {
  connected: boolean;
  databaseType: string;
  configuredHost: string;
  databaseName: string;
  totalMemoryLogs: number;
}

export const PostgresAuditLogsView: React.FC = () => {
  const [logs, setLogs] = useState<AuthLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dbStatus, setDbStatus] = useState<DbStatus | null>(null);
  const [source, setSource] = useState<string>('loading');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchLogsAndStatus = async () => {
    try {
      setRefreshing(true);
      const [logsRes, statusRes] = await Promise.all([
        fetch('/api/auth/logs?limit=50'),
        fetch('/api/db/status')
      ]);

      if (logsRes.ok) {
        const data = await logsRes.json();
        setLogs(data.logs || []);
        setSource(data.source || 'memory');
      }

      if (statusRes.ok) {
        const statusData = await statusRes.json();
        setDbStatus(statusData);
      }
    } catch (err) {
      console.warn('Error fetching PostgreSQL auth logs:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLogsAndStatus();
    const interval = setInterval(fetchLogsAndStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesFilter = filterType === 'ALL' || log.eventType === filterType;
    const matchesSearch = 
      log.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ipAddress.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  const getEventBadge = (eventType: string) => {
    switch (eventType) {
      case 'LOGIN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <LogIn className="w-3 h-3" /> Logged In
          </span>
        );
      case 'LOGOUT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <LogOut className="w-3 h-3" /> Logged Out
          </span>
        );
      case 'ROLE_SWITCH':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <ArrowRightLeft className="w-3 h-3" /> Role Switched
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            {eventType}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Database Connection Status Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
            dbStatus?.connected ? 'bg-sky-100 text-sky-700' : 'bg-amber-100 text-amber-700'
          }`}>
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">PostgreSQL (Cloud SQL) Session &amp; Auth Store</h2>
              <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border ${
                dbStatus?.connected 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                {dbStatus?.connected ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    PostgreSQL Active (Drizzle ORM &amp; pg pool)
                  </>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    Local Store Active
                  </>
                )}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Strict relational session tracking across candidate logins, sign-outs, and role transitions powered by Drizzle ORM and Cloud SQL.
            </p>
          </div>
        </div>

        <button
          onClick={fetchLogsAndStatus}
          disabled={refreshing}
          className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh Feed
        </button>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, email, IP..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {['ALL', 'LOGIN', 'LOGOUT', 'ROLE_SWITCH'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                filterType === type
                  ? 'bg-indigo-600 text-white shadow-2xs font-semibold'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {type === 'ALL' ? 'All Events' : type.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900">
            PostgreSQL Audit Table (`auth_logs`) — {filteredLogs.length} Records
          </span>
          <span className="text-[11px] text-slate-500">
            Storage Engine: <strong className="text-slate-800">{source === 'postgresql' ? 'Cloud SQL PostgreSQL' : 'Memory Buffer'}</strong>
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" /> Querying PostgreSQL audit records...
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            No audit records matching the current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Event Type</th>
                  <th className="py-3 px-4">Client / IP</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-bold text-slate-900 block">{log.name}</span>
                        <span className="text-slate-500 text-[11px]">{log.email}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-md uppercase ${
                        log.role === 'admin' ? 'bg-sky-50 text-sky-700 border border-sky-200' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {log.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getEventBadge(log.eventType)}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <span className="font-mono text-[11px] block">{log.ipAddress}</span>
                      <span className="text-slate-400 text-[10px] truncate max-w-[140px] block" title={log.userAgent}>
                        {log.userAgent}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Success
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
