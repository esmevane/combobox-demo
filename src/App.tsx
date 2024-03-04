import { Item } from "@react-stately/collections";
import stringify from "json-stringify-safe";
import { useState } from "react";

import { Combobox } from "./combobox";

import "./App.css";

const items = [
  {
    id: "1",
    name: "Option one",
    render: <div>Option one</div>,
  },
  {
    id: "2",
    name: "Option two",
    render: <div>Option two</div>,
  },
];

type CustomItemShapeWeJustMadeUp = {
  id: string;
  name: string;
  render: JSX.Element;
};

export function ComboboxDemo<GivenItem extends CustomItemShapeWeJustMadeUp>({
  items,
  onStateChange,
}: {
  items: GivenItem[];
  onStateChange: (state: object) => void;
}) {
  const [selection, setSelection] = useState("");
  const [filter, setFilter] = useState("");

  return (
    <Combobox
      items={items.filter((item) =>
        item.name.toLowerCase().includes(filter.toLowerCase())
      )}
      inputValue={filter}
      label="Command"
      dropdown
      selectedKey={selection}
      onStateChange={onStateChange}
      onInputChange={setFilter}
      onSelectionChange={(key) => {
        setSelection(key as string);
      }}
    >
      {(item) => (
        <Item key={item.id} textValue={item.name}>
          <div style={{ display: "flex", gap: "1rem" }}>
            <span>{item.render}</span>
            <span>{selection === item.id && "✔"}</span>
          </div>
        </Item>
      )}
    </Combobox>
  );
}

function ViewComboboxState({ state }: { state: object }) {
  return (
    <>
      <p>Current state:</p>
      <pre>{stringify(state, null, 2)}</pre>
    </>
  );
}

function App() {
  const [comboState, setComboState] = useState({});

  return (
    <div
      style={{ display: "grid", gridTemplate: "'combobox debug' / 1fr 2fr" }}
    >
      <div style={{ gridArea: "debug" }}>
        <ViewComboboxState state={comboState} />
      </div>
      <div style={{ gridArea: "combobox" }}>
        <ComboboxDemo items={items} onStateChange={setComboState} />
      </div>
    </div>
  );
}

export default App;
