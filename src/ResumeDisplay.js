import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Box } from '@mui/material';
import 'github-markdown-css'; // Use GitHub Markdown CSS for styling

function ResumeDisplay({ content }) {
  return (
    <Box
        id="markdown-to-print"
      className="markdown-body"
      sx={{
        padding: '20px',
        backgroundColor: '#fff',
        color: '#000',
        fontFamily: 'Times New Roman, serif',
        lineHeight: 1.5,
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      }}
    >
       
      <ReactMarkdown
        children={content}
        remarkPlugins={[remarkGfm]} // For GitHub Flavored Markdown
      />
    </Box>
  );
}

export default ResumeDisplay;