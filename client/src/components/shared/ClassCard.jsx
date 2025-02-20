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

  const handleCancel = () => {
    setOpenModal(false);
  };
  const fetchClassDate = async () => {
    if (!classDate) {
      const response = await backend.get(`/scheduled-classes/${id}`);
      if (response?.data[0]?.date) {
        console.log(response.data[0].date);
        const formattedDate = new Date(
          response.data[0].date
        ).toLocaleDateString("en-US");
        console.log(formattedDate);
        setClassDate(formattedDate);
      }
    }
  };
  useEffect(() => {
    fetchClassDate();
  }, [backend, classDate, id]);
  return (
    <>
      <ClassInfoModal
        isOpenProp={openModal}
        title={title}
        description={description}
        location={location}
        capacity={capacity}
        level={level}
        costume={costume}
        id={id}
        date={classDate}
        isCorequisiteSignUp={false}
        handleClose={handleOpenModal}
        handleCancel={handleCancel}
      />
      <Card w={{ base: "80%", md: "20em" }}>
        <CardHeader>
          <Heading size="lg">{title}</Heading>
        </CardHeader>

        <CardBody>
          <VStack>
            <Text>{description}</Text>
            <Text>
              {level} - {classDate}
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
