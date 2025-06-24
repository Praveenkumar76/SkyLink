import { SKYLINK_AUTH } from '@lib/api/auth';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { AvailablePlaces } from '@lib/types/available';

export default async function availableEndpoint(
  _req: NextApiRequest,
  res: NextApiResponse<AvailablePlaces>
): Promise<void> {
  const response = await fetch(
    'https://api.skylink.social/v1/trends/available',
    SKYLINK_AUTH
  );

  const data = (await response.json()) as AvailablePlaces;

  res.status(response.status).json(data);
}
