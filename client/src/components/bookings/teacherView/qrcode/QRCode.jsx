import { Box, Text, VStack } from "@chakra-ui/react";

import QRCodeReact from "react-qr-code";

export const QRCode = ({ id, type, date}) => {
  const baseUrl = window.location.origin;
  const qrUrl = `${baseUrl}/check-in/${type === 'Class' ? 'class' : 'event'}/${id}${date ? `/${encodeURIComponent(date)}` : ''}`;
  // console.log(qrUrl);

  return (
    <VStack
      spacing={4}
      align="center"
      p={4}
    >
      <Box
        bg="white"
        p={4}
        borderRadius="md"
        border="4px"
        borderColor="black" //
      >
        <QRCodeReact
          value={qrUrl}
          size={256}
          level="H"
        />
      </Box>
    </VStack>
  );
};
