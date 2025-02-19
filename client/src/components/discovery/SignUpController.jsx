import { useEffect, useState } from "react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import ClassInfoModal from "./ClassInfoModal";
import CoReqWarningModal from "./CoReqWarningModal";
import SuccessSignupModal from "./SuccessSignupModal";

function SignUpController({ id }) {
  const { backend } = useBackendContext();

  useEffect(() => {}, []);
  return (
    <>
      <ClassInfoModal />
      <CoReqWarningModal />
      <SuccessSignupModal />
    </>
  );
}

export default SignUpController;
