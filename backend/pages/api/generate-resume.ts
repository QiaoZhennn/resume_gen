import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

// Define the response type for the resume generation
type ResumeResponse = {
    resumeMarkdown?: string;
    error?: string;
};
// Define the type for a message in the OpenAI chat completion request
type Message = {
    role: 'system' | 'user' | 'assistant';
    content: string;
};

// Define the type for the OpenAI API response
type OpenAIResponse = {
    choices: Array<{
        message: {
            role: string;
            content: string;
        };
    }>;
};

// Initialize the OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Make sure to provide the OpenAI API key as an environment variable
});
// API handler
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResumeResponse>
) {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Adjust this to your frontend URL for security
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end(); // End the preflight request with a 200 status
        return;
    }
    if (req.method === 'POST') {
        const { name, email, company1, company2, skills } = req.body;

        const userPrompt = `
    You are a professional resume writer. Generate a professional one-page resume in **Markdown** format for the following individual. Use proper Markdown syntax for headings (#, ##, ###), bold (**text**), italics (*text*), bullet points (- item), and horizontal lines (---). Ensure the resume is well-structured and formatted.

    **Name**: ${name}
    **Email**: ${email}

    **Companies**: ${company1}${company2 ? ', ' + company2 : ''}
    **Skills**: ${skills.join(', ')}

    Include realistic but fictional experience for the companies based on your understanding of these companies, focusing on machine learning roles.

    Do not include any introductory or concluding remarks. Only output the resume in Markdown format without any additional commentary.
    `;

        try {
            const completion: any = await openai.chat.completions.create({
                model: 'gpt-4o', // Use the appropriate model
                messages: [
                    { role: 'system', content: 'You are a professional resume writer.' },
                    {
                        role: 'user',
                        content: userPrompt,
                    },
                ] as Message[],
            });

            const resumeMarkdown = completion.choices[0].message.content.trim();
            console.log('Generated resume:', resumeMarkdown);
            res.status(200).json({ resumeMarkdown });
        } catch (error: any) {
            console.error('Error generating resume:', error.message || error);
            res.status(500).json({ error: 'An error occurred while generating the resume.' });
        }
    } else {
        res.setHeader('Allow', ['POST', 'OPTIONS']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}