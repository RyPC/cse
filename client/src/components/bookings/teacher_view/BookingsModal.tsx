import { useEffect, useState } from "react";

import { Modal, ModalOverlay, ModalHeader, ModalBody, ModalCloseButton, ModalContent, ModalFooter, FormControl, FormLabel, Input, Switch, Button, Box, VStack, HStack, useDisclosure } from '@chakra-ui/react';

import {} from "react-icons/fa";

import { useBackendContext } from "../../../contexts/hooks/useBackendContext";
import { Booking, isClass } from "../../../types/booking";

import { BookingForm, ClassForm, EventForm } from "./BookingsForm"

export const EditBookingModal = ({ isOpen, onClose, booking, is_class}: {isOpen, onClose, booking: Booking, is_class: boolean }) => {
    console.log(booking, is_class)
    const { 
        isOpen: isConfOpen,
        onOpen: onConfOpen,
        onClose: onConfClose 
    } = useDisclosure();

    const { backend } = useBackendContext()

    const is_new = booking === null
    const modal_title = `${booking ? "New " : "Draft "} ${is_class ? "Class" : "Event"}` 


    const [bookingData, setBookingData] = useState({
      title: booking?.title ?? '',
      description: booking?.description ?? '',
      location: booking?.location ?? '',
      level: booking?.level ?? '',
      date: booking?.date ?? '',
      start_time: booking?.start_time ?? '',
      end_time: booking?.end_time ?? '',
    })
    const [saveDraft, setSaveDraft] = useState(false)

    const [classData, setClassData] = useState(is_class ? {
      capacity: booking?.capacity ?? 0,
      class_type: booking?.classType ?? "",
    } : {})
    const [eventCoreq, setEventCoreq] = useState(-1)

    const [eventData, setEventData] = useState(!is_class ? {
      call_time: booking?.call_time ?? "",
    } : {})

    const openConfirmation = (saveAsDraft) => {
        setSaveDraft(saveAsDraft)
        onConfOpen()
    }

    // TODO: Add logic for scheduled-classes post req
    const saveChanges = (saveAsDraft) => {
        () => {
            const mergedData = {
                ...bookingData,
                ...classData,
                ...eventData,
                is_draft: saveAsDraft
            }

            if (is_new)
                backend.post(`/${is_class ? "classes": "events"}/${booking.id}`, mergedData)
            else if (!is_new)
                backend.put(`/${is_class ? "classes": "events"}/${booking.id}`, mergedData)
  
            // TODO
            // if (!saveAsDraft && is_class && eventCoreq != -1)
                // class_id = booking.id
                // event_id = eventCoreq
                // POST

            onClose()
        }
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>{modal_title}</ModalHeader>
                  <ModalBody>
                      <BookingForm updateCallback={setBookingData} formData={bookingData}/>
                      {
                          is_class ? <ClassForm updateCallback={setClassData} 
                                                performanceCallback={setEventCoreq}
                                                formData={classData}/> :
                                     <EventForm updateCallback={setEventData} formData={eventData}/> 
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

