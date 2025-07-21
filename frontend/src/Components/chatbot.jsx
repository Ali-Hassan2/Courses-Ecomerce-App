// components/Chatbot.tsx
import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getresponse } from "./api";
import { FaRobot } from "react-icons/fa";

const Chatbot = () => {
  const [isopen, setisopen] = useState(false);
  const [button, showbutton] = useState(true);
  const [prompt, setprompt] = useState('');
  const [replies, setreplies] = useState([]);
  const buttonRef = useRef(null);

  const queryClient = useQueryClient();

  const {
    mutate,
    error,
    isPending
  } = useMutation({
    mutationFn: getresponse,
    onSuccess: (data) => {
      console.log("The data is:", data)
      console.log("The reply is:", data[0]?.reply)
      const botmessages = {
        reply: data[0]?.reply || "No replies received",
        type: 'bot'
      }
      queryClient.invalidateQueries(["post"])
      setreplies((prev) => [...prev, botmessages])
      setprompt('');
    }
  })

  const handlesubmit = async () => {
    if (!prompt.trim()) return
    const userMessages = {
      reply: prompt,
      type: "user"
    }
    setreplies((prev) => [...prev, userMessages])
    mutate({ prompt })
  }

  useEffect(() => {
    const handlesub = (e) => {
      if (buttonRef.current && !buttonRef.current.contains(e.target)) {
        setisopen(false);
        showbutton(true)
      }
    }

    if (isopen) {
      document.addEventListener('mousedown', handlesub);
    }
    else {
      document.removeEventListener('mousedown', handlesub)
    }

    return () => {
      document.removeEventListener('mousedown', handlesub)
    }
  }, [isopen])

  const handleopen = () => {
    setisopen((prev) => !prev);
    showbutton((prev) => !prev)
  };

  const handlecross = () => {
    setisopen(false);
    showbutton(true)
  }

  return (
    <>
      {isPending && (
        <div className="bg-white rounded-full px-4 py-2 shadow">Loading...</div>
      )}
      <div className="fixed bottom-4 right-4 z-50">
        {!isopen && (
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-4 rounded-full shadow-lg cursor-pointer"
            onClick={handleopen}
          >
              <FaRobot  size={30} />
          </button>
        )}

        {isopen && (
          <div
            className="border border-gray-300 h-[500px] w-[300px] bg-white flex flex-col rounded-xl shadow-lg"
            ref={buttonRef}
          >
            {/* Header */}
            <div className="bg-blue-600 text-white py-3 px-4 flex justify-between items-center rounded-t-xl">
              <h1 className="font-semibold text-base">AlitoChat</h1>
              <div className="space-x-2">
                <button
                  onClick={() => {
                    setreplies([]);
                    setprompt('')
                  }}
                  className="bg-white text-blue-600 rounded px-2 font-bold hover:bg-blue-100"
                >
                  R
                </button>
                <button
                  onClick={handlecross}
                  className="bg-white text-red-500 rounded px-2 font-bold hover:bg-red-100"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="response-area flex-1 overflow-y-auto space-y-2 px-3 py-2">
              {replies.map((rep, index) => (
                <div
                  key={index}
                  className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm whitespace-pre-line shadow 
                  ${rep.type === 'user'
                      ? 'bg-blue-500 text-white self-end ml-auto'
                      : 'bg-gray-200 text-black self-start mr-auto'
                    }`}
                >
                  {rep.reply}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="input-area bg-gray-100 w-full h-14 flex items-center px-3 gap-2 border-t">
              <input
                type="text"
                placeholder="Type a message..."
                value={prompt}
                onChange={(e) => setprompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handlesubmit();
                  }
                }}
                className="flex-1 px-3 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                onClick={handlesubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 text-sm"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Chatbot;
