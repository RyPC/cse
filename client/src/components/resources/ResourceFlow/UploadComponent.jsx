import { useState } from "react";

import { Box, Button, Icon, Input, Text } from "@chakra-ui/react";

import { FiPaperclip } from "react-icons/fi";

export const UploadComponent = ({ file, setFile, message }) => {
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  return (
    <Box>
      <Button
        as="label"
        cursor="pointer"
        bg="transparent"
        border="1px solid"
        borderColor="purple.500"
        color="purple.500"
        fontWeight="bold"
      >
        <Icon
          color="gray.600"
          as={FiPaperclip}
          mr={2}
        />
        {file ? file.name : "Attach photo."}
        <Input
          type="file"
          onChange={handleFileChange}
          accept={["image/png", "image/jpg"]}
          display="none"
        />
      </Button>
      {message && <Text color="green.500">{message}</Text>}
    </Box>
  );
};
