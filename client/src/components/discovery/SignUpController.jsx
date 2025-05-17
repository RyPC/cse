import { useCallback, useEffect, useState } from "react";

import { Button } from "@chakra-ui/react";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import ClassInfoModal from "./ClassInfoModal";
import CoReqWarningModal from "./CoReqWarningModal";
import EventInfoModal from "./EventInfoModal";

/*
infoProps: title, location, description, level, date, id, capacity, costume
*/
function SignUpController({
  user,
  openRootModal,
  setOpenRootModal,
  class_id = null,
  event_id = null,
  ...infoProps
}) {
  const { backend } = useBackendContext();
  const { currentUser } = useAuthContext();
  const [openCoreqModal, setOpenCoreqModal] = useState(false);
  const [corequisites, setCorequisites] = useState([]);
  // Is null as a initial state in this case okay? Semantically it makes sense to me.
  const [modalIdentity, setModalIdentity] = useState(null);
  const [coReqResponse, setCoreqResponse] = useState(null);
  const [filteredCorequisites, setFilteredCorequisites] = useState([]);

  const fetchCorequirements = useCallback(async () => {
    const id = class_id !== null ? class_id : event_id;
    // const COREQUISITE_ROUTE =
    //   class_id !== null
    //     ? `/classes/corequisites/${id}`
    //     : `/events/corequisites/${id}`;

    // const response = await backend.get(COREQUISITE_ROUTE);
    if (class_id !== null) {
      // gets associated event of class. At most 1 event coreq per class
      let res = await backend.get(`/classes/corequisites/${id}`);
      const eventCoReqId = res.data[0].id;

      const classCoReqs = await backend.get(
        `/events/corequisites/${eventCoReqId}`
      );
      // setCoreqResponse(classCoReqs);

      // TODO: get event coreq and setCoreqResponse with Promise.all
      res = res.data[0];
      setCoreqResponse([...classCoReqs.data, res]);
    } else {
      await backend.get(`/events/corequisites/${id}`).then((res) => {
        setCoreqResponse(res.data);
      });
    }
  }, [backend, class_id, event_id, currentUser.uid]);

  const toggleRootModal = () => {
    setOpenRootModal(!openRootModal);
  };
  const toggleCoreqModal = () => {
    toggleRootModal();
    setOpenCoreqModal(true);
  };

  useEffect(() => {
    if (coReqResponse) {
      // is this check to see an event okay? Will classes get call times in the future?
      const coreqs = coReqResponse.map((coreq) => {
        const userId = user.data[0].id;

        if (userId === coreq.studentId) {
          return {
            ...coreq,
            enrolled: true,
            isEvent: coreq.callTime ? true : false,
          };
        } else {
          return {
            ...coreq,
            enrolled: false,
            isEvent: coreq.callTime ? true : false,
          };
        }
      });

      // filter out the class associated with the card the user is currently on.
      const filteredCoreqs = coreqs.filter((coreq) => {
        if (class_id) {
          return class_id !== coreq.id;
        }

        if (event_id) {
          return event_id !== coreq.id;
        }
      });

      console.log("Coreqs: ", coreqs);
      console.log("Filtered Coreqs: ", filteredCoreqs);
      setCorequisites(coreqs);
    
      setFilteredCorequisites(filteredCoreqs);
    }
  }, [coReqResponse]);

  useEffect(() => {
    if (openRootModal) {
      fetchCorequirements();
    }
  }, [fetchCorequirements, openRootModal]);

  useEffect(() => {
    // console.log(modalIdentity);
  }, [modalIdentity]);

  if (class_id !== null && event_id !== null) {
    throw new Error("Cannot have both class_id and event_id");
  }
  return (
    <>
      {class_id ? (
        <ClassInfoModal
          isOpenProp={openRootModal}
          id={class_id}
          {...infoProps}
          corequisites={corequisites}
          filteredCorequisites={filteredCorequisites}
          isCorequisiteSignUp={false}
          handleClose={toggleRootModal}
          handleResolveCoreq={toggleCoreqModal}
          user={user}
          modalIdentity={modalIdentity}
          setModalIdentity={setModalIdentity}
        />
      ) : (
        <EventInfoModal
          isOpenProp={openRootModal}
          id={event_id}
          {...infoProps}
          corequisites={corequisites}
          isCorequisiteSignUp={false}
          handleClose={toggleRootModal}
          handleResolveCoreq={toggleCoreqModal}
          user={user}
          modalIdentity={modalIdentity}
          setModalIdentity={setModalIdentity}
        />
      )}

      <CoReqWarningModal
        user={user}
        origin={class_id ? "CLASS" : "EVENT"}
        isOpenProp={openCoreqModal}
        classId={class_id}
        eventId={event_id}
        {...infoProps}
        lstCorequisites={corequisites}
        handleClose={toggleCoreqModal}
        killModal={() => setOpenCoreqModal(false)}
        modalIdentity={modalIdentity}
        setModalIdentity={setModalIdentity}
        filteredCorequisites={filteredCorequisites}
      />

      {/* <Button onClick={() => setOpenRootModal(true)}>View Details</Button> */}
    </>
  );
}

export default SignUpController;
