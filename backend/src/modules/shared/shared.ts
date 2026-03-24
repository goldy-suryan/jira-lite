import { pubSub } from "../../config/pubSub.config.js";

export class Shared {
  protected createAndPublishNotification = async (
    notificationCtrl,
    data,
    transaction,
  ) => {
    
    const createdNotification = await notificationCtrl.createNotification(
      {
        receiverId: data.receiverId,
        type: data.type,
        title: data.title,
        message: data.message,
        metadata: data.metadata,
      },
      transaction,
    );

    await pubSub.publish(`${data.type}_${data.receiverId}`, {
      [data.subProp]: createdNotification,
    });
  };
}
