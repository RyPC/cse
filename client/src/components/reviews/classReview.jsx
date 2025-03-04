import { HStack } from "@chakra-ui/react";
import { useState, useEffect } from "react";
// import useAuthContext from "../../contexts/hooks/useAuthContext";
// import StudentReview from "./studentReview";
import { FaStar } from "react-icons/fa6";

const PublishedReviews = ({
    starRating
    }) => {
    const [stars, setStars] = useState(Array(5).fill(0))

    // const { user } = useContext(useAuthContext)
    const [rating, setRating] = useState(starRating)
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

    const colors = {
        orange: "#F2C265",
        grey: "a9a9a9"
    }


    return (
        <div>
            <HStack>
           {stars.map((_, index) => {
              return (
                <>
                   <FaStar
                       key={index}
                       size={24}
                       value={rating}
                       onChange={(e) => setRating(e.target.value)}
                       color={(hoverValue || rating) > index ? colors.orange : colors.grey}
                       onClick={() => handleClickStar(index + 1)}
                       onMouseOver={() => handleMouseOverStar(index + 1)}
                       onMouseLeave={() => handleMouseLeaveStar}
                    />   
                </>
               )
            })}
            </HStack> 
         </div>
      );
      
}

export default PublishedReviews