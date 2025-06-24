export const SKYLINK_AUTH: Readonly<RequestInit> = {
  headers: {
    Authorization: `Bearer ${process.env.SKYLINK_API_KEY as string}`,
    'Content-Type': 'application/json'
  }
};
