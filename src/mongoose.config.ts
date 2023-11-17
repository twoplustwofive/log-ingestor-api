import { MongooseModuleOptions } from '@nestjs/mongoose';

export const mongooseConfig: MongooseModuleOptions = {
  uri: 'mongodb+srv://vijayrathod8422:VO3sOXgF8DKp8VIT@cluster0.lc61bez.mongodb.net/production?retryWrites=true&w=majority',
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as any;
