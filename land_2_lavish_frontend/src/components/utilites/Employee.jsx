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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LockResetIcon from '@mui/icons-material/LockReset';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import axios from 'axios';

const Employees = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({
    userId: '',
    email: '',
    password: '',
    name: '',
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

  const validateCredentials = (userId, password) => {
    const userIdRegex = /^[a-zA-Z0-9]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    
    if (!userIdRegex.test(userId)) {
      return 'User ID must contain only letters and numbers';
    }
    if (password && !passwordRegex.test(password)) {
      return 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number';
    }
    return null;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users/get-users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(response.data);
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
      });
    } else {
      setSelectedEmployee(null);
      setFormData({
        userId: '',
        email: '',
        password: '',
        name: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEmployee(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEditError('');
    const validationError = validateCredentials(formData.userId, formData.password);
    if (validationError) {
      setEditError(validationError);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (selectedEmployee) {
        await axios.put(
          `http://localhost:5000/api/users/update-users/${selectedEmployee.id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post(
          'http://localhost:5000/api/users/add-user',
          { ...formData, role: 'EMPLOYEE' },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      handleClose();
      fetchEmployees();
    } catch (error) {
      console.error('Error saving employee:', error);
      setEditError(error.response?.data?.error || 'Failed to save employee');
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
      fetchEmployees(); // Refresh the user list
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
            Employee Management
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
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
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Employees
                </Typography>
                <Typography variant="h4">{stats.totalEmployees}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Active Employees
                </Typography>
                <Typography variant="h4">{stats.activeEmployees}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Recent Employees (30 days)
                </Typography>
                <Typography variant="h4">{stats.recentEmployees}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="flex-end" mb={3}>
          <Button variant="contained" color="primary" onClick={() => handleOpen()}>
            Add New Employee
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.userId}</TableCell>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>
                    {new Date(employee.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpen(employee)}>
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
                      size="small"
                      onClick={() => handleDeleteClick(employee)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
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
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
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
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              {selectedEmployee ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
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
      </Container>
    </>
  );
};

export default Employees; 