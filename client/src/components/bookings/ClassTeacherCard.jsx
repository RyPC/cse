import { memo, useEffect, useState } from "react";

import {
  Badge,
  Box,
  Card,
  Flex,
  Heading,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";

import { FaMicrophoneAlt, FaMusic } from "react-icons/fa";
import {
  GiAbstract001,
  GiBallerinaShoes,
  GiBoombox,
  GiCartwheel,
  GiTambourine,
} from "react-icons/gi";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { formatDate, formatTime } from "../../utils/formatDateTime";

export const ClassTeacherCard = memo(
  ({
    id,
    title,
    location,
    date,
    description,
    capacity,
    level,
    costume,
    performance,
    attendeeCount = 0,
    isDraft,
    recurrencePattern,
    isRecurring,
    startDate,
    endDate,
    startTime,
    endTime,
    navigate,
    setSelectedCard,
    tagId,
    onOpen,
  }) => {
    const [openTeacherModal, setOpenTeacherModal] = useState(false);

    const closeTeacherModal = () => {
      setOpenTeacherModal(false);
    };

    const handleClickModal = () => {
      const modalData = {
        id,
        title,
        location,
        date,
        description,
        capacity,
        level,
        costume,
        performances: performance,
        isDraft,
        recurrencePattern,
        isRecurring,
        startDate,
        endDate,
        attendeeCount,
        startTime,
        endTime,
      };
      setOpenTeacherModal(true);
      setSelectedCard(modalData);
      onOpen(modalData);
    };

    const formattedDate = date ? formatDate(date) : null;
    const formattedStartTime = startTime ? formatTime(startTime) : null;
    const formattedEndTime = endTime ? formatTime(endTime) : null;
    const getIcon = () => {
      const iconSize = 50;
      switch (tagId) {
        case 1:
          return <FaMusic size={iconSize} />;
        case 2:
          return <GiBallerinaShoes size={iconSize} />;
        case 3:
          return <FaMicrophoneAlt size={iconSize} />;
        case 4:
          return <GiBoombox size={iconSize} />;
        case 5:
          return <GiAbstract001 size={iconSize} />;
        case 6:
          return <GiCartwheel size={iconSize} />;
        case 7:
          return <GiTambourine size={iconSize} />;
        default:
          return <FaMusic size={iconSize} />;
      }
    };

    return (
      <Box
        w="100%"
        bg="gray.50"
        borderRadius={"lg"}
        // borderRadius="16px"
        borderColor={"gray.300"}
        borderWidth={1}
        px={6}
        py={10}
        position="relative"
        cursor="pointer"
        onClick={handleClickModal}
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
          {attendeeCount} {attendeeCount === 1 ? "Person" : "People"} RSVP'd
        </Badge>
        <HStack
          spacing={4}
          align="center"
        >
          <Flex
            w="20%"
            align="center"
            justify="center"
          >
            <Image
              src="/card_images/classical.svg" // Set the image source
              alt="Event illustration"
              maxW="100%"
              maxH="100%"
              objectFit="contain"
            />
          </Flex>
          <VStack
            w="80%"
            align="flex-start"
            spacing={1}
          >
            <Heading
              size="md"
              fontWeight="semibold"
              color="grey.700"
              wordBreak="break-word"
              marginTop="10px"
            >
              {title}
            </Heading>
            <Text
              fontSize="sm"
              color="grey.700"
              wordBreak="break-word"
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
      </Box>
    );

    // return (
    //   <Box
    //    display="flex"
    //    justifyContent="center"
    //    w={{ base: "100%", md: "30em" }}
    //   >

    //   <Card
    //     cursor="pointer"
    //     key={id}
    //     w={{ base: "90%", md: "30em" }}
    //     border="1px"
    //     borderColor="gray.300"
    //     bg="gray.50"
    //     onClick={
    //       isDraft
    //         ? () => {
    //             const modalData = {
    //               id,
    //               title,
    //               location,
    //               date,
    //               description,
    //               capacity,
    //               level,
    //               costume,
    //               performances: performance,
    //               isRecurring,
    //               recurrencePattern,
    //               startDate,
    //               endDate,
    //               isDraft,
    //               attendeeCount,
    //               startTime,
    //               endTime,
    //             };
    //             setSelectedCard(modalData);
    //             onOpen({
    //               id,
    //               title,
    //               location,
    //               date,
    //               description,
    //               capacity,
    //               isRecurring,
    //               recurrencePattern,
    //               startDate,
    //               endDate,
    //               level,
    //               costume,
    //               isDraft,
    //               startTime,
    //               endTime,
    //             });
    //           }
    //         : () => {
    //             const modalData = {
    //               id,
    //               title,
    //               location,
    //               date,
    //               description,
    //               capacity,
    //               level,
    //               costume,
    //               isRecurring,
    //               recurrencePattern,
    //               performances: performance,
    //               isDraft,
    //               startDate,
    //               endDate,
    //               attendeeCount,
    //               startTime,
    //               endTime,
    //             };
    //             setSelectedCard(modalData);
    //             onOpen({
    //               id,
    //               title,
    //               location,
    //               date,
    //               description,
    //               capacity,
    //               level,
    //               isRecurring,
    //               recurrencePattern,
    //               costume,
    //               startDate,
    //               endDate,
    //               isDraft,
    //               startTime,
    //               endTime,
    //             });
    //           }
    //       // : () => navigate(`/dashboard/classes/${classId}`)
    //     }
    //   >
    //     <CardBody px={0}>
    //       <Box
    //         position="absolute"
    //         textAlign="center"
    //         justifyContent="center"
    //         alignItems="center"
    //         display="flex"
    //         height="20px"
    //         top="10px"
    //         right="5%"
    //         px="16px"
    //         py="2px"
    //         borderRadius="full"
    //         border="0.2px solid"
    //         borderColor="purple.600"
    //         color="purple.700"
    //         backgroundColor="purple.50"
    //         fontSize="10px"
    //       >
    //         <Text>
    //           {attendeeCount ?? 0} {(attendeeCount ?? 0) === 1 ? "Person" : "People"}{" "}
    //           Enrolled
    //         </Text>
    //       </Box>
    //       <HStack>
    //         <Box px="20px">{getIcon()}</Box>
    //         <VStack
    //           alignItems="flex-start"
    //           py="1rem"
    //         >
    //           <Text
    //             fontSize="1.5rem"
    //             fontWeight="bold"
    //           >
    //             {title}
    //           </Text>

    //           <HStack>
    //             <Text fontSize="sm">{location ? `${location}` : "No location"}</Text>
    //           </HStack>
    //           <HStack>
    //             <Text fontSize="sm">
    //                 {formattedDate
    //                   ? `${formattedDate} · ${formattedStartTime} - ${formattedEndTime}`
    //                   : "No date"}
    //             </Text>
    //           </HStack>
    //         </VStack>
    //       </HStack>
    //     </CardBody>
    //   </Card>
    //   </Box>
    // );
  }
);
