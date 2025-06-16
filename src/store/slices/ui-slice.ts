import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Modal, Notification, UIState as UIType, ViewMode } from '../../types';

export type UIState = UIType;

const initialState: UIState = {
  viewMode: 'grid',
  notifications: [],
  modals: [],
  isLoading: false,
  sidebarOpen: false,
  editMode: true,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setViewMode: (state, action: PayloadAction<ViewMode>) => {
      state.viewMode = action.payload;
    },

    toggleViewMode: state => {
      state.viewMode = state.viewMode === 'grid' ? 'list' : 'grid';
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    toggleSidebar: state => {
      state.sidebarOpen = !state.sidebarOpen;
    },

    setSidebar: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },

    toggleEditMode: state => {
      state.editMode = !state.editMode;
    },

    setEditMode: (state, action: PayloadAction<boolean>) => {
      state.editMode = action.payload;
    },

    addNotification: (
      state,
      action: PayloadAction<Omit<Notification, 'id'>>
    ) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.notifications.push(notification);
    },

    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },

    clearNotifications: state => {
      state.notifications = [];
    },

    showSuccess: (state, action: PayloadAction<string>) => {
      const notification: Notification = {
        id: Date.now().toString(),
        type: 'success',
        message: action.payload,
        duration: 3000,
      };
      state.notifications.push(notification);
    },

    showError: (state, action: PayloadAction<string>) => {
      const notification: Notification = {
        id: Date.now().toString(),
        type: 'error',
        message: action.payload,
        duration: 5000,
      };
      state.notifications.push(notification);
    },

    showWarning: (state, action: PayloadAction<string>) => {
      const notification: Notification = {
        id: Date.now().toString(),
        type: 'warning',
        message: action.payload,
        duration: 4000,
      };
      state.notifications.push(notification);
    },

    showInfo: (state, action: PayloadAction<string>) => {
      const notification: Notification = {
        id: Date.now().toString(),
        type: 'info',
        message: action.payload,
        duration: 3000,
      };
      state.notifications.push(notification);
    },

    openModal: (state, action: PayloadAction<Omit<Modal, 'isOpen'>>) => {
      const modal: Modal = {
        ...action.payload,
        isOpen: true,
      };
      const existingIndex = state.modals.findIndex(m => m.id === modal.id);
      if (existingIndex !== -1) {
        state.modals[existingIndex] = modal;
      } else {
        state.modals.push(modal);
      }
    },

    closeModal: (state, action: PayloadAction<string>) => {
      const modal = state.modals.find(m => m.id === action.payload);
      if (modal) {
        modal.isOpen = false;
      }
    },

    removeModal: (state, action: PayloadAction<string>) => {
      state.modals = state.modals.filter(modal => modal.id !== action.payload);
    },

    clearModals: state => {
      state.modals = [];
    },
  },
});

export const {
  setViewMode,
  toggleViewMode,
  setLoading,
  toggleSidebar,
  setSidebar,
  toggleEditMode,
  setEditMode,
  addNotification,
  removeNotification,
  clearNotifications,
  showSuccess,
  showError,
  showWarning,
  showInfo,
  openModal,
  closeModal,
  removeModal,
  clearModals,
} = uiSlice.actions;

export default uiSlice.reducer;
