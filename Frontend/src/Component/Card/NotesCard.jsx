import React from 'react'
import { MdOutlinePushPin, MdCreate, MdDelete } from "react-icons/md";

function NotesCard({
  title, 
  date, 
  content, 
  tags, 
  isPinned, 
  onEdit, 
  onDelete, 
  onPinNote,
}) {
  return (
    <div className='border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out'>
      <div className='flex items-center justify-between'>
        <div>
          <h6 className='text-sm font-medium'>{title}</h6>
          <span className='text-xs text-slate-500'>{date}</span>
        </div>

        <MdOutlinePushPin
          className={`icon-btn cursor-pointer ${isPinned ? 'text-primary' : 'text-slate-300'}`}
          onClick={(e) => {
            e.stopPropagation();
            onPinNote();
          }}
        />
      </div>

      <p className='text-xs text-slate-600 mt-2'>{content?.slice(0, 60) || "No content available"}</p>

      <div className='flex items-center justify-between mt-2'>
        <div className='text-xs text-slate-500'>{tags?.length > 0 ? tags.join(", ") : "No tags"}</div>

        <div className='flex items-center gap-2'>
          <MdCreate className='icon-btn cursor-pointer hover:text-green-600' onClick={onEdit} />
          <MdDelete className='icon-btn cursor-pointer hover:text-red-500' onClick={onDelete} />
        </div>
      </div>
    </div>
  )
}

export default NotesCard;
