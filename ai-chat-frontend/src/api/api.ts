export async function sendMessage(msg: string) {
  const res = await fetch("http://127.0.0.1:5000/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: msg })
  });

  return res.json();
}
