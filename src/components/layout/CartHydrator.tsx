'use client';

// Calls GET /cart once when the store layout mounts (app load / login).
// This hydrates Redux so the Navbar badge shows the correct count immediately.
// Subsequent cart operations sync Redux via API mutation responses.

import { useEffect } from 'react';
import { useCart } from '@/hooks/useCart';

export default function CartHydrator() {
  const { hydrateCart } = useCart();

  useEffect(() => {
    hydrateCart();
  }, [hydrateCart]);

  return null; // renders nothing — purely side-effect component
}
