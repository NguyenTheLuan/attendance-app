# React + TypeScript Rules

## Table of Contents
1. [Component Patterns](#component-patterns)
2. [TypeScript Conventions](#typescript-conventions)
3. [Hooks Rules](#hooks-rules)
4. [State Management](#state-management)
5. [Performance](#performance)
6. [Forms & Validation](#forms--validation)
7. [Error Handling](#error-handling)
8. [Testing](#testing)

---

## Component Patterns

### 1. Prefer Function Components with Explicit Return Types

```typescript
// ✅ Good
interface AttendanceFormProps {
  initialData?: AttendanceInput;
  onSubmit: (data: AttendanceInput) => Promise<void>;
  mode?: 'create' | 'edit';
}

export const AttendanceForm: React.FC<AttendanceFormProps> = ({
  initialData,
  onSubmit,
  mode = 'create',
}) => {
  // ...
};

// ✅ Also good (without React.FC - preferred for forwardRef)
export function AttendanceForm({
  initialData,
  onSubmit,
  mode = 'create',
}: AttendanceFormProps): JSX.Element {
  // ...
}
```

### 2. Use `forwardRef` for Reusable Components

```typescript
// ✅ Good
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <div>
        {label && <label>{label}</label>}
        <input ref={ref} {...props} />
        {error && <span>{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input'; // Required for debugging
```

### 3. Co-locate Related Logic

```typescript
// ✅ Good - Feature component with everything it needs
// features/attendance/components/BatchEntryForm.tsx

import { useBatchEntryForm } from '../hooks/useBatchEntryForm';
import { useImageUpload } from '../hooks/useImageUpload';
import { useCreateAttendance } from '../hooks/useAttendanceQuery';
import { batchEntrySchema } from '../types';

export const BatchEntryForm: React.FC = () => {
  const form = useBatchEntryForm();
  const uploadMutation = useImageUpload();
  const createMutation = useCreateAttendance();

  const handleSubmit = async (data: BatchEntryInput) => {
    const names = data.names.split(',').map(n => n.trim()).filter(Boolean);

    for (const name of names) {
      let photoUrl: string | undefined;

      if (data.photo && !data.notes?.toLowerCase().includes('vắng')) {
        const upload = await uploadMutation.mutateAsync(data.photo);
        photoUrl = upload.secure_url;
      }

      await createMutation.mutateAsync({
        name,
        date: data.date,
        notes: data.notes,
        photoUrl,
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      {/* ... */}
    </form>
  );
};
```

### 4. Avoid Prop Drilling — Use Composition

```typescript
// ❌ Bad - Too many props passed down
<AttendancePage
  records={records}
  onEdit={handleEdit}
  onDelete={handleDelete}
  filters={filters}
  onFilterChange={setFilters}
  searchQuery={searchQuery}
  onSearchChange={setSearchQuery}
/>

// ✅ Good - Compose with context or slots
<AttendanceLayout>
  <AttendanceFilters />
  <AttendanceSearch />
  <AttendanceTable />
</AttendanceLayout>
```

### 5. Keep Components Focused (Single Responsibility)

```typescript
// ❌ Bad - Does too much
const AttendancePage = () => {
  // Fetch data
  // Handle search
  // Handle filters
  // Handle CSV export
  // Handle CRUD operations
  // Render table
  // Render modal
  // Render charts
};

// ✅ Good - Decomposed
const AttendancePage = () => (
  <AttendanceProvider>
    <PageHeader />
    <AttendanceFilters />
    <AttendanceTableContainer />
    <AttendanceDetailModal />
  </AttendanceProvider>
);
```

---

## TypeScript Conventions

### 1. Strict Type Safety

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/features/*": ["./src/features/*"],
      "@/shared/*": ["./src/shared/*"],
      "@/lib/*": ["./src/lib/*"]
    }
  }
}
```

### 2. Domain Types First

```typescript
// features/attendance/types/attendance.types.ts
import { z } from 'zod';

export const attendanceSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Name is required').max(100),
  date: z.date(),
  photoUrl: z.string().url().optional(),
  notes: z.string().max(500).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const batchEntrySchema = z.object({
  names: z.string().min(1, 'At least one name is required'),
  date: z.date(),
  photo: z.instanceof(File).optional(),
  notes: z.string().optional(),
}).refine(
  (data) => {
    const isAbsent = data.notes?.toLowerCase().includes('vắng');
    return !isAbsent || !data.photo;
  },
  {
    message: 'Photo upload is not required for absent entries',
    path: ['photo'],
  }
);

export type Attendance = z.infer<typeof attendanceSchema>;
export type AttendanceInput = Omit<Attendance, 'id' | 'createdAt' | 'updatedAt'>;
export type BatchEntryInput = z.infer<typeof batchEntrySchema>;

// API response types
export interface AttendanceFilters {
  month?: number;
  year?: number;
  search?: string;
  includeAbsent?: boolean;
}

export interface AttendanceListResponse {
  data: Attendance[];
  meta: {
    total: number;
    page: number;
    perPage: number;
  };
}
```

### 3. Use Discriminated Unions for State

```typescript
// ✅ Good
interface IdleState { status: 'idle'; }
interface LoadingState { status: 'loading'; }
interface SuccessState<T> { status: 'success'; data: T; }
interface ErrorState { status: 'error'; error: Error; }

type AsyncState<T> = IdleState | LoadingState | SuccessState<T> | ErrorState;

// Usage
const [state, setState] = useState<AsyncState<Attendance[]>>({ status: 'idle' });

// Type narrowing works perfectly
switch (state.status) {
  case 'success':
    return <Table data={state.data} />; // T is inferred
  case 'error':
    return <ErrorMessage error={state.error} />;
  // ...
}
```

### 4. Avoid `any`, Use `unknown` for Type Guards

```typescript
// ❌ Bad
function processData(data: any) {
  return data.name; // No type safety
}

// ✅ Good
function isAttendanceRecord(data: unknown): data is Attendance {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'name' in data &&
    'date' in data
  );
}

function processData(data: unknown): string {
  if (!isAttendanceRecord(data)) {
    throw new Error('Invalid attendance record');
  }
  return data.name; // TypeScript knows this is Attendance
}
```

### 5. Use `satisfies` for Better Inference

```typescript
// ✅ Good - Type inference + constraint checking
const attendanceConfig = {
  maxPhotoSize: 5 * 1024 * 1024, // 5MB
  allowedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  batchLimit: 50,
} satisfies {
  maxPhotoSize: number;
  allowedFormats: readonly string[];
  batchLimit: number;
};

// attendanceConfig.allowedFormats is inferred as readonly ['image/jpeg', 'image/png', 'image/webp']
```

---

## Hooks Rules

### 1. Custom Hooks Naming & Structure

```typescript
// ✅ Good - use + descriptive name, returns object for multiple values
export const useAttendanceView = (filters: AttendanceFilters) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { data, isLoading, error } = useAttendanceQuery(filters);
  const { mutate: deleteRecord } = useDeleteAttendance();

  const filteredData = useMemo(() => {
    if (!data) return [];
    return filters.search
      ? data.filter(r => r.name.toLowerCase().includes(filters.search!.toLowerCase()))
      : data;
  }, [data, filters.search]);

  return {
    records: filteredData,
    isLoading,
    error,
    viewMode,
    setViewMode,
    deleteRecord,
  };
};
```

### 2. Keep Hooks Focused

```typescript
// ❌ Bad - One hook doing everything
const useAttendancePage = () => {
  // Data fetching
  // Search logic
  // Filter logic
  // CSV export
  // Modal state
  // CRUD operations
};

// ✅ Good - Separate concerns
const useSearch = (items: Attendance[]) => { /* ... */ };
const useMonthFilter = () => { /* ... */ };
const useCSVExport = () => { /* ... */ };
const useDetailModal = () => { /* ... */ };
```

### 3. Use `useCallback` for Stable References

```typescript
// ✅ Good - Memoize callbacks passed to children
const AttendanceTable = ({ onEdit, onDelete }: TableProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleRowClick = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const handleEdit = useCallback((record: Attendance) => {
    onEdit(record);
  }, [onEdit]);

  return (
    <TableRow onClick={handleRowClick} onEdit={handleEdit} />
  );
};
```

### 4. Use `useMemo` for Expensive Computations

```typescript
// ✅ Good - Memoize leaderboard calculation
const useLeaderboard = (records: Attendance[]) => {
  const leaderboard = useMemo(() => {
    const counts = records.reduce((acc, record) => {
      if (record.notes?.toLowerCase().includes('vắng')) return acc;
      acc[record.name] = (acc[record.name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [records]);

  return leaderboard;
};
```

### 5. Avoid Hooks in Conditionals

```typescript
// ❌ Bad
if (isAdmin) {
  const { data } = useAttendanceQuery(); // ❌ Hook called conditionally
}

// ✅ Good
const { data: allData } = useAttendanceQuery({ includeAbsent: true });
const { data: publicData } = useAttendanceQuery({ includeAbsent: false });
const data = isAdmin ? allData : publicData;
```

---

## State Management

### 1. Server State (TanStack Query)

```typescript
// lib/tanstack-query.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,   // 10 minutes
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.code === 'UNAUTHORIZED') {
          return false; // Don't retry auth errors
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (error) => {
        if (error instanceof ApiError) {
          toast.error(error.message);
        }
      },
    },
  },
});

// Query keys pattern
export const queryKeys = {
  attendance: {
    all: ['attendance'] as const,
    lists: (filters: AttendanceFilters) => [...queryKeys.attendance.all, 'list', filters] as const,
    detail: (id: string) => [...queryKeys.attendance.all, 'detail', id] as const,
  },
  analytics: {
    all: ['analytics'] as const,
    dashboard: () => [...queryKeys.analytics.all, 'dashboard'] as const,
    monthly: (month: number, year: number) => [...queryKeys.analytics.all, 'monthly', month, year] as const,
    leaderboard: () => [...queryKeys.analytics.all, 'leaderboard'] as const,
  },
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
  },
};
```

### 2. Client State (Zustand — Minimal)

```typescript
// features/viewer/store/viewerStore.ts
import { create } from 'zustand';

interface ViewerState {
  // UI State
  searchQuery: string;
  selectedMonth: number | null;
  selectedYear: number;
  viewMode: 'grid' | 'list';

  // Modal State
  detailModal: {
    isOpen: boolean;
    recordId: string | null;
  };

  // Actions
  setSearchQuery: (query: string) => void;
  setMonth: (month: number | null) => void;
  setYear: (year: number) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  openDetailModal: (recordId: string) => void;
  closeDetailModal: () => void;
}

export const useViewerStore = create<ViewerState>((set) => ({
  searchQuery: '',
  selectedMonth: null,
  selectedYear: new Date().getFullYear(),
  viewMode: 'grid',
  detailModal: { isOpen: false, recordId: null },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setMonth: (month) => set({ selectedMonth: month }),
  setYear: (year) => set({ selectedYear: year }),
  setViewMode: (mode) => set({ viewMode: mode }),
  openDetailModal: (recordId) => set({ detailModal: { isOpen: true, recordId } }),
  closeDetailModal: () => set({ detailModal: { isOpen: false, recordId: null } }),
}));
```

### 3. URL as State for Shareable Filters

```typescript
// features/viewer/hooks/useURLState.ts
import { useSearchParams, useRouter } from 'next/navigation';

export const useAttendanceURLState = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const month = searchParams.get('month');
  const year = searchParams.get('year');
  const search = searchParams.get('search');

  const setFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return {
    month: month ? parseInt(month) : null,
    year: year ? parseInt(year) : new Date().getFullYear(),
    search: search || '',
    setFilter,
  };
};
```

---

## Performance

### 1. Code Splitting & Lazy Loading

```typescript
// features/analytics/components/AnalyticsPage.tsx
import { lazy, Suspense } from 'react';

const MonthlyChart = lazy(() => import('./MonthlyChart'));
const DayOfWeekBreakdown = lazy(() => import('./DayOfWeekBreakdown'));
const Leaderboard = lazy(() => import('./Leaderboard'));

export const AnalyticsPage = () => (
  <div className="space-y-6">
    <DashboardCards /> {/* Always loaded */}

    <Suspense fallback={<ChartSkeleton />}>
      <MonthlyChart />
    </Suspense>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Suspense fallback={<ChartSkeleton />}>
        <DayOfWeekBreakdown />
      </Suspense>
      <Suspense fallback={<ChartSkeleton />}>
        <Leaderboard />
      </Suspense>
    </div>
  </div>
);
```

### 2. Virtualize Long Lists

```typescript
// features/viewer/components/VirtualAttendanceList.tsx
import { useVirtualizer } from '@tanstack/react-virtual';

export const VirtualAttendanceList = ({ records }: { records: Attendance[] }) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: records.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80, // Estimated row height
    overscan: 5,
  });

  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <AttendanceCard record={records[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
};
```

### 3. Image Optimization

```typescript
// features/viewer/components/PhotoViewer.tsx
import Image from 'next/image';

export const PhotoViewer = ({ photoUrl, alt }: { photoUrl: string; alt: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
      {!isLoaded && <Skeleton className="absolute inset-0" />}
      <Image
        src={photoUrl}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={cn(
          'object-cover transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0'
        )}
        onLoad={() => setIsLoaded(true)}
        quality={80}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
      />
    </div>
  );
};
```

---

## Forms & Validation

### 1. React Hook Form + Zod Pattern

```typescript
// features/attendance/components/BatchEntryForm.tsx
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { batchEntrySchema, type BatchEntryInput } from '../types';

export const BatchEntryForm: React.FC = () => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BatchEntryInput>({
    resolver: zodResolver(batchEntrySchema),
    defaultValues: {
      names: '',
      date: new Date(),
      notes: '',
    },
  });

  const notes = watch('notes');
  const isAbsent = notes?.toLowerCase().includes('vắng');
  const createAttendance = useCreateAttendance();

  const onSubmit = async (data: BatchEntryInput) => {
    const names = data.names.split(',').map(n => n.trim()).filter(Boolean);

    await Promise.all(
      names.map(name =>
        createAttendance.mutateAsync({
          name,
          date: data.date,
          notes: data.notes,
        })
      )
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Names (comma-separated)"
        placeholder="John Doe, Jane Smith, ..."
        error={errors.names?.message}
        {...register('names')}
      />

      <Controller
        name="date"
        control={control}
        render={({ field }) => (
          <DatePicker
            label="Date"
            value={field.value}
            onChange={field.onChange}
            error={errors.date?.message}
          />
        )}
      />

      <Input
        label="Notes"
        placeholder="Add notes (type 'vắng' to mark absent)"
        {...register('notes')}
      />

      {!isAbsent && (
        <Controller
          name="photo"
          control={control}
          render={({ field: { onChange, value } }) => (
            <ImageUploader
              label="Check-in Photo"
              value={value}
              onChange={onChange}
              maxSize={5 * 1024 * 1024}
              accept="image/*"
            />
          )}
        />
      )}

      <Button type="submit" isLoading={isSubmitting}>
        Submit Attendance
      </Button>
    </form>
  );
};
```

### 2. Controlled vs Uncontrolled

```typescript
// ✅ Uncontrolled for simple inputs (better performance)
<input {...register('name')} />

// ✅ Controlled for complex inputs (need to watch value)
<Controller
  name="date"
  control={control}
  render={({ field }) => <DatePicker {...field} />}
/>

// ✅ Controlled for file inputs (need File object)
<Controller
  name="photo"
  control={control}
  render={({ field: { onChange, value } }) => (
    <input
      type="file"
      onChange={(e) => onChange(e.target.files?.[0])}
    />
  )}
/>
```

---

## Error Handling

### 1. Error Boundaries

```typescript
// shared/components/ErrorBoundary.tsx
interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to error tracking service
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-6 text-center">
            <h2 className="text-lg font-semibold text-red-600">Something went wrong</h2>
            <p className="text-gray-600 mt-2">{this.state.error?.message}</p>
            <Button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

// Usage
<ErrorBoundary fallback={<AnalyticsErrorFallback />}>
  <AnalyticsPage />
</ErrorBoundary>
```

### 2. Async Error Handling

```typescript
// shared/hooks/useAsync.ts
interface UseAsyncOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useAsync<T>(
  asyncFn: () => Promise<T>,
  options: UseAsyncOptions<T> = {}
) {
  const [state, setState] = useState<AsyncState<T>>({ status: 'idle' });

  const execute = useCallback(async () => {
    setState({ status: 'loading' });
    try {
      const data = await asyncFn();
      setState({ status: 'success', data });
      options.onSuccess?.(data);
      return data;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      setState({ status: 'error', error: err });
      options.onError?.(err);
      throw err;
    }
  }, [asyncFn, options.onSuccess, options.onError]);

  return { ...state, execute };
}
```

---

## Testing

### 1. Component Testing

```typescript
// features/attendance/__tests__/BatchEntryForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BatchEntryForm } from '../components/BatchEntryForm';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const renderWithProviders = (ui: React.ReactElement) => {
  const client = createTestQueryClient();
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>
  );
};

describe('BatchEntryForm', () => {
  it('should split comma-separated names into multiple entries', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    renderWithProviders(<BatchEntryForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/names/i), 'John, Jane, Bob');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          names: 'John, Jane, Bob',
        })
      );
    });
  });

  it('should hide photo upload when note contains "vắng"', async () => {
    const user = userEvent.setup();

    renderWithProviders(<BatchEntryForm />);

    expect(screen.getByLabelText(/photo/i)).toBeInTheDocument();

    await user.type(screen.getByLabelText(/notes/i), 'vắng - sick leave');

    expect(screen.queryByLabelText(/photo/i)).not.toBeInTheDocument();
  });

  it('should validate required fields', async () => {
    const user = userEvent.setup();

    renderWithProviders(<BatchEntryForm />);

    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
  });
});
```

### 2. Hook Testing

```typescript
// features/viewer/__tests__/useSearch.test.ts
import { renderHook } from '@testing-library/react';
import { useSearch } from '../hooks/useSearch';

const mockRecords = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
  { id: '3', name: 'Bob Johnson' },
];

describe('useSearch', () => {
  it('should filter records by search query', () => {
    const { result } = renderHook(() => useSearch(mockRecords));

    act(() => {
      result.current.setSearchQuery('john');
    });

    expect(result.current.filteredRecords).toHaveLength(2);
    expect(result.current.filteredRecords.map(r => r.name)).toEqual([
      'John Doe',
      'Bob Johnson',
    ]);
  });

  it('should be case-insensitive', () => {
    const { result } = renderHook(() => useSearch(mockRecords));

    act(() => {
      result.current.setSearchQuery('JANE');
    });

    expect(result.current.filteredRecords).toHaveLength(1);
    expect(result.current.filteredRecords[0].name).toBe('Jane Smith');
  });
});
```

### 3. Mock Service Worker (MSW)

```typescript
// tests/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/attendance', ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search');

    let data = [
      { id: '1', name: 'John Doe', date: '2024-01-15', notes: '' },
      { id: '2', name: 'Jane Smith', date: '2024-01-16', notes: 'vắng' },
    ];

    if (search) {
      data = data.filter(r => 
        r.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    return HttpResponse.json({ data, meta: { total: data.length } });
  }),

  http.post('/api/attendance', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ 
      data: { id: '3', ...body, createdAt: new Date().toISOString() },
      success: true 
    });
  }),
];
```

---

## File Naming Conventions

| Pattern | Usage |
|---------|-------|
| `PascalCase.tsx` | React components |
| `camelCase.ts` | Hooks, utilities, types |
| `kebab-case.ts` | Config files, constants |
| `*.types.ts` | Type definitions |
| `*.test.tsx` | Test files (co-located) |
| `*.stories.tsx` | Storybook stories |
| `index.ts` | Public API exports |

---

## ESLint & Prettier Config

```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "react-hooks/exhaustive-deps": "warn",
    "no-console": ["warn", { "allow": ["error"] }],
    "prefer-const": "error",
    "eqeqeq": ["error", "always"]
  }
}
```

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```
