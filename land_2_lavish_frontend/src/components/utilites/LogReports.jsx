import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search as SearchIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function LogReports() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchLogs = async () => { 
      if (!user) return;

      try {
        const token = localStorage.getItem('token');
        const endpoint = (user.role === 'SUPERADMIN' || user.role === 'ADMIN') 
          ? 'http://localhost:5000/api/logs/all'
          : `http://localhost:5000/api/logs/user/${user.id}`;

        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLogs(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to fetch logs');
        setLoading(false);
      }
    };
    fetchLogs();
  }, [user]);

  const filteredLogs = logs.filter(log => {
    const searchLower = searchTerm.toLowerCase();
    const logDate = new Date(log.createdAt);
    let startDateTime = null;
    if (startDate) {
      const [year, month, day] = startDate.split('-');
      const [hour = 0, minute = 0] = startTime.split(':');
      startDateTime = new Date(year, month - 1, day, hour, minute);
    }
    let endDateTime = null;
    if (endDate) {
      const [year, month, day] = endDate.split('-');
      const [hour = 23, minute = 59] = endTime.split(':');
      endDateTime = new Date(year, month - 1, day, hour, minute);
    }
    const dateInRange = (!startDateTime || logDate >= startDateTime) && 
                       (!endDateTime || logDate <= endDateTime);

    // Search term check
    const matchesSearch = (
      (log.user?.userId?.toLowerCase().includes(searchLower) ||
      (log.user?.name?.toLowerCase().includes(searchLower) ||
      (log.details?.toLowerCase().includes(searchLower))
    )));
    return dateInRange && matchesSearch
  });
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
    </div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: '#272727', mb: 2 }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate(`/${user.role}`)}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Log Reports
          </Typography>
        </Toolbar>
      </AppBar>

      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Log Reports</h1>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by User ID, Name, or Details..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <div className="flex items-center gap-2">
              <label className="text-sm">From:</label>
              <input
                type="date"
                className="border rounded p-1"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input
                type="time"
                className="border rounded p-1"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm">To:</label>
              <input
                type="date"
                className="border rounded p-1"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              <input
                type="time"
                className="border rounded p-1"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {log.user?.userId || log.userId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.user?.name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${log.user?.role === 'SUPERADMIN' ? 'bg-purple-100 text-purple-800' : 
                            log.user?.role === 'ADMIN' ? 'bg-blue-100 text-blue-800' : 
                            'bg-green-100 text-green-800'}`}>
                          {log.user?.role || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {log.details || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(log.createdAt)}
                      </td>
                    </tr>
                  ))}
                  {filteredLogs.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                        No logs found matching your search criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
