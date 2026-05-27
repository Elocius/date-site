import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarHeart, Clock, Film, Home, Utensils, Coffee, Sparkles } from "lucide-react";

export default function DateRequestWebsite() {
  const [step, setStep] = useState("start");
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [dateType, setDateType] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [confetti, setConfetti] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("idle");

  const dateOptions = [
    { label: "Hemmamys", emoji: "🏠", icon: Home, desc: "Film, snacks och filt" },
    { label: "Bio", emoji: "🎬", icon: Film, desc: "Popcorn ingår såklart" },
    { label: "Restaurang", emoji: "🍝", icon: Utensils, desc: "God mat och bra sällskap" },
    { label: "Fika", emoji: "☕", icon: Coffee, desc: "Kaffe, kaka och prat" },
  ];

  const times = ["16:00", "17:30", "18:00", "19:00", "20:00"];

  function moveNoButton() {
    const isMobile = window.innerWidth < 640;
    const maxX = isMobile ? 85 : 350;
    const maxY = isMobile ? 110 : 250;
    const x = Math.floor(Math.random() * (maxX * 2)) - maxX;
    const y = Math.floor(Math.random() * (maxY * 2)) - maxY;
    setNoPos({ x, y });
  }

  const today = new Date().toISOString().split("T")[0];

  function sayYes() {
    setConfetti(true);
    setStep("activity");
  }

  async function finish(time) {
    setSelectedTime(time);
    setConfetti(true);
    setStep("done");
    setSubmitStatus("sending");

    try {
      const response = await fetch("https://formspree.io/f/xgoqpjde", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          dateType,
          selectedDate,
          selectedTime: time,
          message: `Dejt bokad: ${dateType}, ${selectedDate}, ${time}`,
        }),
      });

      if (!response.ok) {
        throw new Error("Formspree failed");
      }

      setSubmitStatus("sent");
    } catch (error) {
      setSubmitStatus("error");
    }
  }

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-pink-100 via-rose-100 to-purple-200 text-slate-800">
      <FloatingHearts />
      {confetti && <Confetti />}

      <main className="relative z-10 flex min-h-screen items-center justify-center p-5">
        <AnimatePresence mode="wait">
          {step === "start" && (
            <motion.section
              key="start"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-xl rounded-[2rem] bg-white/75 p-8 text-center shadow-2xl backdrop-blur"
            >
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-pink-200 text-4xl shadow-inner">
                💖
              </div>
              <h1 className="mb-3 text-4xl font-black tracking-tight text-rose-600 md:text-5xl">
                Vill du gå på dejt med mig?
              </h1>
              <p className="mb-8 text-lg text-slate-600">
                Välj klokt. Det finns ett rätt svar. 😇
              </p>

              <div className="relative mx-auto flex h-32 items-center justify-center gap-8">
                <button
                  onClick={sayYes}
                  className="rounded-2xl bg-rose-500 px-8 py-4 text-xl font-bold text-white shadow-lg transition hover:scale-105 hover:bg-rose-600"
                >
                  Ja 🥰
                </button>

                <motion.button
                  onPointerMove={moveNoButton}
                  onPointerEnter={moveNoButton}
                  onMouseMove={moveNoButton}
                  onMouseEnter={moveNoButton}
                  onFocus={moveNoButton}
                  onClick={moveNoButton}
                  animate={{ x: noPos.x, y: noPos.y }}
                  transition={{ type: "spring", stiffness: 250, damping: 14 }}
                  className="rounded-2xl bg-slate-200 px-8 py-4 text-xl font-bold text-slate-700 shadow-md"
                >
                  Nej 🙄
                </motion.button>
              </div>
            </motion.section>
          )}

          {step === "activity" && (
            <motion.section
              key="activity"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              className="w-full max-w-3xl rounded-[2rem] bg-white/75 p-8 shadow-2xl backdrop-blur"
            >
              <StepHeader
                icon={<Sparkles className="h-8 w-8" />}
                title="Yay! Vad vill du göra?"
                subtitle="Nu börjar det viktiga planerandet."
              />

              <div className="grid gap-4 md:grid-cols-2">
                {dateOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.label}
                      onClick={() => {
                        setDateType(option.label);
                        setStep("date");
                      }}
                      className="group rounded-3xl bg-white p-5 text-left shadow-md ring-1 ring-pink-100 transition hover:-translate-y-1 hover:bg-pink-50 hover:shadow-xl"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <span className="text-4xl">{option.emoji}</span>
                        <Icon className="h-7 w-7 text-rose-400 transition group-hover:scale-110" />
                      </div>
                      <h2 className="text-2xl font-black text-rose-600">{option.label}</h2>
                      <p className="mt-1 text-slate-600">{option.desc}</p>
                    </button>
                  );
                })}
              </div>
            </motion.section>
          )}

          {step === "date" && (
            <motion.section
              key="date"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              className="w-full max-w-xl rounded-[2rem] bg-white/75 p-8 text-center shadow-2xl backdrop-blur"
            >
              <StepHeader
                icon={<CalendarHeart className="h-8 w-8" />}
                title="Vilket datum passar?"
                subtitle={`Valt: ${dateType} 💕`}
              />

              <input
                type="date"
                min={today}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="mb-6 w-full rounded-2xl border-2 border-pink-200 bg-white px-5 py-4 text-lg outline-none transition focus:border-rose-400"
              />

              <button
                disabled={!selectedDate}
                onClick={() => setStep("time")}
                className="w-full rounded-2xl bg-rose-500 px-8 py-4 text-xl font-bold text-white shadow-lg transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Nästa 💌
              </button>
            </motion.section>
          )}

          {step === "time" && (
            <motion.section
              key="time"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              className="w-full max-w-xl rounded-[2rem] bg-white/75 p-8 shadow-2xl backdrop-blur"
            >
              <StepHeader
                icon={<Clock className="h-8 w-8" />}
                title="Vilken tid?"
                subtitle={`${dateType} den ${selectedDate}`}
              />

              <div className="grid gap-3">
                {times.map((time) => (
                  <button
                    key={time}
                    onClick={() => finish(time)}
                    className="rounded-2xl bg-white px-6 py-4 text-xl font-bold text-rose-600 shadow-md ring-1 ring-pink-100 transition hover:-translate-y-1 hover:bg-pink-50 hover:shadow-xl"
                  >
                    {time} 🕒
                  </button>
                ))}
              </div>
            </motion.section>
          )}

          {step === "done" && (
            <motion.section
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl rounded-[2rem] bg-white/80 p-8 text-center shadow-2xl backdrop-blur"
            >
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-rose-200 text-5xl shadow-inner">
                🥳
              </div>
              <h1 className="mb-4 text-4xl font-black text-rose-600">
                Dejten är bokad!
              </h1>
              <p className="mb-6 text-lg text-slate-700">
                Det blir <span className="font-black text-rose-600">{dateType}</span> den{" "}
                <span className="font-black text-rose-600">{selectedDate}</span> klockan{" "}
                <span className="font-black text-rose-600">{selectedTime}</span>.
              </p>
              <p className="rounded-3xl bg-pink-100 p-5 text-xl font-bold text-rose-700">
                Jag ser redan fram emot det. 💘
              </p>

              {submitStatus === "sending" && (
                <p className="mt-4 text-sm font-bold text-slate-500">
                  Skickar bokningen... 💌
                </p>
              )}

              {submitStatus === "sent" && (
                <p className="mt-4 text-sm font-bold text-green-600">
                  Bokningen är skickad. ✅
                </p>
              )}

              {submitStatus === "error" && (
                <p className="mt-4 text-sm font-bold text-red-500">
                  Bokningen kunde inte skickas, men valet syns här på skärmen. 💕
                </p>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function StepHeader({ icon, title, subtitle }) {
  return (
    <div className="mb-7 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-pink-200 text-rose-600 shadow-inner">
        {icon}
      </div>
      <h1 className="text-3xl font-black text-rose-600 md:text-4xl">{title}</h1>
      <p className="mt-2 text-slate-600">{subtitle}</p>
    </div>
  );
}

function FloatingHearts() {
  const hearts = ["💗", "💕", "💖", "💘", "✨", "🌸", "🥰", "💝"];
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {Array.from({ length: 24 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute text-2xl opacity-60"
          initial={{ y: "110vh", x: `${Math.random() * 100}vw`, rotate: 0 }}
          animate={{ y: "-10vh", rotate: 360 }}
          transition={{
            duration: 9 + Math.random() * 8,
            repeat: Infinity,
            delay: Math.random() * 8,
            ease: "linear",
          }}
        >
          {hearts[i % hearts.length]}
        </motion.span>
      ))}
    </div>
  );
}

function Confetti() {
  const pieces = ["🎉", "✨", "💖", "🌸", "💕", "🥳"];
  return (
    <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
      {Array.from({ length: 42 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute text-2xl"
          initial={{ y: -60, x: `${Math.random() * 100}vw`, rotate: 0, opacity: 1 }}
          animate={{ y: "110vh", rotate: 720, opacity: 0 }}
          transition={{ duration: 2.8 + Math.random() * 1.5, ease: "easeOut" }}
        >
          {pieces[i % pieces.length]}
        </motion.span>
      ))}
    </div>
  );
}
