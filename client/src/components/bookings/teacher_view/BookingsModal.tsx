import { useEffect, useState } from "react";

import { Modal, ModalOverlay, ModalHeader, ModalBody, ModalCloseButton, ModalContent, ModalFooter, FormControl, FormLabel, Input, Switch, Button, Box, VStack, HStack, useDisclosure } from '@chakra-ui/react';

import {} from "react-icons/fa";

import { useBackendContext } from "../../../contexts/hooks/useBackendContext";
import { Booking, isClass } from "../../../types/booking";

import { BookingForm, ClassForm, EventForm } from "./BookingsForm"

export const EditBookingModal = ({ isOpen, onClose, booking, is_class, events}: {isOpen, onClose, booking: Booking, is_class: boolean, events: Event[]}) => {
    const { 
        isOpen: isConfOpen,
        onOpen: onConfOpen,
        onClose: onConfClose 
    } = useDisclosure();
    const { 
        isOpen: isValidOpen,
        onOpen: onValidOpen,
        onClose: onValidClose 
    } = useDisclosure();

    const { backend } = useBackendContext()

    const is_new = booking === null
    const modal_title = `${booking ? "New " : "Draft "} ${is_class ? "Class" : "Event"}` 
    
    const [saveDraft, setSaveDraft] = useState(false)

    const [bookingData, setBookingData] = useState({})

    const [classData, setClassData] = useState(is_class ? {} : null)
    const [eventCoreq, setEventCoreq] = useState(-1)

    const [eventData, setEventData] = useState(!is_class ? {} : null)

    useEffect(() => {
      setBookingData({
          title: booking?.title ?? '',
          description: booking?.description ?? '',
          location: booking?.location ?? '',
          level: booking?.level ?? '',
          date: booking?.date ?? '',
          start_time: booking?.start_time ?? '',
          end_time: booking?.end_time ?? '',
      })

      if (is_class) setClassData({
          capacity: booking?.capacity ?? 0,
          class_type: booking?.classType ?? "",
      }) 
      else setEventData ({
          call_time: booking?.call_time ?? "",
      })
    }, [booking])

    const openConfirmation = (saveAsDraft) => {
        return () => {
            if (!saveAsDraft) {
                const validateData = (data) => {
                    for (let key in data)
                        if ((typeof data[key] === "string" && data[key] == "") ||
                            (typeof data[key] === "number" && data[key] == 0)) {
                            onValidOpen()
                            return false
                        }
                    return true
                }
                let validation = true
                validation &= validateData(bookingData) 
                if (is_class) validation &= validateData(classData)
                else validation &= validateData(eventData)
                if (!validation) return
            } 
            setSaveDraft(saveAsDraft)
            onConfOpen()
        }
    }

    // TODO: Add logic for scheduled-classes post req
    const saveChanges = (saveAsDraft) => {
        return () => {
            const mergedData = {
                ...bookingData,
                ...classData,
                ...eventData,
                isDraft: saveAsDraft
                // is_draft: saveAsDraft
            }

            // ChakraUI being inconsistent
            if (is_class && typeof mergedData["capacity"] === "string")
                mergedData["capacity"] = parseInt(mergedData["capacity"])

            if (is_new)
                backend.post(`/${is_class ? "classes": "events"}/${booking.id}`, mergedData)
            else
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
                      <BookingForm updateCallback={setBookingData} formData={bookingData} />
                      {
                          is_class ? <ClassForm updateCallback={setClassData} 
                                                performanceCallback={setEventCoreq}
                                                formData={classData}
                                                events={events}/> :
                                     <EventForm updateCallback={setEventData} 
                                                formData={eventData}/> 
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
            <ConfirmationModal isOpen={isConfOpen} 
                               onClose={onConfClose}
                               saveAsDraft={saveDraft}
                               save={saveChanges(saveDraft)} />
            <ValidationModal isOpen={isValidOpen} 
                             onClose={onValidClose} />

        </>
    )
}


const ConfirmationModal = ({ isOpen, onClose, saveAsDraft, save }) =>
{
    const saveAndClose = () => {
        save()
        onClose()
    }

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
                        <Button onClick={saveAndClose}>Confirm</Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}


const ValidationModal = ({ isOpen, onClose }) =>
{
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Incomplete Form</ModalHeader>
                <ModalCloseButton />
                <ModalBody>Please ensure that all elements of the form are completed before publishing</ModalBody>
            </ModalContent>
        </Modal>
    )
}

