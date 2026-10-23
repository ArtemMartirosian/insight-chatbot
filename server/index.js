import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import defaultConfig from '../src/defaultConfig.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
async function readJson(file, fallback) {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch {
    return fallback;
  }
}

async function writeJson(file, value) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const temp = `${file}.tmp`;
  await fs.writeFile(temp, JSON.stringify(value, null, 2));
  await fs.rename(temp, file);
}

export function createApp(options = {}) {
  const dataDir = options.dataDir || process.env.APP_DATA_DIR || path.join(root, 'data');
  const configPath = path.join(dataDir, 'config.json');
  const leadsPath = path.join(dataDir, 'leads.json');
  const app = express();
  app.use(express.json({ limit: '2mb' }));

  app.get('/api/health', (_request, response) => response.json({ status: 'ok' }));

  app.get('/api/config', async (_request, response) => {
    response.json(await readJson(configPath, defaultConfig));
  });

  app.put('/api/config', async (request, response) => {
    if (!request.body?.flows || !request.body?.menu || !request.body?.contacts) {
      return response.status(400).json({ error: 'Некорректная конфигурация' });
    }
    await writeJson(configPath, request.body);
    response.json({ saved: true });
  });

  app.post('/api/leads', async (request, response) => {
    if (!request.body?.flow || !request.body?.answers) {
      return response.status(400).json({ error: 'Не заполнены данные заявки' });
    }
    const leads = await readJson(leadsPath, []);
    const lead = {
      id: `lead-${Date.now().toString(36)}`,
      flow: request.body.flow,
      answers: request.body.answers,
      createdAt: request.body.createdAt || new Date().toISOString()
    };
    leads.push(lead);
    await writeJson(leadsPath, leads);
    response.status(201).json(lead);
  });

  app.get('/api/leads', async (_request, response) => {
    response.json(await readJson(leadsPath, []));
  });

  app.use(express.static(path.join(root, 'dist')));
  app.use((_request, response) => response.sendFile(path.join(root, 'dist', 'index.html')));
  return app;
}

if (process.env.NODE_ENV !== 'test') {
  const port = Number(process.env.PORT || 4173);
  createApp().listen(port, () => console.log(`ИнСайт запущен: http://localhost:${port}`));
}
