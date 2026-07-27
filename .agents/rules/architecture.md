# Architecture Guide

## Overview

The Attendance App follows a **Feature-Based Modular Architecture** with clear separation of concerns, strict type safety, and scalable data flow.

---

## Directory Structure

```
├── src/
│   ├── app/                          # Next.js App Router (or React Router)
│   │   ├── (admin)/                  # Route groups
│   │   │   ├── attendance/
│   │   │   ├── viewer/
│   │   │   └── stats/
│   │   ├── api/                      # API routes (Next.js) or mock handlers
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── features/                     # Feature-based modules
│   │   ├── attendance/
│   │   │   ├── components/
│   │   │   │   ├── BatchEntryForm.tsx
│   │   │   │   ├── DatePicker.tsx
│   │   │   │   ├── ImageUploader.tsx
│   │   │   │   └── NoteField.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useBatchEntry.ts
│   │   │   │   ├── useImageUpload.ts
│   │   │   │   └── useAttendanceForm.ts
│   │   │   ├── services/
│   │   │   │   └── attendanceApi.ts
│   │   │   ├── types/
│   │   │   │   └── attendance.types.ts
│   │   │   ├── utils/
│   │   │   │   └── attendanceHelpers.ts
│   │   │   └── index.ts              # Public API of the feature
│   │   │
│   │   ├── viewer/
│   │   │   ├── components/
│   │   │   │   ├── AttendanceTable.tsx
│   │   │   │   ├── SearchBar.tsx
│   │   │   │   ├── MonthFilter.tsx
│   │   │   │   ├── DetailModal.tsx
│   │   │   │   └── CSVExportButton.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useAttendanceView.ts
│   │   │   │   ├── useSearch.ts
│   │   │   │   └── useCSVExport.ts
│   │   │   ├── services/
│   │   │   │   └── viewerApi.ts
│   │   │   ├── types/
│   │   │   │   └── viewer.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── analytics/
│   │   │   ├── components/
│   │   │   │   ├── DashboardCards.tsx
│   │   │   │   ├── MonthlyChart.tsx
│   │   │   │   ├── DayOfWeekBreakdown.tsx
│   │   │   │   ├── Leaderboard.tsx
│   │   │   │   └── AbsenceLog.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useDashboardStats.ts
│   │   │   │   ├── useMonthlyComparison.ts
│   │   │   │   └── useLeaderboard.ts
│   │   │   ├── services/
│   │   │   │   └── analyticsApi.ts
│   │   │   ├── types/
│   │   │   │   └── analytics.types.ts
│   │   │   └── index.ts
│   │   │
│   │   └── auth/
│   │       ├── components/
│   │       │   ├── LoginForm.tsx
│   │       │   └── ProtectedRoute.tsx
│   │       ├── hooks/
│   │       │   ├── useAuth.ts
│   │       │   └── useRole.ts
│   │       ├── services/
│   │       │   └── authApi.ts
│   │       ├── types/
│   │       │   └── auth.types.ts
│   │       └── index.ts
│   │
│   ├── shared/                       # Cross-cutting concerns
│   │   ├── components/               # Reusable UI components
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   ├── Table/
│   │   │   ├── Card/
│   │   │   ├── Badge/
│   │   │   ├── Spinner/
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── useDebounce.ts
│   │   │   ├── useLocalStorage.ts
│   │   │   ├── useMediaQuery.ts
│   │   │   └── useClickOutside.ts
│   │   ├── utils/
│   │   │   ├── dateUtils.ts
│   │   │   ├── stringUtils.ts
│   │   │   ├── csvUtils.ts
│   │   │   └── validators.ts
│   │   ├── types/
│   │   │   ├── common.types.ts
│   │   │   └── api.types.ts
│   │   └── constants/
│   │       ├── routes.ts
│   │       ├── roles.ts
│   │       └── appConfig.ts
│   │
│   ├── lib/                          # Third-party library configs
│   │   ├── tanstack-query.ts
│   │   ├── axios.ts
│   │   ├── cloudinary.ts
│   │   └── chartjs.ts
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   └── theme.css
│   │
│   └── types/
│       └── global.d.ts
│
├── public/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.local
├── next.config.js
├── tsconfig.json
└── package.json
```

---

## Data Flow Architecture

### 1. Server State (TanStack Query / React Query)

```typescript
// features/attendance/hooks/useAttendanceForm.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { attendanceApi } from '../services/attendanceApi';

export const useAttendanceQuery = (filters: AttendanceFilters) => {
  return useQuery({
    queryKey: ['attendance', filters],
    queryFn: () => attendanceApi.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: attendanceApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
};
```

### 2. Client State (Zustand) — Minimal & Targeted

```typescript
// features/auth/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (credentials) => {
        const user = await authApi.login(credentials);
        set({ user, isAuthenticated: true });
      },
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'auth-storage' }
  )
);
```

### 3. Form State (React Hook Form + Zod)

```typescript
// features/attendance/hooks/useBatchEntryForm.ts
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { batchEntrySchema, type BatchEntryInput } from '../types';

export const useBatchEntryForm = () => {
  return useForm<BatchEntryInput>({
    resolver: zodResolver(batchEntrySchema),
    defaultValues: {
      names: '',
      date: new Date(),
      notes: '',
    },
  });
};
```

---

## API Layer Pattern

```typescript
// shared/types/api.types.ts
interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

// lib/axios.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().user?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data as ApiError);
  }
);
```

---

## Role-Based Access Control (RBAC)

```typescript
// shared/constants/roles.ts
export enum UserRole {
  PUBLIC = 'public',
  ADMIN = 'admin',
}

export const ROLE_PERMISSIONS = {
  [UserRole.PUBLIC]: ['view:public'],
  [UserRole.ADMIN]: [
    'view:all',
    'edit:attendance',
    'delete:attendance',
    'export:csv',
    'view:absences',
  ],
} as const;

// features/auth/hooks/useRole.ts
export const useHasPermission = (permission: Permission): boolean => {
  const { user } = useAuthStore();
  if (!user) return false;
  return ROLE_PERMISSIONS[user.role].includes(permission);
};

// Component usage
const AttendanceTable = () => {
  const canEdit = useHasPermission('edit:attendance');
  const canDelete = useHasPermission('delete:attendance');
  // ...
};
```

---

## Image Upload Strategy (Cloudinary)

```typescript
// features/attendance/hooks/useImageUpload.ts
import { useMutation } from '@tanstack/react-query';

export const useImageUpload = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );

      if (!response.ok) throw new Error('Upload failed');
      return response.json();
    },
  });
};
```

---

## Performance Guidelines

1. **Lazy Loading**: Analytics charts and heavy components
   ```typescript
   const MonthlyChart = lazy(() => import('./MonthlyChart'));
   ```

2. **Virtualization**: Large attendance lists
   ```typescript
   import { VirtualList } from '@/shared/components';
   ```

3. **Memoization**: Expensive computations
   ```typescript
   const filteredData = useMemo(() => 
     data.filter(item => item.name.includes(search)), 
     [data, search]
   );
   ```

4. **Debouncing**: Search inputs
   ```typescript
   const debouncedSearch = useDebounce(searchTerm, 300);
   ```

5. **Image Optimization**: Use Next.js `<Image>` or Cloudinary transformations
   ```typescript
   <Image src={cloudinaryUrl} width={800} height={600} quality={80} />
   ```

---

## Error Handling Strategy

```typescript
// shared/components/ErrorBoundary.tsx
class ErrorBoundary extends React.Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to monitoring service (Sentry, etc.)
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

// API error handling pattern
try {
  await createAttendance(data);
} catch (error) {
  if (error instanceof ApiError) {
    toast.error(error.message);
  } else {
    toast.error('An unexpected error occurred');
  }
}
```

---

## Testing Strategy

| Layer | Tool | Coverage Target |
|-------|------|-----------------|
| Unit | Vitest + React Testing Library | 80% |
| Integration | Vitest + MSW | 70% |
| E2E | Playwright | Critical flows |

### Example Test Pattern

```typescript
// features/attendance/__tests__/BatchEntryForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BatchEntryForm } from '../components/BatchEntryForm';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

it('should hide image upload when note contains "vắng"', () => {
  const client = createTestQueryClient();
  render(
    <QueryClientProvider client={client}>
      <BatchEntryForm />
    </QueryClientProvider>
  );

  const noteInput = screen.getByLabelText(/notes/i);
  fireEvent.change(noteInput, { target: { value: 'vắng - sick leave' } });

  expect(screen.queryByLabelText(/upload photo/i)).not.toBeInTheDocument();
});
```
