'use client';

import { useI18n } from '@/lib/i18n';

interface TransProps {
  k: string;
}

export function Trans({ k }: TransProps) {
  const { t } = useI18n();
  return <>{t(k)}</>;
}


