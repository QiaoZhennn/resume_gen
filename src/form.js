import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ResumeDisplay from './ResumeDisplay';
import PrintIcon from '@mui/icons-material/Print';
import {
  Container,
  TextField,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Button,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';
import { styled } from '@mui/system';

function Form() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company1: '',
    company2: '',
    skills: [],
  });

  const skillsOptions = [
    'Python',
    'TensorFlow',
    'PyTorch',
    'Scikit-Learn',
    'Keras',
    'Pandas',
    // Add more skills as needed
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData((prevData) => {
        const skills = checked
          ? [...prevData.skills, value]
          : prevData.skills.filter((skill) => skill !== value);
        return { ...prevData, skills };
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePrint = () => {
    const printContents = document.getElementById('markdown-to-print').innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  };


  const [resume, setResume] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = "https://resume-gen-backend.vercel.app/"

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/generate-resume`, formData);
      setResume(response.data.resumeMarkdown);
    } catch (error) {
      console.error('Error generating resume:', error);
      alert('An error occurred while generating the resume.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ textAlign: 'center', marginTop: '40px' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Machine Learning Resume Generator
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <FormGroup sx={{ marginBottom: '20px' }}>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
          />

          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
          />

          <TextField
            label="Company 1"
            name="company1"
            value={formData.company1}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
          />

          <TextField
            label="Company 2"
            name="company2"
            value={formData.company2}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </FormGroup>

        <Typography variant="h6" gutterBottom>
          Skills:
        </Typography>
        <FormGroup row>
          {skillsOptions.map((skill) => (
            <FormControlLabel
              key={skill}
              control={
                <Checkbox
                  name="skills"
                  value={skill}
                  checked={formData.skills.includes(skill)}
                  onChange={handleChange}
                />
              }
              label={skill}
            />
          ))}
        </FormGroup>

        <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Generating...' : 'Generate Resume'}
          </Button>
        </Box>
      </form>

      {/* Output Section */}
      {resume && (
        <Box sx={{ marginTop: '40px' }}>
          <Typography variant="h5" gutterBottom>
            Your Generated Resume:
          </Typography>
          <ResumeDisplay content={resume} />
        </Box>
      )}
      {resume && (
        <>
          {/* Existing resume display code */}
          <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
            >
              Print Resume
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
}

export default Form;