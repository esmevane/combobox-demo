import { useListBox, useOption } from "@react-aria/listbox";
import { AriaComboBoxOptions, useComboBox } from "@react-aria/combobox";
import { ComboBoxState, useComboBoxState } from "@react-stately/combobox";
import { CollectionChildren, Key } from "@react-types/shared";
import { useButton } from "@react-aria/button";
import { useFilter } from "@react-aria/i18n";
import { useOverlay, DismissButton } from "@react-aria/overlays";
import { useEffect, useMemo, useRef } from "react";
import throttle from "lodash/throttle";
import clsx from "clsx";

import styles from "./combobox.module.css";

type OurItemFormat = { id: Key; name: string; render: React.ReactNode };

export function Combobox<GivenItem extends OurItemFormat>({
  open = false,
  dropdown = false,
  onStateChange = () => {},
  ...props
}: Omit<
  AriaComboBoxOptions<GivenItem>,
  "inputRef" | "buttonRef" | "listBoxRef" | "popoverRef"
> & {
  onStateChange?: (state: ComboBoxState<GivenItem>) => void;
  open?: boolean;
  dropdown?: boolean;
  label?: React.ReactNode;
  children?: CollectionChildren<GivenItem>;
}) {
  const throttledOnStateChange = useMemo(
    () => throttle(onStateChange, 1000),
    [onStateChange]
  );
  const filter = useFilter({ sensitivity: "base" });
  const state = useComboBoxState<GivenItem>({
    ...props,
    defaultFilter: filter.contains,
  });

  const buttonRef = useRef(document.createElement("button"));
  const inputRef = useRef(document.createElement("input"));
  const listBoxRef = useRef(document.createElement("ul"));
  const popoverRef = useRef(document.createElement("div"));

  const combobox = useComboBox(
    {
      ...props,
      inputRef,
      buttonRef,
      listBoxRef,
      popoverRef,
      onFocus: () => state.open(),
    },
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

  useEffect(() => {
    throttledOnStateChange(state);
  }, [state, throttledOnStateChange]);

  return (
    <div className={styles.launcher}>
      <div className={styles.command}>
        <label {...combobox.labelProps}>{props.label}</label>
        <div className={styles.controls}>
          <input
            {...combobox.inputProps}
            ref={inputRef}
            onClick={() => state.open()}
            placeholder="Command name"
          />
          {dropdown ? (
            <button {...button.buttonProps} ref={buttonRef}>
              <span aria-hidden="true">▼</span>
            </button>
          ) : null}
        </div>
      </div>
      {state.isOpen || open ? (
        <div
          {...overlay.overlayProps}
          ref={popoverRef}
          className={styles.overlay}
          style={{ position: "absolute", margin: "0 auto" }}
        >
          <ul {...listbox.listBoxProps} ref={listBoxRef}>
            {[...state.collection].map(({ value, rendered }) =>
              value ? (
                <Option key={value.id} id={value.id} state={state}>
                  {rendered}
                </Option>
              ) : null
            )}
            <DismissButton onDismiss={state.close} />
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function Option<GivenItem extends OurItemFormat>({
  id,
  state,
  children,
}: React.PropsWithChildren<{
  id: Key;
  state: ComboBoxState<GivenItem>;
}>) {
  const ref = useRef<HTMLLIElement>(null);
  const option = useOption({ key: id }, state, ref);
  const className = clsx(
    styles.entry,
    option.isFocused ? styles.focused : null,
    option.isSelected ? styles.selected : null
  );

  return (
    <li {...option.optionProps} className={className}>
      {children}
    </li>
  );
}
