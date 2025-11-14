'use client';

import { useEffect } from 'react';
import { initMixpanel, MixpanelEvent, trackEvent } from '@/utils/mixpanel';
import { usePathname } from 'next/navigation';

export function MixpanelInitializer({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // DISABLED: Mixpanel tracking disabled - these functions are no-ops in utils/mixpanel.ts
  // Initialize once
  useEffect(() => {
    initMixpanel(); // No-op
  }, []);

  useEffect(() => {
    trackEvent(MixpanelEvent.PageView, { url: pathname }); // No-op
  }, [pathname]);

  return <>{children}</>;
}

export default MixpanelInitializer;


