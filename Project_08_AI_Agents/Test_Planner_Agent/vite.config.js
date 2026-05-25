import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function pythonBackendPlugin() {
  return {
    name: 'python-backend',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/fetch' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => body += chunk);
          req.on('end', () => {
            const { projectKey } = JSON.parse(body);
            exec(`uv run --with requests --with python-dotenv python tools/jira_fetch.py ${projectKey}`, 
              { cwd: path.resolve(__dirname, '..') }, 
              (error, stdout, stderr) => {
                try {
                  const output = JSON.parse(stdout);
                  if (output.status === 'success') {
                    const dataPath = path.resolve(__dirname, '..', output.tmp_file);
                    const data = fs.readFileSync(dataPath, 'utf-8');
                    res.setHeader('Content-Type', 'application/json');
                    res.end(data);
                  } else {
                    res.statusCode = 400;
                    res.end(JSON.stringify(output));
                  }
                } catch (e) {
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: stdout || stderr || e.message }));
                }
            });
          });
          return;
        }

        if (req.url === '/api/generate' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => body += chunk);
          req.on('end', () => {
            const { provider } = JSON.parse(body);
            exec(`uv run --with requests --with python-dotenv python tools/llm_generate.py .tmp/jira_issues.json ${provider}`,
              { cwd: path.resolve(__dirname, '..') },
              (error, stdout, stderr) => {
                try {
                  const output = JSON.parse(stdout);
                  if (output.status === 'success') {
                    const dataPath = path.resolve(__dirname, '..', output.output_file);
                    const data = fs.readFileSync(dataPath, 'utf-8');
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ markdown: data }));
                  } else {
                    res.statusCode = 400;
                    res.end(JSON.stringify(output));
                  }
                } catch(e) {
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: stdout || stderr || e.message }));
                }
            });
          });
          return;
        }

        if (req.url === '/api/publish' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => body += chunk);
          req.on('end', () => {
            const { title, spaceKey } = JSON.parse(body);
            // Write markdown content to a temporary file if needed, but the markdown is already in .tmp/test_plan.md!
            exec(`uv run --with requests --with python-dotenv --with markdown python tools/confluence_publish.py ".tmp/test_plan.md" "${title}" "${spaceKey}"`,
              { cwd: path.resolve(__dirname, '..') },
              (error, stdout, stderr) => {
                try {
                  const output = JSON.parse(stdout);
                  if (output.status === 'success') {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(output));
                  } else {
                    res.statusCode = 400;
                    res.end(JSON.stringify(output));
                  }
                } catch(e) {
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: stdout || stderr || e.message }));
                }
            });
          });
          return;
        }

        if (req.url === '/api/save-env' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => body += chunk);
          req.on('end', () => {
            const envVars = JSON.parse(body);
            try {
              let envContent = '';
              const envPath = path.resolve(__dirname, '..', '.env');
              if (fs.existsSync(envPath)) {
                envContent = fs.readFileSync(envPath, 'utf-8');
              }
              const lines = envContent.split('\n');
              const envMap = {};
              lines.forEach(l => {
                if (!l.trim() || l.startsWith('#')) return;
                const i = l.indexOf('=');
                if (i > 0) envMap[l.substring(0, i).trim()] = l.substring(i + 1).trim();
              });
              
              Object.assign(envMap, envVars);
              
              const newEnvContent = Object.entries(envMap).map(([k, v]) => `${k}=${v}`).join('\n');
              fs.writeFileSync(envPath, newEnvContent);
              
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ status: 'success' }));
            } catch(e) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: e.message }));
            }
          });
          return;
        }

        next();
      });
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), pythonBackendPlugin()],
})
