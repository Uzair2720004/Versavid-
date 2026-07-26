'use client';

import { useEffect } from 'react';

export default function ChatzyWidget() {
  useEffect(() => {
    // Load stylesheet
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://chatzy-kb-store.s3.amazonaws.com/icons/5ab07987-b5db-477c-82ff-1287e0883acb';
    document.head.appendChild(link);

    // Load script
    const script = document.createElement('script');
    script.src = 'https://chatzy-kb-store.s3.amazonaws.com/icons/56706cc4-b3ba-4eba-9610-f2fb07008a5c';
    script.id = 'c9fd61cc-273a-4188-aceb-8538c8b507ef';
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.head.removeChild(link);
      const existingScript = document.getElementById('c9fd61cc-273a-4188-aceb-8538c8b507ef');
      if (existingScript) document.body.removeChild(existingScript);
    };
  }, []);

  return null;
}
