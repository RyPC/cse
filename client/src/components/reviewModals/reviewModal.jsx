import { useState, useEffect} from 'react';
import { BackendProvider } from '../context/BackendContext'

import { useDisclosure } from '@chakra-ui/react';
import { FormControl, FormLabel, FormErrorMessage, FormHelperText } from '@chakra-ui/react';
import { Button, Radio, RadioGroup } from '@chakra-ui/react';
import { HStack } from '@chakra-ui/react';
import { Textarea } from '@chakra-ui/react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';

import axios from 'axios';

const postRoute = 'http://localhost:3001/reviews';

const ReviewModal = () => {

    const {isOpen, onOpen, onClose} = useDisclosure();
    const [rating, setRating] = useState("");
    const [review, setReview] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleRatingChange = (event) => {
        setRating(event);
    };

    const handleReviewChange = (event) => {
        setReview(event.target.value);
    };

    const handleFormSubmission = async () => {
        try {
            // want to implement this
            // setIsLoading(true);
            await axios.post(postRoute, {
                rating: rating,
                review: review
            });
        } catch(err) {
            alert(err);
        }
    };

    return(        
        <>

        <Button onClick={onOpen}>Open Review Modal</Button>

        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Leave a review</ModalHeader>
                <form onSubmit={handleFormSubmission}>
                    <ModalBody>

                            <FormControl isRequired isInvalid={false}>
                                <FormLabel>Rating</FormLabel>
                                <RadioGroup onChange={handleRatingChange}>
                                    <HStack spacing='20px'>
                                        <Radio value="one star">One star</Radio>
                                        <Radio value="two stars">Two stars</Radio>
                                        <Radio value="three stars">Three stars</Radio>
                                        <Radio value="four stars">Four stars</Radio>
                                        <Radio value="five stars">Five stars</Radio>
                                    </HStack>
                                </RadioGroup>
                                <FormHelperText>Rate this class on a scale from 1 to 5 stars</FormHelperText>
                                <FormErrorMessage>Rating is required</FormErrorMessage>
                            </FormControl>

                            <FormControl onChange={handleReviewChange}>
                                <FormLabel>Review</FormLabel>
                                <Textarea placeholder='Leave a review' />
                                <FormHelperText>Leave a review</FormHelperText>
                                <FormErrorMessage>There is an error with the review.</FormErrorMessage>
                            </FormControl>
                                
                    </ModalBody>

                    <ModalFooter>
                        <Button type="submit" isLoading={isLoading}>Submit</Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
        </>
    )

};

export default ReviewModal;