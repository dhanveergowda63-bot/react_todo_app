import { useEffect, useMemo, useState } from 'react';

const TODO_STORAGE_KEY = 'daylist-todos';
const SESSION_KEY = 'daylist-user';
const DEMO_EMAIL = 'student@example.com';
const DEMO_PASSWORD = 'password123';

function readTodos() {
  try {
    const saved = JSON.parse(localStorage.getItem(TODO_STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter both your email and password.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Enter a valid email address.');
      return;
    }
    if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      setError('That email and password don’t match. Try the demo login below.');
      return;
    }
    onLogin(email.trim());
  }

  return (
    <main className="login-layout">
      <section className="login-card" aria-labelledby="login-title">
        <div className="brand-mark" aria-hidden="true">d.</div>
        <p className="eyebrow">A calmer kind of productive</p>
        <h1 id="login-title">Make room for<br />what matters.</h1>
        <p className="login-description">Sign in to your personal space and take the next small step.</p>
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="email">Email address</label>
          <input id="email" type="email" autoComplete="username" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} />
          <label htmlFor="password">Password</label>
          <input id="password" type="password" autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} />
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="primary-button login-button" type="submit">Sign in <span aria-hidden="true">→</span></button>
        </form>
        <div className="demo-note"><span className="demo-dot" /> Demo access <strong>student@example.com</strong><strong>password123</strong></div>
        <p className="login-footnote">Your day, one thing at a time.</p>
      </section>
      <aside className="login-art" aria-label="A quiet, sunny workspace">
        <div className="sun" />
        <div className="art-window"><div className="window-sun" /><div className="window-hill hill-one" /><div className="window-hill hill-two" /></div>
        <div className="art-plant"><i /><i /><i /><span /></div>
        <div className="art-table"><div className="art-mug"><span /></div><div className="art-book book-one" /><div className="art-book book-two" /></div>
        <div className="art-caption"><span>01 — TODAY</span><p>Small steps<br />add up.</p></div>
        <div className="art-stamp">TAKE IT<br />EASY <span>✳</span></div>
      </aside>
    </main>
  );
}

function TodoPage({ user, onLogout }) {
  const [todos, setTodos] = useState(readTodos);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('All');
  const [error, setError] = useState('');

  useEffect(() => localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos)), [todos]);

  const remaining = todos.filter((todo) => !todo.completed).length;
  const visibleTodos = useMemo(() => todos.filter((todo) => {
    if (filter === 'Active') return !todo.completed;
    if (filter === 'Completed') return todo.completed;
    return true;
  }), [todos, filter]);

  function addTodo(event) {
    event.preventDefault();
    const title = input.trim();
    if (!title) {
      setError('Write a task before adding it.');
      return;
    }
    setTodos((current) => [{ id: `${Date.now()}-${Math.random()}`, title, completed: false }, ...current]);
    setInput('');
    setError('');
  }

  function toggleTodo(id) {
    setTodos((current) => current.map((todo) => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  }

  function deleteTodo(id) {
    setTodos((current) => current.filter((todo) => todo.id !== id));
  }

  const firstName = user.split('@')[0].split(/[._-]/)[0];

  return (
    <main className="todo-page">
      <header className="topbar">
        <a className="wordmark" href="#home" aria-label="Daylist home"><span className="brand-mark small">d.</span><span>daylist</span></a>
        <div className="topbar-right"><span className="signed-in"><span className="avatar">{firstName.charAt(0).toUpperCase()}</span><span>{user}</span></span><button className="logout-button" onClick={onLogout}>Log out <span aria-hidden="true">↗</span></button></div>
      </header>
      <section className="todo-content">
        <div className="greeting-row"><div><p className="eyebrow">YOUR SPACE, YOUR PACE</p><h1>Good things take<br /><em>one step at a time.</em></h1></div><div className="date-chip"><span className="date-spark">✳</span><span>MAKE TODAY<br /><strong>COUNT</strong></span></div></div>
        <form className="add-form" onSubmit={addTodo}>
          <span className="add-plus" aria-hidden="true">＋</span>
          <input aria-label="New todo" value={input} onChange={(event) => { setInput(event.target.value); setError(''); }} placeholder="What would you like to get done?" />
          <button className="primary-button add-button" type="submit">Add task <span aria-hidden="true">→</span></button>
        </form>
        {error && <p className="form-error todo-error" role="alert">{error}</p>}
        <section className="list-panel" aria-label="Todo list">
          <div className="list-heading"><div><h2>Your list <span className="task-count">{todos.length}</span></h2><p>A little progress is still progress.</p></div><div className="filters" role="tablist" aria-label="Filter tasks">{['All', 'Active', 'Completed'].map((option) => <button key={option} className={filter === option ? 'filter active-filter' : 'filter'} role="tab" aria-selected={filter === option} onClick={() => setFilter(option)}>{option}</button>)}</div></div>
          {visibleTodos.length ? <ul className="todo-list">{visibleTodos.map((todo) => <li className={todo.completed ? 'todo-item is-complete' : 'todo-item'} key={todo.id}><button className="check-button" aria-label={todo.completed ? `Mark ${todo.title} as active` : `Mark ${todo.title} as completed`} aria-pressed={todo.completed} onClick={() => toggleTodo(todo.id)}>{todo.completed && <span aria-hidden="true">✓</span>}</button><span className="todo-title">{todo.title}</span><button className="delete-button" aria-label={`Delete ${todo.title}`} onClick={() => deleteTodo(todo.id)}>×</button></li>)}</ul> : <div className="empty-state"><div className="empty-icon">✳</div><h3>{filter === 'All' ? 'A fresh page.' : `No ${filter.toLowerCase()} tasks.`}</h3><p>{filter === 'All' ? 'Add a task above and give your day a starting point.' : 'Try another filter or add something new.'}</p></div>}
          <footer className="list-footer"><span><strong>{remaining}</strong> {remaining === 1 ? 'task' : 'tasks'} left to do</span><span className="footer-flourish">made for the little wins <b>✳</b></span></footer>
        </section>
      </section>
      <div className="page-decoration deco-left">✳</div><div className="page-decoration deco-right">✳</div>
    </main>
  );
}

export default function App() {
  const [user, setUser] = useState(() => sessionStorage.getItem(SESSION_KEY));

  function login(email) {
    sessionStorage.setItem(SESSION_KEY, email);
    setUser(email);
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    setUser(null);
  }

  return user ? <TodoPage user={user} onLogout={logout} /> : <LoginPage onLogin={login} />;
}
