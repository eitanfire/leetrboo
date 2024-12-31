import React, { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
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
        color="outline-danger"
        size="sm"
        className="logout-btn"
        onClick={toggleModal}
      >
        Sign Out
      </Button>

      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Confirm Sign Out</ModalHeader>
        <ModalBody>
          Warning: If you sign out now, your current leaderboard progress will
          not be saved. Are you sure you want to continue?
        </ModalBody>
        <ModalFooter>
          <Button
            className="sign-out-btn"
            color="primary"
            onClick={() => {
              handleLogout();
              toggleModal();
            }}
          >
            Yes, Sign Out
          </Button>{" "}
          <Button className="sign-out-btn" color="secondary" onClick={toggleModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default LogoutButton;
