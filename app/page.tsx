import { redirect } from 'next/navigation';
import { getLatestEdition } from '@/lib/content';

export default function Home() {
  const latest = getLatestEdition();
  redirect(`/${latest}`);
}
