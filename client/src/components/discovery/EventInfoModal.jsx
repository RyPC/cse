import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

{
  /* <EventCard
  key={index}
  title={eventItem.title}
  location={eventItem.location}
  description={eventItem.description}
  level={eventItem.level}
  date={eventItem.date}
  startTime={eventItem.startTime}
  endTime={eventItem.endTime}
  callTime={eventItem.callTime}
  classId={eventItem.classId}
  costume={eventItem.costume}
/>; */
}

function EventInfoModal({ isOpenProp, handleClose, title }) {
  return (
    <>
      <Modal
        isOpen={isOpenProp}
        size="full"
        onClose={handleClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody></ModalBody>

          <ModalFooter>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default EventInfoModal;
