export const speakText = (text, lang = "en-IN") => {
  if (!("speechSynthesis" in window)) {
    alert("Text-to-Speech not supported in this browser");
    return;
  }

  window.speechSynthesis.cancel(); // stop previous speech

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.90;   // natural speed
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  window.speechSynthesis.speak(utterance);
};
