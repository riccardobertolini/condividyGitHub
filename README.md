# 📁 Condividy

App di condivisione file con interfaccia drag & drop, protetta da password, costruita con Next.js 15, Neon DB e Vercel Blob.

## Stack

- **Frontend/Backend**: Next.js 16 (App Router)
- **Database**: Neon (PostgreSQL serverless)
- **Storage**: Vercel Blob
- **Deploy**: Vercel

## Setup

### 1. Clona il repository

```bash
git clone https://github.com/riccardobertolini/condividyGitHub
cd condividyGitHub
npm install
```

### 2. Variabili d'ambiente

Copia `.env.example` in `.env.local` e compila i valori:

```bash
cp .env.example .env.local
```

| Variabile | Descrizione |
|---|---|
| `DATABASE_URL` | Connection string Neon PostgreSQL |
| `APP_PASSWORD` | Password per accedere all'app |
| `NEXTAUTH_SECRET` | Stringa segreta per le sessioni (min 32 chars) |
| `BLOB_READ_WRITE_TOKEN` | Token Vercel Blob Storage |

### 3. Crea il database

```bash
npm run db:migrate
```

### 4. Avvia in locale

```bash
npm run dev
```

## Deploy su Vercel

1. Crea un progetto su [Vercel](https://vercel.com) collegato a questo repository
2. Aggiungi le variabili d'ambiente nel pannello Vercel
3. Collega Neon DB tramite Vercel Marketplace (aggiunge automaticamente `DATABASE_URL`)
4. Abilita Vercel Blob Storage dal pannello del progetto (aggiunge `BLOB_READ_WRITE_TOKEN`)
5. Fai deploy!

## Funzionalità

- 🔐 Login con password (salvata in env var)
- 📤 Upload drag & drop (multiplo)
- 📋 Lista file con icone, dimensione, data, contatore download
- ⬇️ Download diretto
- 🗑️ Eliminazione file
- 🌙 Dark theme
