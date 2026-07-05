'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';
import type { FileRecord } from '@/lib/db';

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString('it-IT', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function getFileIcon(mimeType: string): string {
  if (mimeType.startsWith('image/')) return '🖼️';
  if (mimeType.startsWith('video/')) return '🎬';
  if (mimeType.startsWith('audio/')) return '🎵';
  if (mimeType.includes('pdf')) return '📄';
  if (mimeType.includes('zip') || mimeType.includes('compressed')) return '🗜️';
  if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
  if (mimeType.includes('sheet') || mimeType.includes('excel')) return '📊';
  return '📎';
}

interface Props {
  files: FileRecord[];
}

export default function FilesPage({ files: initialFiles }: Props) {
  const [files, setFiles] = useState<FileRecord[]>(initialFiles);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const uploadFiles = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    setUploadProgress([]);
    
    for (const file of acceptedFiles) {
      setUploadProgress(prev => [...prev, `Caricamento ${file.name}...`]);
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch('/api/files', { method: 'POST', body: formData });
      if (res.ok) {
        setUploadProgress(prev => prev.map(p => 
          p === `Caricamento ${file.name}...` ? `✅ ${file.name} caricato` : p
        ));
      } else {
        setUploadProgress(prev => prev.map(p => 
          p === `Caricamento ${file.name}...` ? `❌ Errore: ${file.name}` : p
        ));
      }
    }

    setUploading(false);
    router.refresh();
    
    const res = await fetch('/api/files');
    if (res.ok) {
      const data = await res.json();
      setFiles(data);
    }
    
    setTimeout(() => setUploadProgress([]), 3000);
  }, [router]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: uploadFiles,
    disabled: uploading,
  });

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Eliminare "${name}"?`)) return;
    setDeletingId(id);
    await fetch(`/api/files/${id}`, { method: 'DELETE' });
    setFiles(prev => prev.filter(f => f.id !== id));
    setDeletingId(null);
  };

  const handleDownload = async (file: FileRecord) => {
    await fetch(`/api/files/${file.id}`, { method: 'PATCH' });
    const a = document.createElement('a');
    a.href = file.url;
    a.download = file.original_name;
    a.target = '_blank';
    a.click();
    setFiles(prev => prev.map(f => 
      f.id === file.id ? { ...f, download_count: f.download_count + 1 } : f
    ));
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <div style={{ minHeight: '100vh', padding: '24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '32px', paddingBottom: '24px',
          borderBottom: '1px solid var(--border)'
        }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '4px' }}>📁 Condividy</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              {files.length} file{files.length !== 1 ? 's' : ''} caricati
            </p>
          </div>
          <button onClick={handleLogout} className="btn btn-ghost" style={{ fontSize: '13px' }}>
            Esci
          </button>
        </div>

        {/* Drop Zone */}
        <div
          {...getRootProps()}
          style={{
            border: `2px dashed ${isDragActive ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: 'var(--radius)',
            padding: '48px 24px',
            textAlign: 'center',
            cursor: uploading ? 'not-allowed' : 'pointer',
            background: isDragActive ? 'rgba(99,102,241,0.08)' : 'var(--surface)',
            transition: 'all 0.2s',
            marginBottom: '24px',
          }}
        >
          <input {...getInputProps()} />
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>
            {uploading ? '⏳' : isDragActive ? '⬇️' : '📤'}
          </div>
          <p style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
            {uploading ? 'Caricamento in corso...' : isDragActive ? 'Rilascia i file qui!' : 'Trascina i file qui'}
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            {!uploading && 'oppure clicca per selezionare i file'}
          </p>
          {uploadProgress.length > 0 && (
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {uploadProgress.map((msg, i) => (
                <p key={i} style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{msg}</p>
              ))}
            </div>
          )}
        </div>

        {/* File List */}
        {files.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
            <p style={{ fontSize: '40px', marginBottom: '12px' }}>🗂️</p>
            <p style={{ color: 'var(--text-muted)' }}>Nessun file caricato</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {files.map(file => (
              <div
                key={file.id}
                className="card"
                style={{
                  display: 'flex', alignItems: 'center', gap: '16px',
                  padding: '16px 20px',
                }}
              >
                <span style={{ fontSize: '28px', flexShrink: 0 }}>
                  {getFileIcon(file.mime_type)}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontWeight: '600', fontSize: '15px',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                  }}>
                    {file.original_name}
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '2px' }}>
                    {formatSize(file.size)} · {formatDate(file.upload_date)} · {file.download_count} download
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button
                    onClick={() => handleDownload(file)}
                    className="btn btn-primary"
                    style={{ padding: '8px 14px', fontSize: '13px' }}
                  >
                    ⬇️ Scarica
                  </button>
                  <button
                    onClick={() => handleDelete(file.id, file.original_name)}
                    className="btn btn-danger"
                    disabled={deletingId === file.id}
                    style={{ padding: '8px 14px', fontSize: '13px' }}
                  >
                    {deletingId === file.id ? '...' : '🗑️'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
