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
    console.log(foundInvitation?.toJSON(), 'foundInvitation');
    return foundInvitation;
  };

  respondToInvitation = async (body) => {
    const status = body.status?.toUpperCase();
    const query = {
      token: body.token,
    };

    let invitation = await InvitationModel.findOne({
      where: query,
    });
    
    if (!invitation) throw new GraphQLError('Invitation not found');

    await InvitationModel.update({ status }, { where: query });

    console.log(body.userId, 'userIc')
    if (body.resp == 'accepted') {
      await UserProjectJunctionModel.create({
        userId: body.userId,
        projectId: invitation.toJSON().projectId,
      });
    }
    return true;
  };
}
