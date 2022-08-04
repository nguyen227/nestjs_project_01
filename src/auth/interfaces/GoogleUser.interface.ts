export interface GoogleUser {
  google_id: string;
  name: GoogleNameObject;
  email: string;
  avatar: string;
}

interface GoogleNameObject {
  familyName: string;
  givenName: string;
}
