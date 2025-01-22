import { useState, useEffect} from 'react';
import { useBackendContext } from '../../contexts/hooks/useBackendContext';
import { useDisclosure } from '@chakra-ui/react';
import { FormControl, FormLabel, FormErrorMessage, FormHelperText } from '@chakra-ui/react';
import { Button, Radio, RadioGroup } from '@chakra-ui/react';
import { HStack } from '@chakra-ui/react';
import { Textarea } from '@chakra-ui/react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';

const ReviewModal = () => {

    const { backend } = useBackendContext();

    const {isOpen, onOpen, onClose} = useDisclosure();
    const [rating, setRating] = useState("");
    const [review, setReview] = useState("");
    const [data, setData] = useState("Loading data");
    const [formSubmitted, setFormSubmitted] = useState(0);

    const handleRatingChange = (event) => {
        setRating(event);
    };

    const handleReviewChange = (event) => {
        setReview(event.target.value);
    };


    // {
    //     class_id: 44,
    //     student_id: 153,
    //     rating: rating,
    //     review: review
    // }

    useEffect(() => {
        const handleFormSubmission = async () => {
            try {
                const postRoute = 'http://localhost:3001/reviews';
                // want to implement this
                // setIsLoading(true);
                const response = await backend.get(postRoute);
                setData(response);
                
            } catch(err) {
                alert(err);
            }
        };

        handleFormSubmission();
    },[formSubmitted, backend])


    return(        
        <>

        <Button onClick={onOpen}>Open Review Modal</Button>

        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Leave a review</ModalHeader>
                <form onSubmit={() => {setFormSubmitted(formSubmitted + 1)}}>
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
                        <Button type="submit">Submit</Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>

        <h1>{!data ? "Loading data" : data.rating}</h1>
        </>
    )

};

export default ReviewModal;