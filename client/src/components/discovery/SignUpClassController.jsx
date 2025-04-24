import { useCallback, useEffect, useState } from "react";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import useSignupStore from "../../stores/SignupStore";
import ClassInfoModal from "./ClassInfoModal";
import SignUpController from "./SignUpController";

function SignUpClassController({
  user,
  openRootModal,
  setOpenRootModal,
  class_id = null,
  event_id = null,
  ...infoProps
}) {
  const coreqStore = useSignupStore();
  const { backend } = useBackendContext();
  const { currentUser } = useAuthContext();
  const [coreqEvent, setCoreqEvent] = useState(null);
  const [openCoreqModal, setOpenCoreqModal] = useState(false);
  const [corequisites, setCorequisites] = useState(null);
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
              return event.classId;
            } else {
              return event.eventId;
            }
          });

        const corequisitesWithEnrollmentStatus = coreq.map((coreq) => {
          if (userEnrollments.includes(coreq.id)) {
            return { ...coreq, enrolled: true };
          }
          return coreq;
        });
        setCorequisites(corequisitesWithEnrollmentStatus);
      } catch (error) {
        console.error("Error fetching enrolled events or users:", error);
      }
    };

    const response = await backend.get(COREQUESITE_ROUTE);
    const coreq = response.data.map((coreq) => ({
      ...coreq,
      enrolled: false,
    }));
    setCorequisites(coreq);
    await fetchEnrollments(coreq);
    setCoreqEvent(coreq[0]);
  }, [backend, class_id, event_id, currentUser.uid, coreqEvent]);

  const toggleRootModal = () => {
    setOpenRootModal(false);
    coreqStore.setOpenRoot(false);
  };
  const toggleCoreqModal = () => {
    setOpenRootModal(!openRootModal);
    coreqStore.setOpenRoot(false);
    setOpenCoreqModal(true);
  };

  useEffect(() => {
    if (coreqStore.openRoot || openRootModal) {
      fetchCorequirements();
    }
  }, [coreqStore.openRoot, openRootModal]);

  return (
    <>
      <ClassInfoModal
        isOpenProp={
          openRootModal ||
          (!openRootModal && coreqStore.openRoot && coreqStore.root == class_id)
        }
        id={class_id}
        {...infoProps}
        corequisites={corequisites}
        isCorequisiteSignUp={false}
        handleClose={toggleRootModal}
        handleResolveCoreq={toggleCoreqModal}
        user={user}
      />
      {coreqEvent && (
        <SignUpController
          event_id={coreqEvent.id}
          title={coreqEvent.title}
          description={coreqEvent.description}
          location={coreqEvent.location}
          capacity={"might remove for events"}
          level={coreqEvent.level}
          costume={coreqEvent.costume}
          date={coreqEvent.date}
          setOpenRootModal={setOpenCoreqModal}
          openRootModal={openCoreqModal}
          override_isCorequisite={true}
          user={user}
        />
      )}
    </>
  );
}

export default SignUpClassController;
