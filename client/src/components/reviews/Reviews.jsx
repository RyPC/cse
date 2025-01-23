import ReviewModal from '../reviewModals/reviewModal.jsx';
import ReviewSubmittedModal from '../reviewModals/reviewSubmittedModal.jsx';
import ReviewFailureModal from '../reviewModals/reviewSubmittedModal.jsx';

export const Reviews = () => {
    return(
        <>
            <ReviewModal/>
            <ReviewSubmittedModal/>
            <ReviewFailureModal/>
        </>
    )
};

