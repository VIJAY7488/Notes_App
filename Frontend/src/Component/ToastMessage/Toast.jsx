import React, { useEffect } from "react";
import { LuCheck } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";

function Toast({ isShown, message, type, onClose }) {
  useEffect(() => {
    if (!isShown) return;

    const timeoutId = setTimeout(onClose, 3000);

    return () => clearTimeout(timeoutId);
  }, [isShown]);

  if (!isShown) return null; // Prevents unnecessary rendering when toast is hidden

  return (
    <div className="fixed top-20 right-6 transition-all duration-300 z-50 opacity-100">
      <div className={`min-w-52 bg-white border shadow-2xl rounded-md relative after:w-[5px] after:h-full 
          ${type === 'delete' ? 'after:bg-red-500' : 'after:bg-green-500'}
          after:absolute after:left-0 after:top-0 after:rounded-l-lg`}>

        <div className="flex items-center gap-3 px-4 py-2">
          <div className={`w-10 h-10 flex items-center justify-center rounded-full
              ${type === "delete" ? "bg-red-100" : "bg-green-100"}`}>
            {type === 'delete' ? <MdDeleteOutline className="text-xl text-red-500" /> : <LuCheck className="text-xl text-green-500" />}
          </div>

          <p className="text-sm text-slate-800">{message}</p>
        </div>
      </div>
    </div>
  );
}

export default Toast;
