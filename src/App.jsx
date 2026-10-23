import { useEffect, useMemo, useState } from 'react';
import defaultConfig from './defaultConfig.js';
import { estimateProject, formatMoney, visibleSteps } from './flow.js';

const clone = (value) => JSON.parse(JSON.stringify(value));

async function loadConfig() {
  try {
    const response = await fetch('/api/config');
    if (!response.ok) throw new Error();
    return await response.json();
  } catch {
    return clone(defaultConfig);
  }
}

function Header({ config, mode, setMode }) {
  return (
    <header className="topbar">
      <button className="brand" onClick={() => setMode('bot')}>
        <span className="brand-mark">И</span>
        <span><strong>{config.brand}</strong><small>умный бриф</small></span>
      </button>
      <nav className="mode-switch" aria-label="Разделы">
        <button className={mode === 'bot' ? 'active' : ''} onClick={() => setMode('bot')}>Демо бота</button>
        <button className={mode === 'admin' ? 'active' : ''} onClick={() => setMode('admin')}>Админ-панель</button>
      </nav>
    </header>
  );
}

function BotAvatar({ config }) {
  return <div className="avatar" aria-label={`Ассистент ${config.assistantName}`}>{config.assistantName.slice(0, 1)}</div>;
}

function Bubble({ config, children, eyebrow }) {
  return (
    <div className="message-row">
      <BotAvatar config={config} />
      <div>
        <div className="sender">{config.assistantName} · онлайн</div>
        <div className="bubble">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          {children}
        </div>
      </div>
    </div>
  );
}

function Menu({ config, open }) {
  return (
    <div className="menu-grid">
      {config.menu.map((item) => (
        <button key={item.key} className="menu-card" onClick={() => open(item.key)}>
          <span>{item.icon}</span>
          <strong>{item.label}</strong>
          <i>→</i>
        </button>
      ))}
    </div>
  );
}

function Privacy({ config, onStart }) {
  return (
    <section className="center-card privacy-card">
      <div className="shield">✓</div>
      <p className="kicker">{config.privacyTitle}</p>
      <h1>Небольшой бриф вместо долгой анкеты</h1>
      <p>{config.privacyText}</p>
      <a href="#privacy">{config.privacyLink}</a>
      <button className="primary wide" onClick={onStart}>{config.labels.start}<span>→</span></button>
      <small>Обычно занимает 3–5 минут</small>
    </section>
  );
}

function QuestionInput({ step, value, onChange }) {
  if (step.type === 'single') {
    return (
      <div className="choice-list">
        {step.options.map((option) => (
          <button key={option} className={`choice ${value === option ? 'selected' : ''}`} onClick={() => onChange(option)}>
            <span className="choice-dot" />{option}<span className="choice-check">✓</span>
          </button>
        ))}
      </div>
    );
  }
  if (step.type === 'multi') {
    const values = Array.isArray(value) ? value : [];
    return (
      <div className="chip-list">
        {step.options.map((option) => {
          const selected = values.includes(option);
          return <button key={option} className={`chip ${selected ? 'selected' : ''}`} onClick={() => onChange(selected ? values.filter((item) => item !== option) : [...values, option])}>{selected ? '✓ ' : '+ '}{option}</button>;
        })}
      </div>
    );
  }
  if (step.type === 'file') {
    return (
      <label className="file-input">
        <input type="file" onChange={(event) => onChange(event.target.files?.[0]?.name || '')} />
        <span>{value ? `✓ ${value}` : 'Выбрать файл'}</span>
        <small>PDF, DOCX, XLSX или изображение</small>
      </label>
    );
  }
  const Tag = step.type === 'textarea' ? 'textarea' : 'input';
  return <Tag className="text-input" type={step.type === 'textarea' ? undefined : step.type} rows={step.type === 'textarea' ? 5 : undefined} value={value || ''} placeholder={step.placeholder || 'Введите ответ'} onChange={(event) => onChange(event.target.value)} />;
}

function Progress({ current, total }) {
  const value = total ? Math.round(((current + 1) / total) * 100) : 0;
  return (
    <div className="progress-wrap">
      <div className="progress-meta"><span>Прогресс</span><strong>{value}%</strong></div>
      <div className="progress"><span style={{ width: `${value}%` }} /></div>
    </div>
  );
}

function Flow({ config, flowKey, answers, setAnswers, onBackToMenu, onComplete }) {
  const [index, setIndex] = useState(0);
  const [error, setError] = useState('');
  const flow = config.flows[flowKey];
  const steps = useMemo(() => visibleSteps([...flow.steps, ...config.commonFinal], answers), [flow, config.commonFinal, answers]);
  const safeIndex = Math.min(index, Math.max(steps.length - 1, 0));
  const step = steps[safeIndex];
  const value = answers[step.id];
  const valid = !step.required || (Array.isArray(value) ? value.length > 0 : Boolean(String(value || '').trim()));

  const next = async () => {
    if (!valid) {
      setError(config.labels.required);
      return;
    }
    setError('');
    const refreshed = visibleSteps([...flow.steps, ...config.commonFinal], answers);
    if (safeIndex >= refreshed.length - 1) {
      await onComplete();
      return;
    }
    setIndex((current) => current + 1);
  };

  const back = () => {
    setError('');
    if (safeIndex === 0) onBackToMenu();
    else setIndex((current) => current - 1);
  };

  return (
    <section className="chat-layout">
      <div className="chat-panel">
        <Progress current={safeIndex} total={steps.length} />
        <Bubble config={config} eyebrow={flow.title}>
          <h2>{step.question}</h2>
          {step.description && <p>{step.description}</p>}
        </Bubble>
        <div className="answer-panel">
          <QuestionInput step={step} value={value} onChange={(nextValue) => { setAnswers((current) => ({ ...current, [step.id]: nextValue })); setError(''); }} />
          {error && <div className="error">{error}</div>}
          <div className="flow-actions">
            <button className="secondary" onClick={back}>← {config.labels.back}</button>
            <button className="primary" onClick={next}>{safeIndex === steps.length - 1 ? config.labels.finish : config.labels.next} →</button>
          </div>
        </div>
      </div>
      <aside className="brief-card">
        <span className="eyebrow">Ваш бриф</span>
        <h3>{flow.title}</h3>
        <p>{flow.intro}</p>
        <dl>
          {steps.filter((item) => answers[item.id]).slice(0, 6).map((item) => (
            <div key={item.id}><dt>{item.question}</dt><dd>{Array.isArray(answers[item.id]) ? answers[item.id].join(', ') : answers[item.id]}</dd></div>
          ))}
        </dl>
        <div className="autosave"><span>✓</span><div><strong>Черновик сохранён</strong><small>Можно вернуться позже</small></div></div>
      </aside>
    </section>
  );
}

function Portfolio({ config, onOrder, onBack }) {
  const [category, setCategory] = useState(null);
  const selected = config.portfolio.categories.find((item) => item.name === category);
  return (
    <section className="center-card portfolio-card">
      <span className="eyebrow">{config.portfolio.title}</span>
      <h1>{selected ? selected.name : config.portfolio.prompt}</h1>
      {!selected ? (
        <div className="portfolio-grid">{config.portfolio.categories.map((item) => <button key={item.name} onClick={() => setCategory(item.name)}>{item.name}<span>→</span></button>)}</div>
      ) : (
        <div className="work-grid">{selected.items.map((item, index) => <article key={item}><div className={`work-cover cover-${index % 3}`}><span>0{index + 1}</span></div><strong>{item}</strong><p>Адаптивный сайт под задачи клиента</p></article>)}</div>
      )}
      <div className="flow-actions">
        <button className="secondary" onClick={selected ? () => setCategory(null) : onBack}>← Назад</button>
        {selected && <button className="primary" onClick={onOrder}>Заказать услугу →</button>}
      </div>
    </section>
  );
}

function Contact({ config, onBack, onOrder }) {
  return (
    <section className="center-card contact-card">
      <span className="eyebrow">Связаться с нами</span>
      <h1>Давайте обсудим ваш проект</h1>
      <p>{config.contactIntro}</p>
      <div className="contact-list">
        <a href={`https://t.me/${config.contacts.telegram.replace('@', '')}`}><span>Telegram</span><strong>{config.contacts.telegram}</strong></a>
        <a href={`tel:${config.contacts.phone}`}><span>Телефон</span><strong>{config.contacts.phone}</strong></a>
        <a href={`mailto:${config.contacts.email}`}><span>Email</span><strong>{config.contacts.email}</strong></a>
      </div>
      <div className="flow-actions"><button className="secondary" onClick={onBack}>← В меню</button><button className="primary" onClick={onOrder}>Заказать сайт →</button></div>
    </section>
  );
}

function Completed({ config, flowKey, answers, onRestart }) {
  const estimate = estimateProject(flowKey, answers);
  return (
    <section className="center-card complete-card">
      <div className="success-icon">✓</div>
      <span className="eyebrow">Заявка отправлена</span>
      <h1>{config.labels.completedTitle}</h1>
      <p>{config.labels.completedText}</p>
      <div className="estimate">
        <span>Предварительная оценка проекта</span>
        <strong>{formatMoney(estimate.from)} — {formatMoney(estimate.to)}</strong>
        <small>Точная стоимость после короткого созвона и уточнения деталей</small>
      </div>
      <button className="primary wide" onClick={onRestart}>Вернуться в главное меню</button>
    </section>
  );
}

function Admin({ config, setConfig }) {
  const [draft, setDraft] = useState(() => clone(config));
  const [status, setStatus] = useState('');

  useEffect(() => setDraft(clone(config)), [config]);

  const change = (path, value) => {
    setDraft((current) => {
      const next = clone(current);
      let pointer = next;
      path.slice(0, -1).forEach((key) => { pointer = pointer[key]; });
      pointer[path.at(-1)] = value;
      return next;
    });
  };

  const save = async () => {
    setStatus('Сохраняем…');
    try {
      const response = await fetch('/api/config', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(draft) });
      if (!response.ok) throw new Error();
      setStatus('Изменения сохранены');
    } catch {
      localStorage.setItem('insight-config', JSON.stringify(draft));
      setStatus('Сохранено в этом браузере');
    }
    setConfig(clone(draft));
  };

  return (
    <main className="admin-shell">
      <div className="admin-head"><div><span className="eyebrow">Управление без кода</span><h1>Настройки чат-бота</h1><p>Изменения сразу появляются в демо после сохранения.</p></div><button className="primary" onClick={save}>Сохранить изменения</button></div>
      {status && <div className="save-status">✓ {status}</div>}
      <section className="admin-section">
        <h2>Основные тексты</h2>
        <div className="field-grid">
          <label>Название студии<input value={draft.brand} onChange={(event) => change(['brand'], event.target.value)} /></label>
          <label>Имя ассистента<input value={draft.assistantName} onChange={(event) => change(['assistantName'], event.target.value)} /></label>
          <label className="full">Приветствие<textarea value={draft.welcome} onChange={(event) => change(['welcome'], event.target.value)} /></label>
          <label className="full">Текст конфиденциальности<textarea value={draft.privacyText} onChange={(event) => change(['privacyText'], event.target.value)} /></label>
        </div>
      </section>
      <section className="admin-section">
        <h2>Контакты</h2>
        <div className="field-grid">
          {Object.entries(draft.contacts).map(([key, value]) => <label key={key}>{key}<input value={value} onChange={(event) => change(['contacts', key], event.target.value)} /></label>)}
        </div>
      </section>
      {Object.entries(draft.flows).map(([flowKey, flow]) => (
        <section className="admin-section" key={flowKey}>
          <h2>{flow.title}</h2>
          <div className="question-editor">
            {flow.steps.map((step, index) => (
              <details key={step.id}>
                <summary><span>{String(index + 1).padStart(2, '0')}</span>{step.question}</summary>
                <div className="editor-body">
                  <label>Текст вопроса<textarea value={step.question} onChange={(event) => change(['flows', flowKey, 'steps', index, 'question'], event.target.value)} /></label>
                  {step.description !== undefined && <label>Подсказка<textarea value={step.description} onChange={(event) => change(['flows', flowKey, 'steps', index, 'description'], event.target.value)} /></label>}
                  {step.options && <label>Варианты ответа — по одному на строке<textarea value={step.options.join('\n')} onChange={(event) => change(['flows', flowKey, 'steps', index, 'options'], event.target.value.split('\n').filter(Boolean))} /></label>}
                </div>
              </details>
            ))}
          </div>
        </section>
      ))}
      <div className="sticky-save"><span>{status || 'Все изменения можно проверить в демо'}</span><button className="primary" onClick={save}>Сохранить</button></div>
    </main>
  );
}

export default function App() {
  const [config, setConfig] = useState(defaultConfig);
  const [mode, setMode] = useState(new URLSearchParams(location.search).get('admin') ? 'admin' : 'bot');
  const [screen, setScreen] = useState('privacy');
  const [flowKey, setFlowKey] = useState('');
  const [answers, setAnswers] = useState(() => JSON.parse(localStorage.getItem('insight-draft') || '{}'));

  useEffect(() => { loadConfig().then((remote) => setConfig(remote)); }, []);
  useEffect(() => { localStorage.setItem('insight-draft', JSON.stringify(answers)); }, [answers]);

  const open = (key) => {
    if (key === 'portfolio' || key === 'contact') setScreen(key);
    else { setFlowKey(key); setAnswers({}); setScreen('flow'); }
  };

  const complete = async () => {
    const lead = { flow: flowKey, answers, createdAt: new Date().toISOString() };
    try { await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lead) }); } catch { localStorage.setItem(`insight-lead-${Date.now()}`, JSON.stringify(lead)); }
    localStorage.removeItem('insight-draft');
    setScreen('complete');
  };

  const reset = () => { setAnswers({}); setFlowKey(''); setScreen('menu'); };

  return (
    <div className="app">
      <Header config={config} mode={mode} setMode={setMode} />
      {mode === 'admin' ? <Admin config={config} setConfig={setConfig} /> : (
        <main className="bot-shell">
          <div className="ambient ambient-one" /><div className="ambient ambient-two" />
          {screen === 'privacy' && <Privacy config={config} onStart={() => setScreen('menu')} />}
          {screen === 'menu' && <section className="menu-shell"><Bubble config={config}><h1>{config.welcome}</h1><p>Выберите направление — я задам только нужные вопросы.</p></Bubble><Menu config={config} open={open} /></section>}
          {screen === 'flow' && <Flow config={config} flowKey={flowKey} answers={answers} setAnswers={setAnswers} onBackToMenu={reset} onComplete={complete} />}
          {screen === 'portfolio' && <Portfolio config={config} onOrder={() => open('newSite')} onBack={() => setScreen('menu')} />}
          {screen === 'contact' && <Contact config={config} onOrder={() => open('newSite')} onBack={() => setScreen('menu')} />}
          {screen === 'complete' && <Completed config={config} flowKey={flowKey} answers={answers} onRestart={reset} />}
        </main>
      )}
      <footer><span>© 2026 {config.brand}</span><span>Данные сохраняются безопасно</span></footer>
    </div>
  );
}
