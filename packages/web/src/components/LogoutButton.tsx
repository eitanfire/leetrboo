import React, { useState } from "react";
import { Button, Modal, ModalHeader, ModalFooter } from "reactstrap";
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
      <Button
        size="sm"
        className="danger logout-btn"
        onClick={toggleModal}
      >
        Sign Out
      </Button>

      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Confirm Sign Out</ModalHeader>
        <ModalFooter>
          <Button
            className="sign-in-btn"
            color="success"
            onClick={() => {
              handleLogout();
              toggleModal();
            }}
          >
            Yes, Sign Out
          </Button>{" "}
          <Button className="reset-btn" color="danger" onClick={toggleModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default LogoutButton;
