import { Suspense } from 'react';
import Invitation from './component/invitation';

const InvitePage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Invitation />
    </Suspense>
  );
};

export default InvitePage;
