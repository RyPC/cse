import { useEffect, useState } from "react";

import {
  Badge,
  Box,
  Flex,
  Heading,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { formatDate, formatTime } from "../../utils/formatDateTime";
import SignUpController from "../discovery/SignUpController";

export const ClassCard = ({
  title,
  location,
  date,
  startTime,
  endTime,
  attendeeCount = 0,
  id,
  user = null,
}) => {
  const formattedDate = date ? formatDate(date) : null;
  const formattedStartTime = startTime ? formatTime(startTime) : null;
  const formattedEndTime = endTime ? formatTime(endTime) : null;
  const { backend } = useBackendContext();
  const [classDate, setClassDate] = useState(null);
  const [openRootModal, setOpenRootModal] = useState(false);

  useEffect(() => {
    const fetchClassDate = async () => {
      if (!classDate && id) {
        const response = await backend.get(`/scheduled-classes/${id}`);
        if (response?.data[0]?.date) {
          const newDate = new Date(response.data[0].date).toLocaleDateString(
            "en-US"
          );
          setClassDate(newDate);
        }
      }
    };
    fetchClassDate();
  }, [backend, classDate, id]);

  return (
    <Box
      w="100%"
      bg="gray.50"
      borderRadius="16px"
      borderColor={"gray.300"}
      borderWidth={1}
      px={6}
      py={10}
      position="relative"
      cursor="pointer"
      onClick={() => setOpenRootModal(true)}
      _hover={{ bg: "gray.100" }}
    >
      <Badge
        position="absolute"
        top={4}
        right={4}
        variant="outline"
        borderStyle="dashed"
        borderColor="purple.600"
        color="purple.700"
        bg="purple.50"
        px={3}
        py={1}
        fontSize="xs"
        fontWeight="medium"
        borderRadius="full"
      >
        {attendeeCount} {attendeeCount === 1 ? "Person" : "People"} Enrolled
      </Badge>

      <HStack
        spacing={4}
        align="center"
      >
        {/* two-shoe icon */}
        <Flex
          w={"20%"}
          align="center"
          justify="center"
        >
          <Image
            src="/card_images/ballet.svg"
            alt="Class illustration"
            maxW="100%"
            maxH="100%"
            objectFit="contain"
            // transform="rotate(-15deg)"
          />

        </Flex>

        {/* text */}
        <VStack
          w={"80%"}
          align="flex-start"
          spacing={1}
        >
          <Heading
            size="md"
            fontWeight={"semibold"}
            color="gray.700"
          >
            {title}
          </Heading>
          <Text
            fontSize="sm"
            color="gray.700"
          >
            {location}
          </Text>
          <Text
            fontSize="sm"
            color="gray.700"
          >
            {formattedDate} · {formattedStartTime} – {formattedEndTime}
          </Text>
        </VStack>
      </HStack>

      <SignUpController
        class_id={id}
        title={title}
        location={location}
        date={classDate || date}
        startTime={startTime}
        endTime={endTime}
        setOpenRootModal={setOpenRootModal}
        openRootModal={openRootModal}
        user={user}
      />
    </Box>
  );
};
