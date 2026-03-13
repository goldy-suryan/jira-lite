import { GraphQLError } from 'graphql';
import { UserProjectJunctionModel } from '../../models/userProject.model.js';
import { ProjectModel } from '../project/project.model.js';
import { UserModel } from '../user/user.model.js';
import { InvitationModel } from './invitation.model.js';

export class InvitationService {
  getInvitation = async (body) => {
    const foundInvitation = await InvitationModel.findOne({
      where: {
        token: body.token,
      },
      include: [
        {
          model: ProjectModel,
          as: 'project',
        },
        {
          model: UserModel,
          as: 'invitedByUser',
        },
      ],
    });

    return foundInvitation;
  };

  respondToInvitation = async (body, userId, transaction) => {
    const status = body.status?.toUpperCase();
    const query = {
      token: body.token,
    };

    let invitation = await InvitationModel.findOne<any>({
      where: query,
      transaction,
    });

    if (!invitation) throw new GraphQLError('Invitation not found');

    invitation.status = status;
    await invitation.save({ transaction });

    if (status == 'ACCEPTED') {
      await UserProjectJunctionModel.create(
        {
          userId,
          projectId: invitation.toJSON().projectId,
        },
        {
          transaction,
        },
      );
    }
    return true;
  };
}
