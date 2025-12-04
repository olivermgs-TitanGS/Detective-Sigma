import { redirect } from 'next/navigation';

// Progress page has been merged with Dashboard
// Redirect users to the unified Dashboard page
export default function ProgressPage() {
  redirect('/student/dashboard');
}
