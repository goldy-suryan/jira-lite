import { InvitationService } from './invitation.service.js';

export class InvitationController {
  private readonly invitationSrvc = new InvitationService();

  getInvitation = async (body) => {
    return this.invitationSrvc.getInvitation(body);
  };

  invitationResponse = async (body) => {
    return this.invitationSrvc.respondToInvitation(body);
  };
}
