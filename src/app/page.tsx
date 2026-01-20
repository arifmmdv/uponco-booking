// ============================================================================
// Home Page - Redirect to demo company
// ============================================================================

import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/company/uponco');
}
