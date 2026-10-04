/** Result of a failed sign-in: the error to show and the email to keep in the form. */
export interface LoginState {
  message?: string;
  email?: string;
}
