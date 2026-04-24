import React from "react";
import { useTranslation } from "react-i18next";
import { speakText } from "../../src/utils/speakerText";
import { langMap } from "../../src/utils/langMap";
import { PiSpeakerSimpleHighBold } from "react-icons/pi";
const SpeakerButton = ({ textKey }) => {
  const { t, i18n } = useTranslation();

  const handleSpeak = () => {
    const text = t(textKey);
    const lang = langMap[i18n.language] || "en-IN";
    speakText(text, lang);
  };

  return (
    <button
      onClick={handleSpeak}
        aria-label={t("speakerButtonAriaLabel")} 
        title={t("speakerButtonTitle")}>
        <PiSpeakerSimpleHighBold size={24} />
    </button>
  );
}
export default SpeakerButton;