export type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed';

export type ViewMode = 'grid' | 'list';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export type Notification = {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
};

export type Modal = {
  id: string;
  component: string;
  props?: Record<string, unknown>;
  isOpen: boolean;
};

export type UIState = {
  viewMode: ViewMode;
  notifications: Notification[];
  modals: Modal[];
  isLoading: boolean;
  sidebarOpen: boolean;
  editMode: boolean;
};

export type AppError = {
  message: string;
  code?: string;
  details?: unknown;
};
