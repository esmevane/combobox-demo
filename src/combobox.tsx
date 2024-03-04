import { useListBox, useOption } from "@react-aria/listbox";
import { AriaComboBoxOptions, useComboBox } from "@react-aria/combobox";
import { ComboBoxState, useComboBoxState } from "@react-stately/combobox";
import { CollectionChildren } from "@react-types/shared";
import { useButton } from "@react-aria/button";
import { useFilter } from "@react-aria/i18n";
import { useOverlay, DismissButton } from "@react-aria/overlays";
import { FocusScope } from "@react-aria/focus";
import { useEffect, useRef } from "react";
import clsx from "clsx";

import styles from "./combobox.module.css";

export function Combobox<
  GivenItem extends { id: string; name: string; render: React.ReactNode }
>({
  open = false,
  dropdown = false,
  onStateChange,
  ...props
}: Omit<
  AriaComboBoxOptions<GivenItem>,
  "inputRef" | "buttonRef" | "listBoxRef" | "popoverRef"
> & {
  open?: boolean;
  onStateChange?: (
    state: Pick<
      ComboBoxState<GivenItem>,
      | "isFocused"
      | "selectedItem"
      | "selectedKey"
      | "collection"
      | "disabledKeys"
      | "isOpen"
      | "inputValue"
      | "focusStrategy"
      | "realtimeValidation"
      | "displayValidation"
    >
  ) => void;
  dropdown?: boolean;
  label?: React.ReactNode;
  children?: CollectionChildren<GivenItem>;
}) {
  const filter = useFilter({ sensitivity: "base" });
  const state = useComboBoxState<GivenItem>({
    ...props,
    defaultFilter: filter.contains,
  });

  const buttonRef = useRef(document.createElement("button"));
  const inputRef = useRef(document.createElement("input"));
  const listBoxRef = useRef(document.createElement("div"));
  const popoverRef = useRef(document.createElement("div"));

  const combobox = useComboBox(
    { ...props, inputRef, buttonRef, listBoxRef, popoverRef },
    state
  );

  const button = useButton(combobox.buttonProps, buttonRef);
  const listbox = useListBox(combobox.listBoxProps, state, listBoxRef);
  const overlay = useOverlay(
    {
      isOpen: state.isOpen,
      onClose: state.close,
      shouldCloseOnBlur: true,
      isDismissable: true,
    },
    popoverRef
  );

  // These values are "safe" to pull from the combobox state because they are
  // friendly to serialization, don't have circular references, and have no
  // functions.
  //
  const {
    isFocused,
    selectedItem,
    selectedKey,
    collection,
    disabledKeys,
    isOpen,
    inputValue,
    focusStrategy,
    realtimeValidation,
    displayValidation,
  } = state;

  useEffect(() => {
    console.log("State change:", {
      isFocused,
      selectedItem,
      selectedKey,
      collection,
      disabledKeys,
      isOpen,
      inputValue,
      focusStrategy,
      realtimeValidation,
      displayValidation,
    });
    onStateChange?.({
      isFocused,
      selectedItem,
      selectedKey,
      collection,
      disabledKeys,
      isOpen,
      inputValue,
      focusStrategy,
      realtimeValidation,
      displayValidation,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    collection,
    disabledKeys,
    displayValidation,
    focusStrategy,
    inputValue,
    isFocused,
    isOpen,
    realtimeValidation,
    selectedItem,
    selectedKey,
  ]);

  return (
    <div>
      <div className={styles.launcher}>
        <div>
          <label>
            <span {...combobox.labelProps}>{props.label}</span>
            <div>
              <input
                {...combobox.inputProps}
                ref={inputRef}
                placeholder="Command name"
              />
              {dropdown ? (
                <button {...button.buttonProps} ref={buttonRef}>
                  <span aria-hidden="true">▼</span>
                </button>
              ) : null}
            </div>
          </label>
        </div>
        {state.isOpen || open ? (
          <FocusScope restoreFocus>
            <div>
              <div
                {...overlay.overlayProps}
                ref={popoverRef}
                className={styles.launcher}
                style={{ position: "absolute", margin: "0 auto" }}
              >
                <div>
                  <div>
                    <div {...listbox.listBoxProps} ref={listBoxRef}>
                      {[...state.collection].map((item) =>
                        item && item.value ? (
                          <Option
                            key={item.value.id}
                            id={item.value.id}
                            state={state}
                          >
                            <div
                              className={clsx(
                                state.isFocused ? "focused" : null,
                                state.selectedKey === item.value.id
                                  ? "selected"
                                  : null
                              )}
                            >
                              {item.rendered}
                            </div>
                          </Option>
                        ) : null
                      )}
                      <DismissButton onDismiss={state.close} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FocusScope>
        ) : null}
      </div>
    </div>
  );
}

function Option<GivenItem extends object>({
  id,
  state,
  children,
}: React.PropsWithChildren<{
  id: string;
  state: ComboBoxState<GivenItem>;
}>) {
  const ref = useRef<HTMLLIElement>(null);
  const option = useOption({ key: id }, state, ref);
  const className = clsx(
    styles.button,
    option.isFocused ? styles.focused : null
  );

  return (
    <div {...option.optionProps} className={className}>
      <div className={styles.command}>{children}</div>
    </div>
  );
}
