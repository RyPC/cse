import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Button, Card, CardBody, Image, Heading, Divider, CardFooter, ModalFooter, Tag } from "@chakra-ui/react"


export const CardModal = ({ isOpen, onClose, setCurrentModal, title, description, tags, link, s3URL, ajax }) => {
    const onGoBack = () => {
      setCurrentModal("title")
    }
  
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Is everything correct?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Card maxW='sm'>
              <CardBody>
                <Image
                  src={s3URL}
                  alt=''
                  borderRadius='lg'
                />
                <Heading>{title}</Heading>
                <p>{description}</p>
                <p>Link: {link}</p>
              </CardBody>
              <Divider />
              <CardFooter>
                {tags.map((tag, index) => (
                  <Tag key={index}>{tag}</Tag>
                ))}
              </CardFooter>
            </Card>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={ajax}>
              Confirm
            </Button>
            <Button colorScheme='blue' mr={3} onClick={onGoBack}>
              Go back
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }