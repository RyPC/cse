import React, { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { ClassCard } from "../shared/ClassCard";

const PublishedReviews = () => {
    const { user } = useContext(AuthContext)

    return (
        <ClassCard>
            
        </ClassCard>
    )
}

export default PublishedReviews