import { GraphQLError } from 'graphql';
import { DBConfig } from '../../config/sequelize.init.js';
import { InvitationService } from './invitation.service.js';

export class InvitationController {
  private readonly invitationSrvc = new InvitationService();

  getInvitation = async (body) => {
    return await this.invitationSrvc.getInvitation(body);
  };

  invitationResponse = async (body, userId: string) => {
    const transaction = await DBConfig.sequelize.transaction();
    try {
      const response = await this.invitationSrvc.respondToInvitation(
        body,
        userId,
        transaction,
      );
      await transaction.commit();
      return response;
    } catch (e: any) {
      await transaction.rollback();
      console.log(e, 'error on invitation response');
      throw new GraphQLError(e.message);
    }
  };
}
