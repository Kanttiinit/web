import { For } from "solid-js";
import { setState, state } from "../../state";
import { properties } from "../../translations";
import { getArrayWithToggled } from "../../utils";
import { RoundedButton, RoundedButtonContainer } from "../RoundedButton";

export default function PropertySelector(props: {
  showDesiredProperties?: boolean;
}) {
  const isPropertySelected = (propertyKey: string) =>
    state.preferences.properties.some(
      (p) => p.toLowerCase() === propertyKey.toLowerCase(),
    );

  return (
    <RoundedButtonContainer>
      <For
        each={properties.filter((p) =>
          props.showDesiredProperties ? p.desired : !p.desired,
        )}
      >
        {(p) => (
          <RoundedButton
            onClick={() =>
              setState(
                "preferences",
                "properties",
                getArrayWithToggled(state.preferences.properties, p.key),
              )
            }
            color={p.desired ? "var(--friendly)" : "var(--gray3)"}
            selected={isPropertySelected(p.key)}
          >
            {state.preferences.lang === "fi" ? p.name_fi : p.name_en}
          </RoundedButton>
        )}
      </For>
    </RoundedButtonContainer>
  );
}
