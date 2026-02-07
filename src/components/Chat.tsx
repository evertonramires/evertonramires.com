import { useRef, type FormEvent } from "react";

export function Chat() {
  const responseInputRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const testEndpoint = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const msg = formData.get("msg") as string;
      inputRef.current!.value = "";
      if (!msg.trim()) {
        return;
      }
      responseInputRef.current!.value += "You: " + msg + "\n";

      // const url = new URL(msg, location.href);
      // console.log(url);
      // const method = formData.get("method") as string;
      // const res = await fetch(url, { method });
      // const data = await res.json();

      await delay(2000); // Simulate network delay
      let res =
        "Work in progress. You can reach me at my linkedin account for now. Thanks!";
      if (!res.trim()) {
        res = "Beg your pardon, what was that?";
      }
      responseInputRef.current!.value += "Everton: " + res + "\n";
      responseInputRef.current?.scrollTo({ top: responseInputRef.current.scrollHeight, behavior: "smooth" });
 
    } catch (error) {
      responseInputRef.current!.value = String(error);
    }
  };

  return (
    <div className="mt-8 mx-auto w-full max-w-2xl text-left flex flex-col gap-4">
      <textarea
        ref={responseInputRef}
        readOnly
        placeholder="Conversation will appear here..."
        className="w-full min-h-[140px] bg-[#1a1a1a] border-2 border-[#fbf0df] rounded-xl p-3 text-[#fbf0df] font-mono resize-y focus:border-[#f3d5a3] placeholder-[#fbf0df]/40"
      />
      <form
        onSubmit={testEndpoint}
        className="flex items-center gap-2 bg-[#1a1a1a] p-3 rounded-xl font-mono border-2 border-[#fbf0df] transition-colors duration-300 focus-within:border-[#f3d5a3] w-full"
      >
        <input
          type="text"
          name="msg"
          ref={inputRef}
          defaultValue="Your current position?"
          className="w-full flex-1 bg-transparent border-0 text-[#fbf0df] font-mono text-base py-1.5 px-2 outline-none focus:text-white placeholder-[#fbf0df]/40"
          placeholder="Enter message..."
        />
        <button
          type="submit"
          className="bg-[#fbf0df] text-[#1a1a1a] border-0 px-5 py-1.5 rounded-lg font-bold transition-all duration-100 hover:bg-[#f3d5a3] hover:-translate-y-px cursor-pointer whitespace-nowrap"
        >
          Send
        </button>
      </form>
      <div className="text-[#fbf0df]/80 text-lg mt-1 flex items-center space-x-4 justify-center font-bold">
      <a href="https://www.linkedin.com/in/evertonramires/">LinkedIn Profile</a>
      <a href="https://github.com/evertonramires/evertonramires.com/">Source Code</a>
    </div>
</div>
  );
}
