import React, { useCallback, useEffect, useState } from "react";
import NotesCard from "../../Component/Card/NotesCard";
import Navbar from "../../Component/Navbar/Navbar";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Utils/axiosInstance";
import moment from "moment";
import Toast from "../../Component/ToastMessage/Toast";

function Home() {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    type: 'add',
    message: ''
  })

  const [userInfo, setUserInfo] = useState(null);
  const [allNotes, setAllNotes] = useState([]);
  const [isSearch, setIsSearch] = useState(false);

  const navigate = useNavigate();

  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: ''
    })
  }


  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message,
      type
    })
  }


  const handleEditNotes = (noteDetails) => {
    setOpenAddEditModal({isShown: true, type: "edit", data: noteDetails})
  }

  //Get user info
  const getUserInfo = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/get-user");
  
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
    } catch (error) {
      if (error.response?.status === 401) {
        try {
          localStorage.clear();
          navigate("/login");
        } catch (err) {
          console.error("Navigation error:", err);
        }
        
      }
    }
  }, [navigate]);
  
  //Get All Notes
  const getAllNotes = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes");
  
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  }, []);

  //Delete Notes
  const deleteNotes = useCallback(async(data) => {
    try {
      const response = await axiosInstance.delete(`/delete-note/${data._id}`);

      if(response.data && response.data.note){
        getAllNotes();
        showToastMessage('Note Deleted Successfully', 'delete')
      }
    } catch (error) {
      console.log('Error found in delete note ' + error)
    }
  }, [getAllNotes]);


  //Search for Notes
  const searchNotes = useCallback(async (query) => {
    if (!query) {
      if (isSearch) {
        setIsSearch(false);
        getAllNotes();
      }
      return;
    }
    try {
      const response = await axiosInstance.get('/search-notes', { params: { query } });
      if (response.data && response.data.notes) {
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);
  


  // Pinned Notes
  const pinnedNotes = useCallback(async(noteData) => {
    const noteId = noteData._id;
    const newPinnedState = !noteData.isPinned;
    try {
      const response = await axiosInstance.put(`/update-note-pinned/${noteId}`,{
        isPinned: newPinnedState,
      });
      

      if(response.data && response.data.note){
        getAllNotes();
        showToastMessage(newPinnedState ? 'Note Pinned' : 'Note Unpinned');
      }

    } catch (error) {
      console.log('Error found in delete note ' + error)
    }
  }, []);
  
  useEffect(() => {
    getAllNotes();
    getUserInfo();
  }, [getAllNotes, getUserInfo]);

  return (
    <>
      <Navbar userInfo={userInfo} searchNotes={searchNotes} />

      <div className="container mx-auto">
        <div className="grid grid-cols-3 gap-4 mt-4">
          {allNotes && allNotes.length > 0 ? (
            allNotes.map((item) => (
              <NotesCard
                key={item._id}
                title={item.title}
                date={moment(item.createdOn).format("Do MMMM YYYY")}
                content={item.content}
                tags={item.tags}
                isPinned={item.isPinned}
                onEdit={() => handleEditNotes(item)}
                onDelete={() => deleteNotes(item)}
                onPinNote={() => pinnedNotes(item)}
              />
            ))
          ) : (
            <p>No notes available.</p>
          )}
        </div>
      </div>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
        onClick={() =>
          setOpenAddEditModal({ isShown: true, type: "add", data: null })
        }
      >
        <MdAdd className="text-[32px] text-white"/>
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => setOpenAddEditModal({ isShown: false, type: "add", data: null })}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.2)",
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onclose={() =>
            setOpenAddEditModal({ isShown: false, type: "add", data: null })
          }
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
        />
      </Modal>


      <Toast
       isShown={showToastMsg.isShown}
       message={showToastMsg.message}
       type={showToastMsg.type}
       onClose={handleCloseToast}
      />
    </>
  );
}

export default Home;
