import { Badge } from '@chakra-ui/react';

export const StatusCard = ({ status }) => (
  <Badge colorScheme={status ? 'green' : 'yellow'}>
    {status ? 'verified' : 'unverified'}
  </Badge>
);

