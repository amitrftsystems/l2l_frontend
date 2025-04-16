import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Grid,
  Button,
  Alert,
  IconButton,
  AppBar,
  Toolbar,
  InputAdornment,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function UpcomingBirthdays() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, dateRange]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/utilities/birthday-users', {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Sort users with birthday users at the top, then by upcoming birthdays
      const today = new Date();
      const currentYear = today.getFullYear();
      const sortedUsers = [...response.data].sort((a, b) => {
        // Handle missing dates
        if (!a.dob) return 1;
        if (!b.dob) return -1;

        // Check if today is birthday for either user
        const isABirthday = 
          new Date(a.dob).getMonth() === today.getMonth() && 
          new Date(a.dob).getDate() === today.getDate();
        const isBBirthday = 
          new Date(b.dob).getMonth() === today.getMonth() && 
          new Date(b.dob).getDate() === today.getDate();

        // If one is birthday and other isn't, birthday comes first
        if (isABirthday && !isBBirthday) return -1;
        if (!isABirthday && isBBirthday) return 1;
        if (isABirthday && isBBirthday) return 0;

        // For non-birthday users, sort by upcoming birthday
        const getDaysUntil = (dobString) => {
          const dob = new Date(dobString);
          let nextBirthday = new Date(currentYear, dob.getMonth(), dob.getDate());
          
          if (nextBirthday < today) {
            nextBirthday.setFullYear(currentYear + 1);
          }
          
          const diffTime = nextBirthday.getTime() - today.getTime();
          return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        };

        const aDays = getDaysUntil(a.dob);
        const bDays = getDaysUntil(b.dob);

        return aDays - bDays; // Ascending order
      });
      setUsers(sortedUsers);
      setFilteredUsers(sortedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.userId?.toLowerCase().includes(searchLower) ||
          user.name?.toLowerCase().includes(searchLower) ||
          user.role?.toLowerCase().includes(searchLower)
      );
    }

    // Filter by date range
    if (dateRange.startDate && dateRange.endDate) {
      filtered = filtered.filter((user) => {
        if (!user.dob) return false;

        const userDob = new Date(user.dob);
        const start = new Date(dateRange.startDate);
        const end = new Date(dateRange.endDate);
        
        // Ignore years for birthday comparison
        // We're checking if the month/day falls between start and end month/day
        const userMonth = userDob.getMonth();
        const userDay = userDob.getDate();
        
        const startMonth = start.getMonth();
        const startDay = start.getDate();
        
        const endMonth = end.getMonth();
        const endDay = end.getDate();
        
        // Create date objects with the same year for comparison
        const currentYear = new Date().getFullYear();
        const userDate = new Date(currentYear, userMonth, userDay);
        const startDate = new Date(currentYear, startMonth, startDay);
        const endDate = new Date(currentYear, endMonth, endDay);
        
        return userDate >= startDate && userDate <= endDate;
      });
    }

    setFilteredUsers(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDateChange = (e) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value,
    });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setDateRange({
      startDate: '',
      endDate: '',
    });
  };

  const formatBirthday = (dobString) => {
    if (!dobString) return 'Not provided';
    
    const dob = new Date(dobString);
    const options = { month: 'long', day: 'numeric' };
    return dob.toLocaleDateString(undefined, options);
  };

  const getUpcomingBirthday = (dobString) => {
    if (!dobString) return 'Unknown';
    
    const today = new Date();
    const dob = new Date(dobString);
    
    // Set current year
    const currentYear = today.getFullYear();
    const nextBirthday = new Date(currentYear, dob.getMonth(), dob.getDate());
    
    // If birthday has passed this year, use next year
    if (nextBirthday < today) {
      nextBirthday.setFullYear(currentYear + 1);
    }
    
    // Calculate days until birthday
    const diffTime = Math.abs(nextBirthday - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Check if today is the birthday
    const isToday = 
      dob.getMonth() === today.getMonth() && 
      dob.getDate() === today.getDate();
    
    if (isToday) {
      return '🎉 Today is their birthday! 🎉';
    }
    
    return `In ${diffDays} days`;
  };

  const getBirthdayGreeting = (user) => {
    if (!user.dob) return null;
    
    const today = new Date();
    const dob = new Date(user.dob);
    
    const isToday = 
      dob.getMonth() === today.getMonth() && 
      dob.getDate() === today.getDate();
    
    if (isToday) {
      return (
        <Alert 
          severity="success" 
          sx={{ 
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            '& .MuiAlert-icon': {
              fontSize: '2rem',
            }
          }}
        >
          🎉 Happy Birthday, {user.name}! 🎉
        </Alert>
      );
    }
    
    return null;
  };

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: '#272727' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/admin')}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Upcoming Birthdays
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Birthday Greetings */}
        {filteredUsers.map((user) => getBirthdayGreeting(user))}

        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Filter Birthdays
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                label="Search"
                fullWidth
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search by ID, name or role"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                label="From Date"
                type="date"
                name="startDate"
                value={dateRange.startDate}
                onChange={handleDateChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                label="To Date"
                type="date"
                name="endDate"
                value={dateRange.endDate}
                onChange={handleDateChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Button 
                variant="outlined" 
                onClick={resetFilters}
                fullWidth
              >
                Reset Filters
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                <TableCell>User ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Birthday</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Upcoming Birthday</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Loading birthdays...
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow 
                    key={user.id}
                    sx={{
                      bgcolor: new Date(user.dob).getMonth() === new Date().getMonth() && 
                              new Date(user.dob).getDate() === new Date().getDate() 
                        ? 'success.light' 
                        : 'inherit'
                    }}
                  >
                    <TableCell>{user.userId}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          display: 'inline-block',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          bgcolor: 
                            user.role === 'ADMIN' ? 'primary.light' : 'success.light',
                          color: 
                            user.role === 'ADMIN' ? 'primary.dark' : 'success.dark',
                        }}
                      >
                        {user.role}
                      </Typography>
                    </TableCell>
                    <TableCell>{formatBirthday(user.dob)}</TableCell>
                    <TableCell>
                      {user.dob 
                        ? Math.floor((new Date() - new Date(user.dob)) / (365.25 * 24 * 60 * 60 * 1000)) 
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {getUpcomingBirthday(user.dob)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No birthdays found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
}
