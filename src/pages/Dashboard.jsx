import { useEffect, useState } from "react";
import API from "../services/api";



export default function Dashboard() {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    const res = await API.get("/topics");
    setTopics(res.data);
  };

  const deleteTopic = async (id) => {
    await API.delete(`/topics/${id}`);
    loadTopics();
  };

  return (
  <div className="mt-20 max-w-4xl mx-auto">

  <h2 className="text-2xl font-bold mb-8 text-center">
    Your Conversations
  </h2>
  <p className="text-white/80 mb-10 max-w-2xl mx-auto text-center leading-relaxed">
  Here you can view and manage all your previous conversations. 
  You can quickly delete topics you no longer need and keep your dashboard clean and organized.
</p>

  {topics.length === 0 ? (
    <p className="text-center text-white/80">
      No conversations yet.
    </p>
  ) : (
    <div className="space-y-4">

      {topics.map((t) => (
        <div
          key={t._id}
          className="flex justify-between items-center 
                     p-4 rounded-2xl 
                     bg-white/20 backdrop-blur-md 
                     border border-white/30 
                     hover:bg-white/30 
                     transition duration-300 
                     hover:scale-[1.02]"
        >

          <h4 className="font-semibold">
            {t.title}
          </h4>

          <button
            onClick={() => deleteTopic(t._id)}
            className="px-4 py-1 rounded-full 
                       bg-red-400 hover:bg-red-500 
                       text-black font-semibold 
                       transition shadow-md"
          >
            Delete
          </button>

        </div>
      ))}

    </div>
  )}

</div>
  );
}
