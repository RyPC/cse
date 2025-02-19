import { useEffect, useState } from "react";

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

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
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
  const { backend } = useBackendContext();
  const [openModal, setOpenModal] = useState(false);
  const [classDate, setClassDate] = useState(null);

  const handleOpenModal = () => {
    setOpenModal(!openModal);
  };

  const fetchClassDate = async () => {
    if (!classDate) {
      const response = await backend.get(`/scheduled-classes/${id}`);
      if (response?.data[0]?.date) {
        const date = new Date(response?.data[0]?.date);
        const formattedDate = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        });
        setClassDate(formattedDate);
      }
    }
  };

  useEffect(() => {
    fetchClassDate();
  }, [setClassDate]);
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
        date={classDate}
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
