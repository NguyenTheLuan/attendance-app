# Supabase Setup Guide

This guide explains how to set up Supabase as the backend database for the Attendance App. Supabase is an open-source alternative to Firebase that provides a free PostgreSQL database.

## 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign up or log in.
2. Click **New Project** and select your organization.
3. Enter a name for your project (e.g., `attendance-app`) and set a strong database password.
4. Wait a few minutes for the database to finish provisioning.

## 2. Get Your API Keys

To connect the React frontend to Supabase, you need two keys.
1. In your Supabase Dashboard, click on the **Project Settings** (gear icon ⚙️) in the left sidebar.
2. Select **API** under the Configuration section.
3. You will need:
   - **Project URL**: (Looks like `https://xxxxxx.supabase.co`)
   - **Project API Keys -> anon `public`**: A long JWT string starting with `eyJ...`

## 3. Configure the `.env` File

At the root of the project, create or open the `.env` file and add the keys you copied:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-long-anon-public-key
```

> **Note:** If your dev server (`npm run dev`) is currently running, you must restart it after modifying the `.env` file!

## 4. Set Up the Database Table

We need to create a table to store the attendance records and enable security rules so the app can read/write data.

1. Go to the **SQL Editor** (`</>`) in the left sidebar of your Supabase dashboard.
2. Click **New query**.
3. Paste the following SQL script and click **Run**:

```sql
-- 1. Create the records table
CREATE TABLE records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  "imageUrl" TEXT,
  date TEXT NOT NULL,
  note TEXT,
  "createdAt" BIGINT NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE records ENABLE ROW LEVEL SECURITY;

-- 3. Create policies to allow public access (similar to Firebase test mode)
CREATE POLICY "public_read" ON records FOR SELECT USING (true);
CREATE POLICY "public_insert" ON records FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update" ON records FOR UPDATE USING (true);
CREATE POLICY "public_delete" ON records FOR DELETE USING (true);
```

Once you see `Success. No rows returned`, the database is ready!

## 5. How It Works in the Code

* **`src/services/supabase.ts`**: This file reads your `.env` variables and initializes the connection using the `@supabase/supabase-js` library.
* **`src/services/db.ts`**: Contains all the functions that interact with the database (`addRecord`, `getAllRecords`, `deleteRecordById`, `updateRecordById`). Components should only call these wrapper functions rather than using the Supabase client directly.
