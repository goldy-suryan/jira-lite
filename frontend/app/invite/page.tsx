'use client';

import { useMutation, useQuery } from '@apollo/client/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GET_INVITATION } from '../graphql/queries/invitation.query';
import { ACCEPT_INVITATION } from '../graphql/mutations/invitation.mutation';
import { useAppSelector } from '../state/hooks';
import { GET_USER_PROJECTS } from '../graphql/queries/board.query';

const InvitePage = () => {
  const params = useSearchParams();
  const router = useRouter();
  const userSelector = useAppSelector((state) => state.user.user);

  if (!params?.get('token')) {
    router.replace('/dashboard');
    router.refresh();
    return;
  }

  const { data } = useQuery<any>(GET_INVITATION, {
    variables: { token: params?.get('token') },
  });

  const [acceptProjectInvitation] = useMutation(ACCEPT_INVITATION, {
    refetchQueries: [
      {
        query: GET_USER_PROJECTS,
        variables: { userId: userSelector?.id },
      },
    ],
  });

  const respondToInvitation = async (resp: string) => {
    try {
      await acceptProjectInvitation({
        variables: {
          userId: userSelector.id,
          token: params?.get('token'),
          status: resp,
        },
      });
      resp == 'accepted'
        ? router.replace(`/projects/${data.getInvitation.projectId}`)
        : router.replace('/dashboard');
    } catch (e) {
      console.log(e, 'error while accepting invitation');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg w-[420px] shadow-lg text-center">
        <h1 className="text-2xl font-bold text-white mb-4">You're Invited</h1>

        <p className="text-gray-400 mb-2">You have been invited to join</p>

        <p className="text-xl font-semibold text-blue-400 mb-4">
          {data?.getInvitation?.project?.name}
        </p>

        <p className="text-gray-400 mb-6">
          Invited by{' '}
          <span className="text-white">
            {data?.getInvitation?.invitedByUser?.name}
          </span>
        </p>

        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md mb-3 cursor-pointer"
          onClick={() => respondToInvitation('accepted')}
        >
          Accept Invitation
        </button>

        <button
          className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-md cursor-pointer"
          onClick={() => respondToInvitation('rejected')}
        >
          Decline
        </button>
      </div>
    </div>
  );
};

export default InvitePage;
