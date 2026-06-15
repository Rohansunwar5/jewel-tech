import { validateRequest } from '.';
import { isRequired } from '../../utils/validator.utils';

export const adminLoginValidator = [
  isRequired('email'),
  isRequired('password'),
  ...validateRequest
];

export const adminSignupValidator = [
  isRequired('firstName'),
  isRequired('lastName'),
  isRequired('phoneNumber', true),
  isRequired('email'),
  isRequired('password'),
  ...validateRequest
];

export const registerValidator = [
  isRequired('firstName'),
  isRequired('lastName'),
  isRequired('email'),
  isRequired('isdCode', true),
  isRequired('phoneNumber', true),
  ...validateRequest
];

export const loginValidator = [
  isRequired('email'),
  ...validateRequest
];

export const verifyOtpValidator = [
  isRequired('email'),
  isRequired('otp'),
  ...validateRequest
];

export const verifyEmailValidator = [
  isRequired('code'),
  ...validateRequest
];

export const ssoValidator = [
  isRequired('code'),
  ...validateRequest
];

export const generateResetPasswordCodeValidator = [
  isRequired('email'),
  ...validateRequest
];

export const verifyResetPasswordCodeValidator = [
  isRequired('code'),
  ...validateRequest
];

export const resetPasswordValidator = [
  isRequired('code'),
  isRequired('password'),
  ...validateRequest
];

export const deleteAccountValidator = [
  isRequired('code'),
  ...validateRequest
];


export const updateProfileValidator = [
  isRequired('firstName'),
  isRequired('lastName'),
  isRequired('isdCode', true),
  isRequired('phoneNumber', true),
  isRequired('bio', true),
  isRequired('location', true),
  isRequired('company.name', true),
  isRequired('company.url', true),
  isRequired('socials.twitter', true),
  isRequired('socials.github', true),
  isRequired('socials.facebook', true),
  isRequired('socials.linkedin', true),
  isRequired('socials.instagram', true),
  ...validateRequest
];