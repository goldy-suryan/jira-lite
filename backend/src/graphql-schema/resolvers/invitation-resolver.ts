import type { InvitationController } from '../../modules/invitation/invitation.controller.js';
import { unauthorizedError } from '../../utils/helperFunc.js';

export const invitationResolver = {
  getInvitation: (
    parent,
    args,
    {
      user,
      invitationCtrl,
    }: { user: any; invitationCtrl: InvitationController },
  ) => {
    if (!user) {
      throw unauthorizedError();
    }
    return invitationCtrl.getInvitation(args);
  },
};
