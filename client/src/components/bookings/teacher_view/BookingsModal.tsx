import { useEffect, useState, useDisclosure } from "react";

import { FormControl, FormLabel, Input, Switch, Button, Box, VStack, HStack } from '@chakra-ui/react';

import {} from "react-icons/fa";

import { useBackendContext } from "../../../contexts/hooks/useBackendContext";
import { Booking, isClass } from "../../../types/booking";

import { BookingsForm, ClassForm, EventForm }

function EditBookingModal(isOpen, onClose, booking: Booking) {
    const { 
        isOpen: isConfOpen,
        onOpen: onConfOpen,
        onClose: onConfClose 
    } = useDisclosure();

    const { saveDraft, setSaveDraft } = useState(false)

    const { backend } = useBackendContext()
    
    const is_new = booking === null
    const is_class = isClass(booking)

    const title = `${booking ? "New " : "Draft "} ${is_class ? "Class" : "Event"}` 

    const  = useState({
      title: booking?.title ?? '',
      description: booking?.description ?? '',
      location: booking?.location ?? '',
      level: booking?.level ?? '',
      date: booking?.date ?? '',
      start_time: booking?.start_time ?? '',
      end_time: booking?.end_time ?? '',
    });

    const [classData, setClassData] = useState(is_class ? {
      capacity: bookings?.capacity ?? 0,
      classType: bookings?.classType ?? "",
      performance: bookings?.performance ?? 0
    } : null)

    const [eventData, setEventData] = useState(!is_class ? {
      call_time: bookings?.call_time ?? "",
      costume: bookings?.costume ?? "",
    } : null)

    const openConfirmation(saveAsDraft) => {
        setSaveDraft(saveAsDraft)
        onConfOpen()
    }

    // TODO: Add logic for scheduled-classes post req
    const saveChanges = (saveAsDraft) => {
        () => {
            if (is_new)
                backend.post(`/${is_class ? "classes": "events"}/${booking.id}}`, {
                    ...bookingData,
                    is_draft: saveAsDraft
                })
            else if (!is_new)
                backend.put(`/${is_class ? "classes": "events"}/${booking.id}}`, {
                    ...bookingData,
                    is_draft: saveAsDraft
                })
            onClose()
        }
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>{title}</ModalHeader>
                  <ModalBody>
                      <BookingForm updateCallback={setBookingData}/>
                      {
                          is_class ? <ClassForm updateCallback={setClassData}/> :
                                     <EventForm updateCallback={setEventData}/> 
                      }
                  </ModalBody>

                  <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={openConfirmation(true)}>
                      Save As Draft
                    </Button>
                    <Button colorScheme='blue' mr={3} onClick={openConfirmation(false)}>
                      Publish
                    </Button>
                  </ModalFooter>
                </ModalContent>
            </Modal>
            <ConfirmationModal  isOpen={isConfOpen} 
                                onClose={onConfClose}
                                saveAsDraft={saveDraft}
                                saveChanges={saveChanges} />
        </>
    )
}


function ConfirmationModal(isOpen, onClose, saveAsDraft, saveChanges)
{
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    {`${saveAsDraft ? "Save As Draft" : "Publish Changes"}`}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {`Are you sure you want to ${saveAsDraft ? "save your changes as a draft?": "publish your changes?"}`}
                </ModalBody>
                <ModalFooter>
                    <HStack>
                        <Button onClick={onClose}>Exit</Button>
                        <Button onClick={saveChanges(saveAsDraft)}>Confirm</Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

