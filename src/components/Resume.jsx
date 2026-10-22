import { useEffect } from "react";

export default function Resume() {
  useEffect(() => {
    window.location.href = "/files/sophia-xing-resume.pdf";
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "20%" }}>
      <h2>Redirecting to my resume...</h2>
      <p>If it doesn’t open automatically, <a href="/files/sophia-xing-resume.pdf">click here</a>.</p>
    </div>
  );
}