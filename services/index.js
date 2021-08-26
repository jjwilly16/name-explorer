import getConfig from 'next/config';
import nodemailer from '../lib/nodemailer';
import Sequelize, { instance as sequelize, Name as NameModel, NameByYear as NameByYearModel } from '../models';

const { serverRuntimeConfig: { programmerEmail } } = getConfig();

// import Auth from './Auth';
import Mailer from './Mailer';
import Name from './Name';

// export const AuthService = new Auth(dbProvider);
export const MailerService = new Mailer(nodemailer, programmerEmail);
export const NameService = new Name(sequelize, Sequelize, NameModel, NameByYearModel);
