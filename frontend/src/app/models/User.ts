export class User {
  _id: string = '';
  username: string = '';
  password: string = '';
  email: string = '';
  streakBeginning: Date | null = null;
  streakLength: number | null = null;
}
