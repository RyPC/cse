import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Heading,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tag,
  VStack,
} from "@chakra-ui/react";

import { IoIosArrowBack } from "react-icons/io";

import { ProgressBar } from "./ProgressBar";

export const CardModal = ({
  isOpen,
  onClose,
  setCurrentModal,
  title,
  description,
  tags,
  link,
  s3URL,
  ajax,
}) => {
  const onGoBack = () => {
    setCurrentModal("form");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <IconButton
            aria-label="Search database"
            variant="ghost"
            onClick={onGoBack}
          >
            <IoIosArrowBack />
          </IconButton>
          Is everything correct?
          <ProgressBar currStep={5} />
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Card
            maxW="sm"
            bg="gray.50"
            border="0.5px solid"
            borderColor="gray.300"
          >
            <CardBody>
              <Image
                src={s3URL}
                alt=""
                borderRadius="lg"
              />
              <Heading
                fontSize="18px"
                color="gray.700"
                fontWeight={500}
              >
                {title}
              </Heading>
              <p>{description}</p>
              <p>Link: {link}</p>
            </CardBody>
            <Divider />
            <CardFooter>
              {tags.map((tag, index) => (
                <Tag key={index}>{tag.name}</Tag>
              ))}
            </CardFooter>
          </Card>
        </ModalBody>
        <ModalFooter>
          <VStack
            spacing={8}
            sx={{ maxWidth: "100%", marginX: "auto" }}
          >
            <Button
              colorScheme="gray"
              mr={3}
              onClick={ajax}
            >
              Post
            </Button>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
