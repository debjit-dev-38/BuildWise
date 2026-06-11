import React from 'react'

const Background = () => {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />
      <div style={{ position: "absolute", top: "-20%", right: "-10%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(110,231,183,0.07) 0%, transparent 70%)", filter: "blur(60px)" }} />
      <div style={{ position: "absolute", bottom: "10%", left: "-15%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(129,140,248,0.06) 0%, transparent 70%)", filter: "blur(60px)" }} />
      <div style={{ position: "absolute", top: "50%", left: "40%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(110,231,183,0.04) 0%, transparent 70%)", filter: "blur(40px)" }} />
    </div>
  );
}

export default Background
