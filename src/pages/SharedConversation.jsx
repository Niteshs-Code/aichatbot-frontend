import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";


import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function SharedConversation() {
  const { shareId } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/conversation/public/${shareId}`)
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  if (!data) return <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="flex flex-col items-center gap-6">
        
        {/* Spinner */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-4 border-gray-700"></div>
          <div className="w-20 h-20 rounded-full border-4 border-t-cyan-400 border-r-transparent border-b-transparent border-l-transparent animate-spin absolute top-0 left-0 shadow-[0_0_25px_#22d3ee]"></div>
        </div>

        {/* Text */}
        <p className="text-cyan-400 text-lg tracking-widest animate-pulse">
          Loading...
        </p>

      </div>
    </div>;


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
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code className="bg-gray-200 px-1 rounded">
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {msg}
              </ReactMarkdown>
            </div>
          </div>
        );
      })}

    </div>

  </div>
</div>
);
}
