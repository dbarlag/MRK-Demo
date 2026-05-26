import PreferanserPage from '../../components/PreferanserPage/PreferanserPage';
import { getAllActivities } from '@/lib/branches';

export default function Page() {
  const activities = getAllActivities();
  return <PreferanserPage activities={activities} />;
}
