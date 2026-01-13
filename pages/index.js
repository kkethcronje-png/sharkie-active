export default function Home() {
  return (
    <div style={{
      background: "black",
      color: "white",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column"
    }}>
      <h1 style={{ letterSpacing: "0.3em" }}>SHARKIE ACTIVE</h1>
      <p style={{ marginTop: "20px", opacity: 0.7 }}>
        Preview Build — Coming Soon
      </p>
    </div>
  );
}
