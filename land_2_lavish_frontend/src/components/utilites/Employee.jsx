import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  IconButton,
  Grid,
  Card,
  CardContent,
  Alert,
  AppBar,
  Toolbar,
  InputAdornment,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LockResetIcon from '@mui/icons-material/LockReset';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import axios from 'axios';

const Employees = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({
    userId: '',
    email: '',
    password: '',
    name: '',
    addharCard: '',
    dob: '',
    mobile: '',
  });
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    recentEmployees: 0,
  });
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [resetPasswordData, setResetPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    retypePassword: '',
  });
  const [resetPasswordError, setResetPasswordError] = useState('');
  const [editError, setEditError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState({
    oldPassword: false,
    newPassword: false,
    retypePassword: false,
  });
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewEmployee, setViewEmployee] = useState(null);

  useEffect(() => {
    const filtered = employees.filter(employee => {
      const searchLower = searchTerm.toLowerCase();
      return (
        employee.userId.toLowerCase().includes(searchLower) ||
        employee.name.toLowerCase().includes(searchLower) ||
        employee.email.toLowerCase().includes(searchLower) ||
        employee.addharCard.toLowerCase().includes(searchLower) ||
        employee.dob.toLowerCase().includes(searchLower) ||
        employee.mobile.toLowerCase().includes(searchLower)
      );
    });
    setFilteredEmployees(filtered);
  }, [searchTerm, employees]);

  const validateCredentials = (userId, password, email, addharCard, mobile, dob) => {
    const userIdRegex = /^[a-zA-Z0-9]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    const addharCardRegex = /^\d{12}$/;
    const mobileRegex = /^\d{10}$/;
    if (!userIdRegex.test(userId)) {
      return 'User ID must contain only letters and numbers';
    }
    if(!email){
      return 'Email is required';
    }
    if (password && !passwordRegex.test(password)) {
      return 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number';
    }
    if (addharCard && !addharCardRegex.test(addharCard)) {
      return 'Addhar Card must be exactly 12 digits';
    }
    if (mobile && !mobileRegex.test(mobile)) {
      return 'Mobile number must be exactly 10 digits';
    }
    if (!dob) {
      return 'Date of birth is required';
    }
    return null;
  };

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users/get-users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(response.data);
      setFilteredEmployees(response.data);
      setStats({
        totalEmployees: response.data.length,
        activeEmployees: response.data.filter(emp => emp.status === 'active').length,
        recentEmployees: response.data.filter(emp => {
          const date = new Date(emp.createdAt);
          const now = new Date();
          return (now - date) <= 30 * 24 * 60 * 60 * 1000; // Last 30 days
        }).length,
      });
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError('Failed to fetch employees');
    }
  };
 
  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleOpen = (employee = null) => {
    if (employee) {
      setSelectedEmployee(employee);
      setFormData({
        userId: employee.userId,
        email: employee.email,
        name: employee.name,
        password: '',
        addharCard: employee.addharCard || '',
        dob: employee.dob ? employee.dob.split('T')[0] : '',
        mobile: employee.mobile || '',
      });
    } else {
      setSelectedEmployee(null);
      setFormData({
        userId: '',
        email: '',
        password: '',
        name: '',
        addharCard: '',
        dob: '',
        mobile: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEmployee(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Restrict Addhar Card and mobile to digits only
    if (name === 'addharCard') {
      // Only allow digits
      const digitsOnly = value.replace(/\D/g, '');
      setFormData({
        ...formData,
        [name]: digitsOnly,
      });
    } else if (name === 'mobile') {
      // Only allow digits for mobile
      const digitsOnly = value.replace(/\D/g, '');
      
      // Store mobile number without prefix in state
      setFormData({
        ...formData,
        [name]: digitsOnly,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEditError('');
    const validationError = validateCredentials(
      formData.userId, 
      formData.password, 
      formData.email, 
      formData.addharCard, 
      formData.mobile, 
      formData.dob
    );
    
    if (validationError) {
      setEditError(validationError);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Ensure proper data formatting before sending
      const requestData = {
        userId: formData.userId,
        email: formData.email,
        name: formData.name,
        password: formData.password,
        addharCard: formData.addharCard || '',
        mobile: formData.mobile || '',
        // Format as full ISO DateTime string for Prisma
        dob: formData.dob ? new Date(formData.dob).toISOString() : null
      };

      // Remove password if empty (for updates)
      if (!requestData.password && selectedEmployee) {
        delete requestData.password;
      }

      if (selectedEmployee) {
        await axios.put(
          `http://localhost:5000/api/users/update-users/${selectedEmployee.id}`,
          requestData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        // For new users, password is required
        if (!requestData.password) {
          setEditError('Password is required for new employees');
          setLoading(false);
          return;
        }
        
        await axios.post(
          'http://localhost:5000/api/users/add-user',
          { ...requestData, role: 'EMPLOYEE' },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      handleClose();
      fetchEmployees();
      setError('');
    } catch (error) {
      console.error('Error saving employee:', error);
      
      // Extract detailed error information
      const serverError = error.response?.data?.error || '';
      
      // Handle specific unique constraint violations
      if (serverError.includes('Unique constraint failed')) {
        if (serverError.includes('userId')) {
          setEditError('This User ID is already taken. Please use a different one.');
        } else if (serverError.includes('email')) {
          setEditError('This Email address is already registered. Please use a different one.');
        } else if (serverError.includes('addharCard')) {
          setEditError('This Addhar Card number is already registered. Please check the number.');
        } else if (serverError.includes('mobile')) {
          setEditError('This Mobile number is already registered. Please use a different one.');
        } else {
          setEditError('A field with unique constraint failed. Please check your inputs.');
        }
      } else {
        // Generic error with details if available
        const errorMessage = error.response?.data?.error 
          || error.response?.data?.message
          || error.message
          || 'Failed to save employee. Please check your inputs and try again.';
        
        setEditError(errorMessage);
      }
      
      // Log additional details for debugging
      if (error.response) {
        console.log('Error response data:', error.response.data);
        console.log('Error status:', error.response.status);
        console.log('Error headers:', error.response.headers);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/users/delete-users/${selectedUser.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteDialogOpen(false);
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting user:', error);
      setError(error.response?.data?.error || 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const handleResetPasswordClick = (user) => {
    setSelectedUser(user);
    setResetPasswordData({
      oldPassword: '',
      newPassword: '',
      retypePassword: '',
    });
    setResetPasswordDialogOpen(true);
  };

  const handleResetPasswordClose = () => {
    setResetPasswordDialogOpen(false);
    setSelectedUser(null);
    setResetPasswordData({
      oldPassword: '',
      newPassword: '',
      retypePassword: '',
    });
  };

  const handleResetPasswordSubmit = async () => {
    setResetPasswordError('');
    if (!resetPasswordData.oldPassword || !resetPasswordData.newPassword || !resetPasswordData.retypePassword) {
      setResetPasswordError('All fields are required');
      return;
    }

    if (resetPasswordData.newPassword !== resetPasswordData.retypePassword) {
      setResetPasswordError('New passwords do not match');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(resetPasswordData.newPassword)) {
      setResetPasswordError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/users/reset-password/${selectedUser.id}`,
        resetPasswordData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      handleResetPasswordClose();
    } catch (error) {
      console.error('Error resetting password:', error);
      setResetPasswordError(error.response?.data?.error || 'Failed to reset password');
    }
  };

  const handleViewClick = (employee) => {
    setViewEmployee(employee);
    setViewDialogOpen(true);
  };

  const handleViewClose = () => {
    setViewDialogOpen(false);
    setViewEmployee(null);
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
            Manage Employees
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: '#f8f9fa' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Employees
                </Typography>
                <Typography variant="h4" color="primary">
                  {stats.totalEmployees}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: '#f8f9fa' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Active Employees
                </Typography>
                <Typography variant="h4" color="success.main">
                  {stats.activeEmployees}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: '#f8f9fa' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Recent Employees (30 days)
                </Typography>
                <Typography variant="h4" color="info.main">
                  {stats.recentEmployees}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <TextField
            placeholder="Search by User ID, Name, or Email..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => handleOpen()}
            sx={{ 
              bgcolor: '#272727',
              '&:hover': {
                bgcolor: '#1a1a1a',
              }
            }}
          >
            Add New Employee
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                <TableCell>User ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow 
                  key={employee.id}
                  sx={{ 
                    '&:hover': { 
                      bgcolor: '#f8f9fa',
                      transition: 'background-color 0.2s'
                    } 
                  }}
                >
                  <TableCell>{employee.userId}</TableCell>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        display: 'inline-block',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor: employee.role === 'ADMIN' ? 'primary.light' : 'success.light',
                        color: employee.role === 'ADMIN' ? 'primary.dark' : 'success.dark',
                      }}
                    >
                      {employee.role}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {new Date(employee.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      onClick={() => handleViewClick(employee)}
                      sx={{ color: 'info.main' }}
                    >
                      <VisibilityOutlinedIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleOpen(employee)}
                      sx={{ color: 'primary.main' }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="secondary"
                      onClick={() => handleResetPasswordClick(employee)}
                    >
                      <LockResetIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDeleteClick(employee)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {filteredEmployees.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography color="textSecondary">
                      No employees found matching your search criteria
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            {selectedEmployee ? 'Edit Employee' : 'Add New Employee'}
          </DialogTitle>
          <DialogContent>
            {editError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {editError}
              </Alert>
            )}
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="User ID"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                helperText="Only letters and numbers allowed"
                error={!!editError && editError.includes('User ID')}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!editError && editError.includes('name')}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!editError && editError.includes('Email')}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Addhar Card"
                name="addharCard"
                value={formData.addharCard}
                onChange={handleChange}
                helperText="Must be exactly 12 digits (unique identifier)"
                error={!!editError && editError.includes('Addhar')}
                InputProps={{
                  inputProps: { 
                    maxLength: 12,
                    inputMode: 'numeric',
                    pattern: '[0-9]*' 
                  }
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Date of Birth"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                error={!!editError && editError.includes('birth')}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Mobile Number"
                name="mobile" 
                value={formData.mobile}
                onChange={handleChange}
                helperText="Must be exactly 10 digits - will be stored with +91 prefix"
                error={!!editError && editError.includes('Mobile')}
                InputProps={{
                  startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                  inputProps: { 
                    maxLength: 10,
                    inputMode: 'numeric',
                    pattern: '[0-9]*' 
                  }
                }}
              />
              
              {!selectedEmployee && (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  helperText="Must be at least 8 characters with uppercase, lowercase and number"
                  error={!!editError && editError.includes('Password')}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    ),
                  }}
                />
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={loading}>Cancel</Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained" 
              color="primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : (selectedEmployee ? 'Update' : 'Create')}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
        >
          <DialogTitle id="delete-dialog-title">
            Confirm Delete
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-dialog-description">
              Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} disabled={loading}>
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteConfirm} 
              color="error" 
              variant="contained"
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={resetPasswordDialogOpen}
          onClose={handleResetPasswordClose}
          aria-labelledby="reset-password-dialog-title"
        >
          <DialogTitle id="reset-password-dialog-title">
            Reset Password for {selectedUser?.name}
          </DialogTitle>
          <DialogContent>
            {resetPasswordError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {resetPasswordError}
              </Alert>
            )}
            <Box component="form" sx={{ mt: 2 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Old Password"
                name="oldPassword"
                type={showResetPassword.oldPassword ? 'text' : 'password'}
                value={resetPasswordData.oldPassword}
                onChange={(e) => setResetPasswordData({ ...resetPasswordData, oldPassword: e.target.value })}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowResetPassword({ ...showResetPassword, oldPassword: !showResetPassword.oldPassword })}
                      edge="end"
                    >
                      {showResetPassword.oldPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="New Password"
                name="newPassword"
                type={showResetPassword.newPassword ? 'text' : 'password'}
                value={resetPasswordData.newPassword}
                onChange={(e) => setResetPasswordData({ ...resetPasswordData, newPassword: e.target.value })}
                helperText="Must be at least 8 characters with uppercase, lowercase and number"
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowResetPassword({ ...showResetPassword, newPassword: !showResetPassword.newPassword })}
                      edge="end"
                    >
                      {showResetPassword.newPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Retype New Password"
                name="retypePassword"
                type={showResetPassword.retypePassword ? 'text' : 'password'}
                value={resetPasswordData.retypePassword}
                onChange={(e) => setResetPasswordData({ ...resetPasswordData, retypePassword: e.target.value })}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowResetPassword({ ...showResetPassword, retypePassword: !showResetPassword.retypePassword })}
                      edge="end"
                    >
                      {showResetPassword.retypePassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  ),
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleResetPasswordClose}>Cancel</Button>
            <Button onClick={handleResetPasswordSubmit} variant="contained" color="primary">
              Reset Password
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog 
          open={viewDialogOpen} 
          onClose={handleViewClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ 
            bgcolor: '#272727', 
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="h6">Employee Details</Typography>
            <IconButton color="inherit" onClick={handleViewClose} size="small">
              <Typography variant="h6">×</Typography>
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            {viewEmployee && (
              <Box>
                <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="h6" color="primary" gutterBottom>
                        {viewEmployee.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          display: 'inline-block',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          bgcolor: viewEmployee.role === 'ADMIN' ? 'primary.light' : 'success.light',
                          color: viewEmployee.role === 'ADMIN' ? 'primary.dark' : 'success.dark',
                        }}
                      >
                        {viewEmployee.role}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Paper elevation={0} sx={{ p: 2, height: '100%', bgcolor: '#f8f9fa', borderRadius: 2 }}>
                      <Typography variant="subtitle2" color="textSecondary">User ID</Typography>
                      <Typography variant="body1" gutterBottom>{viewEmployee.userId}</Typography>
                      
                      <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 2 }}>Email</Typography>
                      <Typography variant="body1" gutterBottom>{viewEmployee.email}</Typography>
                      
                      <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 2 }}>Created At</Typography>
                      <Typography variant="body1">
                        {new Date(viewEmployee.createdAt).toLocaleString()}
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Paper elevation={0} sx={{ p: 2, height: '100%', bgcolor: '#f8f9fa', borderRadius: 2 }}>
                      <Typography variant="subtitle2" color="textSecondary">Date of Birth</Typography>
                      <Typography variant="body1" gutterBottom>
                        {viewEmployee.dob ? new Date(viewEmployee.dob).toLocaleDateString() : 'Not provided'}
                      </Typography>
                      
                      <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 2 }}>Mobile</Typography>
                      <Typography variant="body1" gutterBottom>
                        {viewEmployee.mobile ? `+91 ${viewEmployee.mobile}` : 'Not provided'}
                      </Typography>
                      
                      <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 2 }}>Addhar Card</Typography>
                      <Typography variant="body1">{viewEmployee.addharCard || 'Not provided'}</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button 
              onClick={handleViewClose} 
              variant="contained" 
              sx={{ bgcolor: '#272727', '&:hover': { bgcolor: '#1a1a1a' } }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default Employees; 