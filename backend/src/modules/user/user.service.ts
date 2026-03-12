import bcrypt from 'bcrypt';
import { UserModel } from './user.model.js';
import { ProjectModel } from '../project/project.model.js';

export class UserService {
  getUser = async (email: string, password: string) => {
    const user = await UserModel.scope('withPassword').findOne({
      where: { email },
      include: [
        {
          model: ProjectModel,
          as: 'projects',
          through: {
            attributes: [],
          },
        },
        { model: ProjectModel, as: 'ownedProjects' },
      ],
    });
    const errorObj = new Error('Invalid email or password');
    if (!user) {
      throw errorObj;
    }
    const comparePass = await bcrypt.compare(password, user.toJSON().password);
    if (!comparePass) {
      throw errorObj;
    }
    return user.toJSON();
  };

  createUser = async (name: string, email: string, password: string) => {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return await UserModel.create({ name, email, password: hash });
  };
}
