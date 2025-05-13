import { useState } from "react";

import { Box, Button, Flex, Icon, Input, Text } from "@chakra-ui/react";

import { FiPaperclip } from "react-icons/fi";

import { useBackendContext } from "../../../contexts/hooks/useBackendContext";

export const UploadComponent = (setS3URL) => {
  const { backend } = useBackendContext();

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

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
