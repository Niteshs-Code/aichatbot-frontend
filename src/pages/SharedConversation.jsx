import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function SharedConversation() {
  const { shareId } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/conversation/public/${shareId}`)
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  if (!data) return <div>Loading...</div>;

 return (
  <div className="h-screen bg-gray-100 flex justify-center items-center">
  <div className="w-full max-w-3xl bg-white h-[90vh] shadow-lg rounded-xl flex flex-col">

    <div className="p-4 border-b font-semibold text-lg">
      Shared Conversation
    </div>

    <div className="flex-1 overflow-y-auto p-4 space-y-3">

      {data.messages.map((msg, i) => {
        const isUser = i % 2 === 0;

        return (
          <div
            key={i}
            className={`flex ${isUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm shadow
                ${isUser 
                  ? "bg-blue-500 text-white rounded-br-none" 
                  : "bg-gray-200 text-gray-800 rounded-bl-none"}
              `}
            >
              {msg}
            </div>
          </div>
        );
      })}

    </div>

  </div>
</div>
);
}
