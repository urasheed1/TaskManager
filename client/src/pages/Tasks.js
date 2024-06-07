import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Container, Typography, TextField, Button, List, ListItem, ListItemText, IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const completedAnimation = keyframes`
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const TaskListItem = styled(ListItem)`
  background-color: ${(props) => (props.completed ? 'green' : props.overdue ? 'red' : 'white')};
  margin-bottom: 10px;
  animation: ${(props) => (props.completed ? `${completedAnimation} 0.5s ease-in-out` : 'none')};
`;

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
      const response = await API.get('/tasks', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setTasks(response.data);
    };
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
    const taskData = { title, description };
    if (editId) {
      await API.put(`/tasks/${editId}`, taskData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setEditId(null);
    } else {
      await API.post('/tasks', taskData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    }
    setTitle('');
    setDescription('');
    const response = await API.get('/tasks', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    setTasks(response.data);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
    await API.delete(`/tasks/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    setTasks(tasks.filter((task) => task._id !== id));
  };

  const handleComplete = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
    const task = tasks.find((task) => task._id === id);
    await API.put(`/tasks/${id}`, { completed: !task.completed }, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    setTasks(
      tasks.map((task) =>
        task._id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleEdit = (task) => {
    setTitle(task.title);
    setDescription(task.description);
    setEditId(task._id);
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Tasks
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="Description"
          fullWidth
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          {editId ? 'Update Task' : 'Add Task'}
        </Button>
      </form>
      <List>
        {tasks.map((task) => (
          <TaskListItem
            key={task._id}
            completed={task.completed}
            overdue={new Date(task.date) < new Date() && !task.completed}
          >
            <ListItemText
              primary={task.title}
              secondary={task.description}
              sx={{ textDecoration: task.completed ? 'line-through' : 'none' }}
            />
            <IconButton
              edge="end"
              aria-label="complete"
              onClick={() => handleComplete(task._id)}
            >
              <CheckCircleIcon color={task.completed ? 'action' : 'primary'} />
            </IconButton>
            <IconButton
              edge="end"
              aria-label="edit"
              onClick={() => handleEdit(task)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => handleDelete(task._id)}
            >
              <DeleteIcon />
            </IconButton>
          </TaskListItem>
        ))}
      </List>
    </Container>
  );
};

export default Tasks;