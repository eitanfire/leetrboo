import React, { useState } from "react";
import { Modal, ModalHeader, ModalFooter } from "reactstrap";
import { Button } from "@mantine/core";
import { supabase } from "../services/supabaseClient";

const LogoutButton: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = () => setModalOpen(!modalOpen);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      <Button className="danger logout-btn" onClick={toggleModal}>
        Sign Out
      </Button>

      <Modal isOpen={modalOpen} toggle={toggleModal}>
            <ModalHeader
              className="confirm-sign-out-title"
              toggle={toggleModal}
            >
              Confirm Sign Out
            </ModalHeader>
        <ModalFooter>
          <Button
            className="buttons primary"
            onClick={() => {
              handleLogout();
              toggleModal();
            }}
          >
            Yes, Sign Out
          </Button>{" "}
          <Button
            className="buttons secondary
          "
            onClick={toggleModal}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default LogoutButton;
