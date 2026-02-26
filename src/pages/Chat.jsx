import { useState, useEffect, useRef } from "react";
import API from "../services/api";
import { SlOptionsVertical } from "react-icons/sl";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RiShareFill } from "react-icons/ri";
import { FaWhatsapp } from "react-icons/fa";
import { FaTelegramPlane } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { GoSidebarExpand } from "react-icons/go";
import { IoMdSearch } from "react-icons/io";
import { AiOutlineWechat } from "react-icons/ai";
import { CiSettings } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";


// text styleing module
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";





export default function Chat() {
  const [input, setInput] = useState("");
  const [topicTitle, setTopicTitle] = useState("");
  const [topics, setTopics] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentTopicId, setCurrentTopicId] = useState(null); 
  const [search, setSearch] = useState("");
  const [showShare, setShowShare] = useState(false);
const [shareUrl, setShareUrl] = useState("");
const [copied, setCopied] = useState(false);
const [activeMenuId, setActiveMenuId] = useState(null);
const [collapsed, setCollapsed] = useState(false);
const [showSearch, setShowSearch] = useState(false);
const [dark, setDark] = useState(false);
const [slide, setSlide] = useState(false);
const [editingId, setEditingId] = useState(null);
const [newTitle, setNewTitle] = useState("");
const [deleteId, setDeleteId] = useState(null);





const menuRef = useRef(null);

const navigate = useNavigate();


  // all useEffect

 const quickPrompts = [
  "How many hairs are there on a human head?",
  "How was the Earth formed?",
  "Why is the sky blue?",
  "What would happen if humans disappeared tomorrow?"
];

 useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDark(true);
    }
  }, []);

  useEffect(() => {
    if (dark) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  }, [dark]);


  const bottomRef = useRef();

useEffect(() => {
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setActiveMenuId(null);
    }
  };

  const handleScroll = () => {
    setActiveMenuId(null);
  };

  if (activeMenuId) {
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
    window.removeEventListener("scroll", handleScroll);
  };
}, [activeMenuId]);

  

useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);


useEffect(() => {
  fetchTopics();
}, []);


useEffect(() => {
  const fetchTopics = async () => {
    try {
      const res = await API.get("/topics");
      setTopics(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  fetchTopics();
}, []);


// all funtionality funtion

const handleShare = async (conversationId) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("User not logged in");
      return;
    }

    const res = await fetch(
     `${import.meta.env.VITE_API_URL}/api/conversation/share/${conversationId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

   setShareUrl(data.shareLink);
setShowShare(true);
  } catch (error) {
    console.error(error);
  }
};


const renameTopic = (id, oldTitle) => {
  setEditingId(id);
  setNewTitle(oldTitle);
};

const handleRename = async (id) => {
  if (!newTitle.trim()) {
    setEditingId(null);
    return;
  }

  try {
    const res = await API.put(`/topics/${id}`, {
      title: newTitle
    });

    setTopics(
      topics.map((t) =>
        t._id === id ? { ...t, title: res.data.title } : t
      )
    );

    if (currentTopicId === id) {
      setTopicTitle(res.data.title);
    }

    setEditingId(null);

  } catch (err) {
    console.log(err);
  }
};


const fetchTopics = async () => {
  try {
    const res = await API.get("/topics");
    setTopics(res.data);
  } catch (err) {
    console.log(err);
  }
};


const confirmDelete = async () => {
  try {
    await API.delete(`/topics/${deleteId}`);

    setTopics(topics.filter(t => t._id !== deleteId));

    if (currentTopicId === deleteId) {
      setCurrentTopicId(null);
      setMessages([]);
    }

    setDeleteId(null);

  } catch (err) {
    console.log(err);
    setDeleteId(null);
  }
};

const loadTopic = async (topic) => {
  try {
    setCurrentTopicId(topic._id);
    setTopicTitle(topic.title);
    setMessages(topic.messages);
  } catch (err) {
    alert("Failed to load topic");
  }
};






const sendMessage = async () => {

  if (!input.trim()) {
    alert("Please write something first");
    return;
  }

  if (loading) return;

  try {
    setLoading(true);

    let res;

    if (!currentTopicId) {
  res = await API.post("/topics", { title: input });

  setCurrentTopicId(res.data._id);
  setTopicTitle(res.data.title);
  setMessages(res.data.messages);


} else {
  res = await API.post(`/topics/message/${currentTopicId}`, {
    message: input
  });

  setMessages(res.data.messages);
}

    setMessages(res.data.messages);

    setInput("");

  } catch (err) {
    alert(err.response?.data?.message || "Error");
  } finally {
    setLoading(false);
  }
  
};

 return (
  <>
  {showShare && (
  <div className="fixed inset-0 backdrop-blur-lg bg-black/50 flex justify-center items-center z-50 transition-all">

    <div className="relative w-full max-w-md p-[2px] rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 ">

      <div className="bg-white rounded-2xl p-6 shadow-2xl relative">

        {/* Close Button */}
        <button
          onClick={() => setShowShare(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-black text-xl transition cursor-pointer"
        >
          
<IoMdCloseCircle />
        </button>

        <h2 className="text-xl font-semibold text-center mb-6">
          Share Conversation
        </h2>
        


        {/* Share Options Row */}
        <div className="flex justify-center gap-6 mb-6">

          {/* WhatsApp */}
          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center group"
          >
            <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white text-xl shadow-lg group-hover:scale-110 transition">
              <FaWhatsapp />
            </div>
            <span className="text-sm mt-2">WhatsApp</span>
          </a>

          {/* Telegram */}
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center group"
          >
            <div className="w-14 h-14 bg-blue-400 rounded-full flex items-center justify-center text-white text-lg shadow-lg group-hover:scale-110 transition">
              
<FaTelegramPlane />
            </div>
            <span className="text-sm mt-2">Telegram</span>
          </a>

          {/* Twitter */}
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center group"
          >
            <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center text-white text-lg shadow-lg group-hover:scale-110 transition">
              X
            </div>
            <span className="text-sm mt-2">Twitter</span>
          </a>

        </div>

        {/* Link Box */}
        <div className="flex items-center border rounded-xl overflow-hidden shadow-sm">

          <div className="flex-1 px-4 py-3 text-sm truncate bg-gray-50">
            {shareUrl}
          </div>

          <button
            onClick={() => {
              navigator.clipboard.writeText(shareUrl);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="px-5 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:opacity-90 transition"
          >
            {copied ? "Copied ✓" : "Copy"}
          </button>

        </div>

      </div>
    </div>
  </div>
)}
  <div className="flex h-screen ">

    {/* LEFT SIDEBAR */}
   <div
  className={`${
    collapsed ? "lg:w-15 flex-col pt-2  " : "lg:w-60 "
  }
  ${slide ? "w-full h-screen absolute z-2 ": "w-0"}
  transition-all duration-500 ease-in-out border-gray-300 lg:border-r border-none lg:pl-2 pl-0 ${dark ? "bg-black border-gray-400 text-white": "bg-white"} lg:block `}
>  

{/* upparicons */}
<div className=" flex-col justify-center items-center mb-5 pb-4 space-y border-b-2 border-gray-300 ">
{/* expand icon  */}
     <div>
      
      {!collapsed && (<div className="flex items-center justify-between p-1 mb-4 mt-3"> <span className="text-xl font-semibold">
          Zento <span className="text-blue-400">AI</span>

          <button onClick={()=>{setSlide(false)}} className="px-1 p-0.5 rounded-md border-2 border-gray-400 cursor-pointer absolute top-4 right-5 lg:hidden">Back</button>
        </span><button onClick={() => setCollapsed(!collapsed)} className="hidden lg:block">
  <GoSidebarExpand className=" text-xl" />
</button> </div>)} {collapsed && (<div><button className="hidden lg:block" onClick={() => setCollapsed(!collapsed)} >
  <GoSidebarExpand  className="text-xl ml-2 mt-3 "/>
</button></div>)}
     </div> 
     {/* new chat button  */}
     <div><button
  className={`p-1  rounded-md w-full text-left cursor-pointer ${dark ? "hover:bg-gray-700": "hover:bg-gray-200"} `}
  onClick={() => {
    setCurrentTopicId(null);
    setMessages([]);
    setSlide(false);
  }}
> 
 {!collapsed && (<p className="inline"><AiOutlineWechat className="inline text-xl" /> New chat</p>
)} {collapsed && (<AiOutlineWechat className="inline text-2xl" />)}
</button></div>
   {/* search chat button  */}

     <div><button
  onClick={() => setShowSearch(true)}
  className={`p-1  rounded-md w-full text-left cursor-pointer ${dark ? "hover:bg-gray-700": "hover:bg-gray-200"} `}
>
    {!collapsed && (<p className="inline"><IoMdSearch className="inline text-lg"/> Search chats</p>
)}{collapsed && (<IoMdSearch className="inline text-2xl "/> )}
</button></div>


<div><button
   onClick={() => navigate("/Profile")}
  className={`p-1  rounded-md w-full text-left cursor-pointer ${dark ? "hover:bg-gray-700": "hover:bg-gray-200"} `}
>
    {!collapsed && (<p className="inline"><CiSettings className="inline text-lg"/> Setting</p>
)}{collapsed && (<CiSettings className="inline text-2xl "/> )}
</button></div>
</div>





   
     

       

    {!collapsed && (<div className=" p-1 justify-center items-center flex-col ">
      { topics
  .filter(t => t.title.toLowerCase().includes(search.toLowerCase()))
  .map((t) => (
  <div
    key={t._id}
    className={`flex justify-between items-center pl-1 mb-1 rounded cursor-pointer  ${
      currentTopicId === t._id ? "bg-blue-100" : ""
    }
    ${ (dark && currentTopicId === t._id ) ? " bg-gray-700 ":""
}
    ${dark ? "hover:bg-gray-800": ""}
    `}
  >
    {editingId === t._id ? (
  <input
    value={newTitle}
    autoFocus
    onChange={(e) => setNewTitle(e.target.value)}
    onBlur={() => handleRename(t._id)}
    onKeyDown={(e) => {
      if (e.key === "Enter") handleRename(t._id);
    }}
    className="flex-1 bg-transparent outline-none border-b"
  />
) : (
  <span
    onClick={() => loadTopic(t)}
    className="flex-1 cursor-pointer"
  >
    {t.title.length > 15
      ? t.title.slice(0, 15) + "..."
      : t.title}
  </span>
)}

    <div className="flex gap-2">
     
<div className="relative inline-block">

  <button
    onClick={() =>
  setActiveMenuId(activeMenuId === t._id ? null : t._id)
}
    
    className={` ${dark ? "hover:bg-gray-700" : "hover:bg-gray-200"} p-2 duration-300 cursor-pointer rounded-full`}
  >
    <SlOptionsVertical/>
  </button>

  {activeMenuId === t._id  && (
    
    <div
      ref={menuRef}
      className={`absolute right-0 mt-2 w-30 rounded-xl shadow-xl border-gray-400 border p-1 z-50  ${dark ? "bg-blackborder-2 bg-black" : "bg-white"}`}
    >
      <button className={`border-gray-400  items-center  justify-center flex w-full text-left px-1 py-1 ${dark ? "hover:bg-gray-700": "hover:bg-gray-200"} rounded-md cursor-pointer`}   onClick={() => renameTopic(t._id, t.title)}>
        <CiEdit  className="inline mr-2"/> Rename
      </button>

      <button className={`border-gray-400 items-center  justify-center flex w-full text-left px-1 py-1 ${dark ? "hover:bg-gray-700": "hover:bg-gray-200"} rounded-md cursor-pointer text-red-500`}   onClick={() => setDeleteId(t._id)}>
       <RiDeleteBin6Line  className="inline mr-2"/> Delete
      </button>

      <button className={`border-gray-400 items-center  justify-center flex w-full text-left px-1 py-1 ${dark ? "hover:bg-gray-700": "hover:bg-gray-200"}  rounded-md cursor-pointer`} onClick={() => {
  setActiveMenuId(null);
  handleShare(t._id);
}}>
        
<RiShareFill  className="inline mr-2"/>Share
      </button>
    </div>
  )}

</div>
  
</div>

  </div>
))}
</div>)}
   


    </div>

    {/* RIGHT CHAT AREA */}
    <div className={`w-full  flex flex-col relative  ${dark ? "bg-black text-white": "bg-white"} `}>
      <button
      onClick={()=>{setSlide(true)}}
       className={`p-1 absolute   block z-5 top-3  text-xl left-2 lg:hidden ${slide ? "hidden":'block'} ${dark ? "text-white bg-gray-800 ": " text-black bg-white/25" }`} ><GiHamburgerMenu /></button> 
<button
        onClick={() => setDark(!dark)}
        className={`cursor-pointer p-0.5  rounded-md lg:text-[15px]  py-1 absolute w-25 top-2.5 lg:right-8   text[10px]  right-2    ${
          dark ? "bg-gray-800 text-white border-gray-100 border-2" : "bg-gray-400 text-black font-semibold"
        }`}
      >
        {dark ? "Dark Theme " : "Light Theme "}
      </button>
      <h2 className={`text-2xl font-semibold mb-1 text-center lg:pb-2 pb-4 pt-2 border-b-2 border-gray-300 ${dark?" text-white bg-black border-gray-500":"text-black bg-white"}`}>Zento </h2>

 
<div className={`h-[83%] flex justify-center `}>
  <div className="lg:w-4/5 w-full max-w-3xl flex flex-col  rounded-xl lg:my-2 mb-8">

    {/* Messages Container */}
    <div className="flex-1 overflow-y-auto p-2 no-scrollbar">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`p-3 my-2   break-words ${
            msg.startsWith("User:")
              ? "bg-blue-100 ml-auto rounded-2xl rounded-br-md text-right max-w-100"
              : " mr-auto rounded-2xl rounded-bl-md text-left"
          }  ${ dark && msg.startsWith("User") ? " text-white bg-gray-800 ":" "}`}
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
      ))}

      <div ref={bottomRef}></div>
    </div>

  </div>
</div>


{/* Quick Prompts */}
{(messages.length === 0 && input.trim() === "") && (
  <div className="flex flex-col items-center justify-center h-full text-center mb-60 px-6">

    <h2 className={`text-2xl font-semibold mb-8 ${dark ? "text-white" : "text-gray-800"}`}>
      What would you like to work on?
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
      {quickPrompts.map((prompt, index) => (
        <button
          key={index}
          onClick={() => {setInput(prompt); 
          
          }}
          className={`p-2 rounded-xl border text-left transition ${
            dark
              ? "border-gray-600 hover:bg-gray-700 text-white"
              : "border-gray-300 hover:bg-gray-100 text-gray-800"
          }`}
        >
          {prompt}
        </button>
      ))}
    </div>

  </div>
)}


{/* input bar */}
      <div className="flex items-center justify-center  ">
  <div className="w-full max-w-3xl px-4  absolute bottom-6">
    
    <div className="flex items-center   shadow-md shadow-blue-400 rounded-full px-4 py-2 border border-gray-400 focus-within:ring-2 focus-within:ring-blue-400 transition ">

      <input
        className={`flex-1 bg-transparent outline-none px-3 py-1  ${dark ? "text-white" : "text-gray-700"} placeholder-gray-400`}
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") sendMessage();
        }}
        disabled={loading}
      />

      <button
        onClick={sendMessage}
        disabled={loading}
        className="ml-2 flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 transition disabled:bg-gray-400"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        )}
      </button>

    </div>

  </div>
</div>


    </div>
      

      {/* for search modal */}
      {showSearch && (
  <div className="fixed inset-0 backdrop-blur-xl bg-black/40 flex justify-center items-start pt-40 z-50">

    <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl p-5 relative">

      {/* Close Button */}
      <button
        onClick={() => setShowSearch(false)}
        className="absolute right-5 top-5 text-gray-400 hover:text-black text-3xl cursor-pointer"
      >
        
<IoMdClose />
      </button>

      {/* Search Input */}
      <input
        autoFocus
        placeholder="Search conversations..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full text-lg outline-none border-none focus:ring-0"
      />
 { topics
  .filter(t => t.title.toLowerCase().includes(search.toLowerCase()))
  .map((t) => (
  <div
    key={t._id}
    className={`flex justify-between items-center pl-1 mb-1 rounded cursor-pointer hover:bg-gray-200 ${
      currentTopicId === t._id ? "bg-blue-100" : ""
    }`}
  >
    <span onClick={() => {loadTopic(t), setShowSearch(false), setSlide(false)}} className="flex-1">
      {t.title.length  > 30 ? t.title.slice(0, 30) +"..." : t.title}
    </span>

  </div>
))}
    </div>
   
  </div>
)}

{/* for delete modal  */}
{deleteId && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/30 bg-opacity-50 z-50">
    <div className={`w-80 p-5 rounded-xl shadow-lg ${
      dark ? "bg-gray-800 text-white" : "bg-white text-black"
    }`}>
      
      <h3 className="text-lg font-semibold mb-3">
        Delete Topic?
      </h3>

      <p className="text-sm mb-5 opacity-80">
        This action cannot be undone.
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setDeleteId(null)}
          className="px-4 py-1 rounded-md bg-gray-400 text-white"
        >
          Cancel
        </button>

        <button
          onClick={confirmDelete}
          className="px-4 py-1 rounded-md bg-red-500 text-white"
        >
          Delete
        </button>
      </div>

    </div>
  </div>
)}





  </div>
  </>
);


}
