import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'var(--bg)',
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: 'var(--text)', marginBottom: '8px' }}>
            📁 Condividy
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
            Inserisci la password per accedere
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
