import React, { useState } from 'react';
import {
    VStack,
    Textarea,
    HStack,
    Button,
    Text,
} from '@chakra-ui/react';

const StudentReview = (
    student_name,
    id,
    rating
    ) => {
    const [rating, setRating] = useState(rating)
    const [hoverValue, setHoverValue] = useState(undefined)

    const handleMouseOverStar = value => {
        console.log(value)
        setHoverValue(value)
    };
    
    const handleMouseLeaveStar = () => {
        console.log(value)
        setHoverValue(undefined)
    }

    const handleClickStar = value => {
        console.log(value)
        setRating(value)
    };

    
    return (
        <VStack>
            
        </VStack>
    )
    
};

export default StudentReview;