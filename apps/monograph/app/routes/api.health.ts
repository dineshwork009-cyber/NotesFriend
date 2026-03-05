export async function loader() {
  return new Response("Healthy", {
    status: 200,
    headers: {
      "Content-Type": "text/plain"
    }
  });
}
