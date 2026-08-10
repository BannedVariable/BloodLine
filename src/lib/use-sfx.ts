import { useCallback } from "react";
import { useSettings } from "./settings";
import { playUiSound, type UiSound } from "./ui-sound";

/** Plays UI sounds only when the user has explicitly enabled sound. */
export function useSfx() {
  const { sound } = useSettings();
  return useCallback(
    (name: UiSound) => {
      if (sound) playUiSound(name);
    },
    [sound],
  );
}
