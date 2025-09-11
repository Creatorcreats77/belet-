import React, { useEffect, useRef, useState } from "react";
import Keyboard from "simple-keyboard";
import "simple-keyboard/build/css/index.css";

export default function KeyboardInput({ onInputChange }) {
  const keyboardRef = useRef(null);
  const [currentLanguage, setCurrentLanguage] = useState("en"); // default language

  const layouts = {
    en: {
      default: [
        "q w e r t y u i o p {bksp}",
        "a s d f g h j k l .",
        "{shift} z x c v b n m , . {shift}",
        "{alt} {space} {lang} {enter}"
      ],
      shift: [
        "Q W E R T Y U I O P {bksp}",
        "A S D F G H J K L .",
        "{shiftactivated} Z X C V B N M , . {shiftactivated}",
        "{alt} {space} {lang} {enter}"
      ],
      alt: [
        "1 2 3 4 5 6 7 8 9 0 {bksp}",
        "@ # $ % & * ( ) _ .",
        "{shift} - + = / ; : ! ? {shift}",
        "{default} {space} {lang} {enter}"
      ]
    },
    ru: {
      default: [
        "й ц у к е н г ш щ з х {bksp}",
        "ф ы в а п р о л д ж .",
        "{shift} я ч с м и т ь б ю . {shift}",
        "{alt} {space} {lang} {enter}"
      ],
      shift: [
        "Й Ц У К Е Н Г Ш Щ З Х {bksp}",
        "Ф Ы В А П Р О Л Д Ж .",
        "{shiftactivated} Я Ч С М И Т Ь Б Ю , {shiftactivated}",
        "{alt} {space} {lang} {enter}"
      ],
      alt: [
        "1 2 3 4 5 6 7 8 9 0 {bksp}",
        "@ # $ % & * ( ) _ .",
        "{shift} - + = / ; : ! ? {shift}",
        "{default} {space} {lang} {enter}"
      ]
    }
  };

  useEffect(() => {
    keyboardRef.current = new Keyboard({
      onChange: handleChange,
      onKeyPress: handleKeyPress,
      theme: "hg-theme-default hg-theme-ios",
      layout: layouts[currentLanguage],
      layoutName: "default",
      display: {
        "{alt}": ".?123",
        "{shift}": "⇧",
        "{shiftactivated}": "⇧",
        "{enter}": "Gozleg",
        "{bksp}": "⌫",
        "{downkeyboard}": "🞃",
        "{space}": "______",
        "{default}": "ABC",
        "{lang}": currentLanguage.toUpperCase()
      }
    });

    return () => {
      if (keyboardRef.current) {
        keyboardRef.current.destroy();
        keyboardRef.current = null;
      }
    };
  }, [currentLanguage]);

  const handleChange = (inputValue) => {
    if (onInputChange) onInputChange(inputValue);
  };

  const handleKeyPress = (button) => {
    if (button.startsWith("{") && button.endsWith("}")) {
      switch (button) {
        case "{shift}":
        case "{shiftactivated}":
        case "{default}":
          toggleShift();
          break;
        case "{alt}":
          toggleAlt();
          break;
        case "{lang}":
          switchLanguage();
          break;
        default:
          break;
      }
    }
  };

  const toggleShift = () => {
    const currentLayout = keyboardRef.current.options.layoutName;
    const layoutName = currentLayout === "default" ? "shift" : "default";
    keyboardRef.current.setOptions({
      layoutName,
      layout: layouts[currentLanguage]
    });
  };

  const toggleAlt = () => {
    const currentLayout = keyboardRef.current.options.layoutName;
    const layoutName = currentLayout === "alt" ? "default" : "alt";
    keyboardRef.current.setOptions({
      layoutName,
      layout: layouts[currentLanguage]
    });
  };

  const switchLanguage = () => {
    setCurrentLanguage((prev) => (prev === "en" ? "ru" : "en"));
    // Reset layout to default when language changes
    if (keyboardRef.current) {
      keyboardRef.current.setOptions({
        layoutName: "default",
        layout: layouts[currentLanguage === "en" ? "ru" : "en"]
      });
    }
  };

  return <div key={0} className="simple-keyboard" />;
}
