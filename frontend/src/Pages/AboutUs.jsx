import React from "react";
import { useNavigate } from "react-router-dom";

function AboutTutor() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        color: "#222222",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
        About the Tutor
      </h1>
      <p style={{ fontSize: "1.125rem", lineHeight: "1.8" }}>
        Welcome to our course platform! I'm Ali Hassan, a passionate software
        engineer dedicated to helping learners succeed in tech. With years of
        experience in backend engineering, full-stack development, and AI, my
        goal is to make complex concepts simple and practical for every student.
      </p>
      <p style={{ fontSize: "1.125rem", lineHeight: "1.8", marginTop: "1rem" }}>
        This platform is built to help you master modern technologies and
        sharpen your problem-solving skills. Whether you're starting out or
        leveling up, there's something valuable for you here.
      </p>

      <button
        onClick={() => navigate("/")}
        style={{
          marginTop: "2rem",
          padding: "0.75rem 1.5rem",
          backgroundColor: "#222222",
          color: "#ffffff",
          border: "none",
          borderRadius: "0.375rem",
          cursor: "pointer",
          fontSize: "1rem",
        }}
      >
        Go to Home
      </button>
    </div>
  );
}

export default AboutTutor;
