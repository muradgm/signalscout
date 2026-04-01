import mongoose from 'mongoose';

export const db = mongoose;

export const connectDb = async (mongoUri: string): Promise<void> => {
  if (db.connection.readyState === 1) {
    return;
  }

  if (db.connection.readyState === 2) {
    return;
  }

  await db.connect(mongoUri);
};

export const getDbReadyState = (): number => db.connection.readyState;

export const getDbStatus = (): 'disconnected' | 'connected' | 'connecting' | 'disconnecting' => {
  switch (db.connection.readyState) {
    case 0:
      return 'disconnected';
    case 1:
      return 'connected';
    case 2:
      return 'connecting';
    case 3:
      return 'disconnecting';
    default:
      return 'disconnected';
  }
};