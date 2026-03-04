import { useRef, useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { sendMessage } from "../api";

export function Chat() {
  const responseInputRef = useRef<HTMLTextAreaElement>(null);

  const [input, setInput] = useState("Your current position?");

  const mutation = useMutation({
    mutationFn: sendMessage,
  });

  const appendLine = (line: string) => {
    const ta = responseInputRef.current;
    if (!ta) return;

    ta.value += line + "\n";
    ta.scrollTo({ top: ta.scrollHeight, behavior: "smooth" });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const msg = input.trim();
    if (!msg) return;

    appendLine(`You: ${msg}`);
    setInput("");

    try {
      const { message } = await mutation.mutateAsync({ message: msg });

      const res = (message ?? "").trim() || "Beg your pardon, what was that?";
      appendLine(`Everton: ${res}`);
    } catch (err) {
      appendLine(`Error: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  return (
    <div className="mt-8 mx-auto w-full max-w-2xl text-left flex flex-col gap-4">
      <textarea
        ref={responseInputRef}
        readOnly
        placeholder="Conversation will appear here..."
        className="w-full min-h-35 bg-[#1a1a1a] border-2 border-[#fbf0df] rounded-xl p-3 text-[#fbf0df] font-mono resize-y focus:border-[#f3d5a3] placeholder-[#fbf0df]/40"
      />

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 bg-[#1a1a1a] p-3 rounded-xl font-mono border-2 border-[#fbf0df] transition-colors duration-300 focus-within:border-[#f3d5a3] w-full"
      >
        <input
          type="text"
          name="msg"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={mutation.isPending}
          className="w-full flex-1 bg-transparent border-0 text-[#fbf0df] font-mono text-base py-1.5 px-2 outline-none focus:text-white placeholder-[#fbf0df]/40"
          placeholder="Enter message..."
        />

        <button
          type="submit"
          disabled={mutation.isPending}
          className="bg-[#fbf0df] text-[#1a1a1a] border-0 px-5 py-1.5 rounded-lg font-bold transition-all duration-100 hover:bg-[#f3d5a3] hover:-translate-y-px cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? "Sending..." : "Send"}
        </button>
      </form>

      <div className="text-[#fbf0df]/80 text-lg mt-1 flex items-center space-x-4 justify-center font-bold">
        <a href="https://www.linkedin.com/in/evertonramires/">LinkedIn Profile</a>
        <a href="https://github.com/evertonramires/evertonramires.com/">Source Code</a>
      </div>
    </div>
  );
}