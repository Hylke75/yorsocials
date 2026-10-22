'use client';

import { useCallback, useState } from 'react';
import { Button } from '../Button';
import { Toast } from '../Toast';

export function ToastDemo() {
  const [msg, setMsg] = useState<string | null>(null);
  const close = useCallback(() => setMsg(null), []);
  return (
    <>
      <Button variant="secondary" icon={null} onClick={() => setMsg('Voorbeeldmelding: je voorkeuren zijn opgeslagen.')}>
        Toon toast
      </Button>
      <Toast message={msg} onClose={close} />
    </>
  );
}
