# Design System

## Philosophy

- **Mobile-first**: All components designed for touch, scaled up
- **Accessibility-first**: WCAG 2.1 AA compliance minimum
- **Semantic**: Proper HTML elements, ARIA where needed
- **Consistent**: Token-based design, no magic values

---

## Design Tokens

### Colors

```css
/* styles/theme.css */
:root {
  /* Primary */
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-200: #bfdbfe;
  --color-primary-300: #93c5fd;
  --color-primary-400: #60a5fa;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
  --color-primary-800: #1e40af;
  --color-primary-900: #1e3a8a;

  /* Semantic */
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;

  /* Neutral */
  --color-white: #ffffff;
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;

  /* Background & Surface */
  --color-bg-primary: var(--color-white);
  --color-bg-secondary: var(--color-gray-50);
  --color-bg-tertiary: var(--color-gray-100);

  /* Text */
  --color-text-primary: var(--color-gray-900);
  --color-text-secondary: var(--color-gray-600);
  --color-text-tertiary: var(--color-gray-400);
  --color-text-inverse: var(--color-white);

  /* Border */
  --color-border: var(--color-gray-200);
  --color-border-focus: var(--color-primary-500);

  /* Role-specific */
  --color-admin: var(--color-primary-600);
  --color-public: var(--color-success);
  --color-absent: var(--color-error);
  --color-present: var(--color-success);
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-primary: var(--color-gray-900);
    --color-bg-secondary: var(--color-gray-800);
    --color-bg-tertiary: var(--color-gray-700);
    --color-text-primary: var(--color-gray-50);
    --color-text-secondary: var(--color-gray-300);
    --color-border: var(--color-gray-700);
  }
}
```

### Typography

```css
:root {
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* Scale */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */

  /* Weight */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;

  /* Line height */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;

  /* Letter spacing */
  --tracking-tight: -0.025em;
  --tracking-normal: 0;
  --tracking-wide: 0.025em;
}
```

### Spacing

```css
:root {
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
}
```

### Shadows & Elevation

```css
:root {
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --shadow-focus: 0 0 0 3px var(--color-primary-200);
}
```

### Border Radius

```css
:root {
  --radius-none: 0;
  --radius-sm: 0.25rem;   /* 4px */
  --radius-md: 0.375rem;  /* 6px */
  --radius-lg: 0.5rem;    /* 8px */
  --radius-xl: 0.75rem;   /* 12px */
  --radius-2xl: 1rem;     /* 16px */
  --radius-full: 9999px;
}
```

### Z-Index Scale

```css
:root {
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-modal-backdrop: 300;
  --z-modal: 400;
  --z-popover: 500;
  --z-toast: 600;
  --z-tooltip: 700;
}
```

---

## Component Patterns

### Button

```typescript
// shared/components/Button/Button.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary-600 text-white hover:bg-primary-700',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
        danger: 'bg-red-600 text-white hover:bg-red-700',
        ghost: 'hover:bg-gray-100 hover:text-gray-900',
        outline: 'border border-gray-300 bg-transparent hover:bg-gray-50',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && <Spinner className="mr-2 h-4 w-4" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
```

### Input

```typescript
// shared/components/Input/Input.tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="text-sm font-medium text-gray-700">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${props.id}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${props.id}-error`} className="text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
```

### Modal

```typescript
// shared/components/Modal/Modal.tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = 'unset'; };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className={cn(
          'relative bg-white rounded-xl shadow-xl w-full max-h-[90vh] overflow-y-auto',
          size === 'sm' && 'max-w-sm',
          size === 'md' && 'max-w-md',
          size === 'lg' && 'max-w-lg',
          size === 'xl' && 'max-w-xl',
        )}>
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 id="modal-title" className="text-lg font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="rounded-lg p-2 hover:bg-gray-100 transition-colors"
              aria-label="Close modal"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};
```

---

## Attendance-Specific Components

### Status Badge

```typescript
// shared/components/Badge/Badge.tsx
const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      status: {
        present: 'bg-green-100 text-green-800',
        absent: 'bg-red-100 text-red-800',
        pending: 'bg-yellow-100 text-yellow-800',
        special: 'bg-purple-100 text-purple-800',
      },
    },
  }
);
```

### Attendance Card

```typescript
// features/viewer/components/AttendanceCard.tsx
interface AttendanceCardProps {
  record: AttendanceRecord;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onViewDetail?: (id: string) => void;
}

export const AttendanceCard: React.FC<AttendanceCardProps> = ({
  record,
  onEdit,
  onDelete,
  onViewDetail,
}) => {
  const canEdit = useHasPermission('edit:attendance');
  const isAbsent = record.notes?.toLowerCase().includes('vắng');

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar name={record.name} />
          <div>
            <h3 className="font-semibold">{record.name}</h3>
            <p className="text-sm text-gray-500">{formatDate(record.date)}</p>
          </div>
        </div>
        <Badge status={isAbsent ? 'absent' : 'present'}>
          {isAbsent ? 'Absent' : 'Present'}
        </Badge>
      </CardHeader>

      <CardContent>
        {record.photoUrl && !isAbsent && (
          <button
            onClick={() => onViewDetail?.(record.id)}
            className="relative aspect-video w-full overflow-hidden rounded-lg group"
          >
            <Image
              src={record.photoUrl}
              alt={`${record.name}'s check-in photo`}
              fill
              className="object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <ZoomInIcon className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
        )}

        {record.notes && (
          <p className="mt-3 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
            {record.notes}
          </p>
        )}
      </CardContent>

      {canEdit && (
        <CardFooter className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit?.(record.id)}>
            <PencilIcon className="h-4 w-4 mr-1" /> Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete?.(record.id)}>
            <TrashIcon className="h-4 w-4 mr-1" /> Delete
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
```

---

## Responsive Breakpoints

```css
/* Tailwind default breakpoints */
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

### Grid Patterns

```tsx
// Attendance grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {records.map(record => <AttendanceCard key={record.id} {...record} />)}
</div>

// Stats dashboard
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  <StatCard title="Total Slots" value={stats.totalSlots} />
  <StatCard title="Active People" value={stats.uniquePeople} />
  <StatCard title="Months Tracked" value={stats.monthsTracked} />
  <StatCard title="Special Events" value={stats.specialEvents} />
</div>
```

---

## Animation Guidelines

```css
/* Use these transition patterns */
.transition-fast { transition: all 150ms ease-in-out; }
.transition-base { transition: all 200ms ease-in-out; }
.transition-slow { transition: all 300ms ease-in-out; }

/* Modal entrance */
@keyframes modal-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

/* Toast notification */
@keyframes toast-in {
  from { opacity: 0; transform: translateY(-100%); }
  to { opacity: 1; transform: translateY(0); }
}

/* Loading skeleton */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

---

## Accessibility Checklist

- [ ] All interactive elements have visible focus states
- [ ] Color is not the only means of conveying information
- [ ] Form inputs have associated labels
- [ ] Error messages are linked via `aria-describedby`
- [ ] Images have meaningful alt text
- [ ] Modals trap focus and restore on close
- [ ] Tables have proper headers and scope
- [ ] Touch targets are minimum 44x44px
- [ ] Reduced motion preferences respected
- [ ] Keyboard navigation works throughout
