'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import {
  DEFAULT_WA_NUMBER,
  DEFAULT_WA_TEMPLATE,
  DEFAULT_WA_PROGRAM_TEMPLATE,
  interpolateProgramMessage,
  createWhatsAppUrl
} from '@/lib/whatsapp';

export interface SiteSettings {
  whatsapp_number: string;
  whatsapp_template_default: string;
  whatsapp_template_program: string;
  contact_email: string;
  social_instagram: string;
  social_tiktok: string;
  [key: string]: string | undefined;
}

interface OpenModalOptions {
  defaultMessage?: string;
  programName?: string;
  templateType?: 'default' | 'program' | 'custom';
}

interface SiteSettingsContextValue {
  settings: SiteSettings;
  isModalOpen: boolean;
  modalMessage: string;
  selectedProgram?: string;
  activeTemplateType: 'default' | 'program' | 'custom';
  openWhatsAppModal: (options?: OpenModalOptions) => void;
  closeWhatsAppModal: () => void;
  setModalMessage: (msg: string) => void;
  selectTemplateType: (type: 'default' | 'program' | 'custom') => void;
  sendWhatsAppMessage: (messageToSend?: string) => void;
}

const defaultSettings: SiteSettings = {
  whatsapp_number: DEFAULT_WA_NUMBER,
  whatsapp_template_default: DEFAULT_WA_TEMPLATE,
  whatsapp_template_program: DEFAULT_WA_PROGRAM_TEMPLATE,
  contact_email: 'smartinenglish.smile56@gmail.com',
  social_instagram: 'https://instagram.com/smile_smartinenglish',
  social_tiktok: 'https://www.tiktok.com/@lkpsmartinenglish_smile',
};

const SiteSettingsContext = createContext<SiteSettingsContextValue | undefined>(undefined);

export function SiteSettingsProvider({
  children,
  initialSettings = {},
}: {
  children: React.ReactNode;
  initialSettings?: Record<string, string>;
}) {
  const settings: SiteSettings = useMemo(() => ({
    ...defaultSettings,
    ...initialSettings,
  }), [initialSettings]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [selectedProgram, setSelectedProgram] = useState<string | undefined>(undefined);
  const [activeTemplateType, setActiveTemplateType] = useState<'default' | 'program' | 'custom'>('default');

  const openWhatsAppModal = useCallback((options?: OpenModalOptions) => {
    const program = options?.programName;
    setSelectedProgram(program);

    let initialMsg = '';
    let templateType: 'default' | 'program' | 'custom' = options?.templateType || (program ? 'program' : 'default');

    if (options?.defaultMessage) {
      initialMsg = options.defaultMessage;
    } else if (templateType === 'program' && program) {
      const template = settings.whatsapp_template_program || DEFAULT_WA_PROGRAM_TEMPLATE;
      initialMsg = interpolateProgramMessage(template, program);
    } else {
      initialMsg = settings.whatsapp_template_default || DEFAULT_WA_TEMPLATE;
      templateType = 'default';
    }

    setActiveTemplateType(templateType);
    setModalMessage(initialMsg);
    setIsModalOpen(true);
  }, [settings]);

  const closeWhatsAppModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const selectTemplateType = useCallback((type: 'default' | 'program' | 'custom') => {
    setActiveTemplateType(type);
    if (type === 'default') {
      setModalMessage(settings.whatsapp_template_default || DEFAULT_WA_TEMPLATE);
    } else if (type === 'program') {
      const template = settings.whatsapp_template_program || DEFAULT_WA_PROGRAM_TEMPLATE;
      setModalMessage(interpolateProgramMessage(template, selectedProgram || ''));
    } else if (type === 'custom') {
      setModalMessage('');
    }
  }, [settings, selectedProgram]);

  const sendWhatsAppMessage = useCallback((messageToSend?: string) => {
    const finalMessage = (messageToSend !== undefined ? messageToSend : modalMessage).trim();
    const url = createWhatsAppUrl(settings.whatsapp_number, finalMessage);
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsModalOpen(false);
  }, [modalMessage, settings.whatsapp_number]);

  const value = useMemo(() => ({
    settings,
    isModalOpen,
    modalMessage,
    selectedProgram,
    activeTemplateType,
    openWhatsAppModal,
    closeWhatsAppModal,
    setModalMessage,
    selectTemplateType,
    sendWhatsAppMessage,
  }), [
    settings,
    isModalOpen,
    modalMessage,
    selectedProgram,
    activeTemplateType,
    openWhatsAppModal,
    closeWhatsAppModal,
    selectTemplateType,
    sendWhatsAppMessage,
  ]);

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
}

export function useWhatsAppModal() {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useWhatsAppModal must be used within a SiteSettingsProvider');
  }
  return {
    openWhatsAppModal: context.openWhatsAppModal,
    closeWhatsAppModal: context.closeWhatsAppModal,
    isModalOpen: context.isModalOpen,
    sendWhatsAppMessage: context.sendWhatsAppMessage,
  };
}
