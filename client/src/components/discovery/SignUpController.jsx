import { useCallback, useEffect, useState } from "react";

import { Button } from "@chakra-ui/react";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import useSignupStore from "../../stores/SignupStore";
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
  override_isCorequisite = false,
  class_id = null,
  event_id = null,
  ...infoProps
}) {
  const coreqStore = useSignupStore();
  const { backend } = useBackendContext();
  const { currentUser } = useAuthContext();
  const [openCoreqModal, setOpenCoreqModal] = useState(false);
  const [corequisites, setCorequisites] = useState([]);

  const fetchCorequirements = useCallback(async () => {
    const id = class_id !== null ? class_id : event_id;
    const COREQUESITE_ROUTE =
      class_id !== null
        ? `/classes/corequisites/${id}`
        : `/events/corequisites/${id}`;

    const ENROLLMENT_ROUTE =
      class_id === null ? "/class-enrollments" : "/event-enrollments";

    const fetchEnrollments = async (coreq) => {
      try {
        const enrollment = await backend
          .get(ENROLLMENT_ROUTE)
          .then((res) => res.data);

        const user = await backend
          .get(`/users/${currentUser.uid}`)
          .then((res) => res.data[0]);

        const userEnrollments = enrollment
          .filter((event) => event.studentId === user.id)
          .map((event) => {
            if (class_id === null) {
              if (event.classId !== coreqStore.root) {
                return event.classId;
              }
            } else {
              return event.eventId;
            }
          });

        const corequisitesWithEnrollmentStatus = coreq
          .filter((x) => x.id !== coreqStore.root)
          .map((coreq) => {
            if (userEnrollments.includes(coreq.id)) {
              return { ...coreq, enrolled: true };
            }
            return coreq;
          });
        console.log(corequisitesWithEnrollmentStatus, coreqStore.root);
        setCorequisites(corequisitesWithEnrollmentStatus);
      } catch (error) {
        console.error("Error fetching enrolled events or users:", error);
      }
    };

    const response = await backend.get(COREQUESITE_ROUTE);
    const coreq = response.data.map((coreq) => ({ ...coreq, enrolled: false }));
    setCorequisites(coreq);
    await fetchEnrollments(coreq);
  }, [backend, class_id, event_id, currentUser.uid]);

  const toggleRootModal = () => {
    setOpenRootModal(!openRootModal);
    coreqStore.setOpenRoot(true);
  };
  const toggleCoreqModal = () => {
    toggleRootModal();
    setOpenCoreqModal(true);
    coreqStore.setOpenRoot(true);
  };

  useEffect(() => {
    if (openRootModal) {
      fetchCorequirements();
    }
  }, [fetchCorequirements, openRootModal]);

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
          isCorequisiteSignUp={override_isCorequisite}
          handleClose={toggleRootModal}
          handleResolveCoreq={toggleCoreqModal}
          user={user}
        />
      ) : (
        <EventInfoModal
          isOpenProp={openRootModal}
          id={event_id}
          {...infoProps}
          corequisites={corequisites}
          isCorequisiteSignUp={override_isCorequisite}
          handleClose={toggleRootModal}
          handleResolveCoreq={toggleCoreqModal}
          user={user}
        />
      )}
      <CoReqWarningModal
        origin={class_id ? "CLASS" : "EVENT"}
        isOpenProp={openCoreqModal}
        lstCorequisites={corequisites}
        handleClose={toggleCoreqModal}
        killModal={() => setOpenCoreqModal(false)}
        user={user}
      />
      {/* <Button onClick={() => setOpenRootModal(true)}>View Details</Button> */}
    </>
  );
}

export default SignUpController;
