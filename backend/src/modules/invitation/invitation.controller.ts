import { GraphQLError } from 'graphql';
import { DBConfig } from '../../config/sequelize.init.js';
import { InvitationService } from './invitation.service.js';

export class InvitationController {
  private readonly invitationSrvc = new InvitationService();

  getInvitation = async (body) => {
    return await this.invitationSrvc.getInvitation(body);
  };

  invitationResponse = async (body, userId: string) => {
    return DBConfig.sequelize.transaction(async (transaction) => {
      const response = await this.invitationSrvc.respondToInvitation(
        body,
        userId,
        transaction,
      );
      return response;
    });
  };
}
