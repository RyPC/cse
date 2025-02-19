import { useState } from "react";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";

import ClassInfoModal from "../discovery/ClassInfoModal";

export const ClassCard = ({
  id,
  title,
  description,
  location,
  capacity,
  level,
  costume,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => {
    setOpenModal(!openModal);
  };
  return (
    <>
      <ClassInfoModal
        isOpenProp={openModal}
        handleClose={handleOpenModal}
        title={title}
        description={description}
        location={location}
        capacity={capacity}
        level={level}
        costume={costume}
        id={id}
      />
      <Card w={{ base: "80%", md: "20em" }}>
        <CardHeader>
          <Heading size="lg">{title}</Heading>
        </CardHeader>

        <CardBody>
          <VStack>
            <Text>{description}</Text>
            <Text>
              {level} - {location}
            </Text>
            <Text>Costume: {costume}</Text>
          </VStack>
        </CardBody>

        <CardFooter justifyContent="right">
          <Text>0/{capacity} spots left</Text>
          <Button onClick={handleOpenModal}>View Details</Button>
        </CardFooter>
      </Card>
    </>
  );
};
